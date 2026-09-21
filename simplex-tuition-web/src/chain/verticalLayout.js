// The skills chain turned on its side for a phone: Kindergarten at the top, Year 12
// at the bottom. Number, algebra and calculus (the spine) run down the left; measurement,
// geometry and data attach on the right. A dependency that skips past other cards runs
// down a gutter between columns, so the gutters read as the trunk of the chain and no
// line is ever hidden behind a card.
//
// Pure data in, pure geometry out. `only` (a Set of ids) lays out just one skill's path.

// rowGap and levelGap are generous on purpose: the space between rows is where a parent reads which link goes where.
const BASE = { padX: 12, gutter: 30, rowGap: 40, levelGap: 58, nodeH: 70, bandHead: 48, bandPad: 22, bandFoot: 10 };

export function columnsFor(width) {
  if (width < 520) return { spine: 1, side: 1 };
  if (width < 820) return { spine: 2, side: 1 };
  return { spine: 3, side: 2 };
}

export function layoutVertical(data, width, { only = null, scale = 1 } = {}) {
  const K = Object.fromEntries(Object.entries(BASE).map(([k, v]) => [k, v * scale]));
  const byId = new Map(data.skills.map((s) => [s.id, s]));
  const shown = data.skills.filter((s) => !only || only.has(s.id));
  const visible = new Set(shown.map((s) => s.id));
  const cols = columnsFor(width);
  const nCols = cols.spine + cols.side;
  const colW = (width - K.padX * 2 - K.gutter * (nCols - 1)) / nCols;
  const colX = (c) => K.padX + c * (colW + K.gutter);

  // Depth inside a band: the longest run of same-band prerequisites underneath.
  const depth = new Map();
  const depthOf = (id) => {
    if (depth.has(id)) return depth.get(id);
    const s = byId.get(id);
    const below = s.needs.filter((n) => visible.has(n) && byId.get(n).band === s.band).map((n) => depthOf(n) + 1);
    depth.set(id, below.length ? Math.max(...below) : 0);
    return depth.get(id);
  };

  const nodes = new Map();
  const bands = [];
  let y = 0;
  for (const band of data.bands) {
    const mine = shown.filter((s) => s.band === band.key);
    if (!mine.length) continue;
    const top = y;
    y += K.bandHead + K.bandPad;
    const levels = Math.max(...mine.map((s) => depthOf(s.id))) + 1;
    for (let d = 0; d < levels; d++) {
      const level = mine.filter((s) => depthOf(s.id) === d);
      const place = (list, firstCol, n) => list.forEach((s, i) => nodes.set(s.id, {
        id: s.id, skill: s, col: firstCol + (i % n), x: colX(firstCol + (i % n)), y: y + Math.floor(i / n) * (K.nodeH + K.rowGap), w: colW, h: K.nodeH,
      }));
      const spine = level.filter((s) => s.spine);
      const side = level.filter((s) => !s.spine);
      place(spine, 0, cols.spine);
      place(side, cols.spine, cols.side);
      const rows = Math.max(Math.ceil(spine.length / cols.spine), Math.ceil(side.length / cols.side), 1);
      y += rows * (K.nodeH + K.rowGap) - K.rowGap + K.levelGap;
    }
    y += K.bandFoot - K.levelGap + K.bandPad;
    bands.push({ key: band.key, label: band.label, course: band.course, years: band.years, top, height: y - top, count: mine.length });
  }

  // Links leave the bottom of a card and arrive, with an arrowhead, at the top of a later one.
  // To keep them readable where rows are close together:
  //  - a link leaves from the half of the card nearest the gutter and arrives a little further in,
  //    so departures and arrivals never sit on top of each other;
  //  - the departure curve uses only the upper part of the gap below its card, the arrival curve only
  //    the lower part of the gap above its card, so the two never cross in the same space;
  //  - anything that is not a plain drop to the card directly beneath travels down a gutter.
  const edges = [];
  const bend = K.rowGap * 0.44;
  for (const s of shown) {
    for (const need of s.needs) {
      if (!visible.has(need)) continue;
      const a = nodes.get(need);
      const b = nodes.get(s.id);
      const y1 = a.y + a.h, y2 = b.y;
      let d;
      if (a.col === b.col && y2 - y1 <= K.levelGap + 1) {
        const x = a.x + a.w * 0.28; // plain drops keep to the outer side, away from the gutter traffic
        d = `M${x},${y1} L${x},${y2}`;
      } else {
        const g = a.col === b.col ? (a.col === nCols - 1 ? a.col - 1 : a.col) : Math.min(a.col, b.col);
        const gx = colX(g) + colW + K.gutter / 2;
        const side = (n, near) => (n.x + n.w / 2 < gx ? n.x + n.w * near : n.x + n.w * (1 - near));
        const x1 = side(a, 0.8), x2 = side(b, 0.6);
        d = `M${x1},${y1} C${x1},${y1 + bend} ${gx},${y1} ${gx},${y1 + bend} L${gx},${y2 - bend} C${gx},${y2} ${x2},${y2 - bend} ${x2},${y2}`;
      }
      edges.push({ from: need, to: s.id, d });
    }
  }
  return { nodes: [...nodes.values()], edges, bands, width, height: y, colW };
}

// Everything underneath a skill, and everything it opens up.
export function lineage(data, id) {
  const byId = new Map(data.skills.map((s) => [s.id, s]));
  const walk = (next) => {
    const seen = new Set();
    const queue = [...next(byId.get(id))];
    while (queue.length) { const cur = queue.pop(); if (seen.has(cur) || !byId.has(cur)) continue; seen.add(cur); queue.push(...next(byId.get(cur))); }
    return seen;
  };
  return { below: walk((s) => s.needs), above: walk((s) => s.leadsTo) };
}
