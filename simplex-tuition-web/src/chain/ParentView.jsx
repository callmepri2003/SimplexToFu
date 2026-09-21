// The parent's view of the skills chain, built for a tired parent on a phone.
//
// ONE IDEA PER SCREEN. The parent taps the skill their child is stuck on and sees how many
// earlier skills sit underneath it. That is the whole page. It must stay this small:
//   - it never diagnoses (no quiz, no verdict, no "start here"). "Which one is it?" is left open
//     on purpose;
//   - one interaction (tap a skill), one colour (rust = what it depends on);
//   - NO calls to action. No buttons that sell, no pitch, no mention of a diagnostic. The page that
//     hosts this component decides what, if anything, comes after it.
// Before adding anything, ask whether a parent on three hours of sleep needs it. They do not.
//
// PORTABLE. React plus the shape of simplexSkillsChain/rendered/parents.json. No API calls, no
// imports from outside this folder, no ids or syllabus codes on screen. Client-side only: it
// measures the screen, so a server-rendered host mounts it after hydration.
// Living under a host's pinned header: set the CSS variable --pv-offset on an ancestor to the
// header's height; the year strip, the stage headers and every scroll calculation respect it.
// Living beside a router: its state is kept under one key (`chain`) of history.state and merged
// with whatever is already there, so a router's own entries are never overwritten.
//   <ParentView data={parentsJson} onEvent={(name, params) => ...} onFocus={(skill) => ...} />
// onEvent is for analytics:  chain_year { year }   chain_skill { topic, stage }   chain_path { topic, earlierSkills }
// onFocus is for the host's own page: called with { topic, line, earlierSkills } for the skill whose
// chain is lit up (in a path, the skill the path belongs to), and with null when nothing is.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VerticalChain from "./VerticalChain";
import { lineage } from "./verticalLayout";

const YEARS = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const DEFAULT_COPY = {
  brand: "Simplex Tuition",
  title: "Stuck in maths? See why.",
  lead: "Maths is a chain. Tap the skill your child finds hard.",
  pathNote: "Scroll up to see them. A gap in any one causes trouble here. The hard part is knowing which one.",
};

const readHash = () => Object.fromEntries(new URLSearchParams(window.location.hash.replace(/^#/, "")));
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function ParentView({ data, onEvent = null, onFocus = null, copy: copyOverride = null, switcher = null }) {
  const copy = { ...DEFAULT_COPY, ...copyOverride };
  const byId = useMemo(() => new Map(data.skills.map((s) => [s.id, s])), [data]);
  const bandByKey = useMemo(() => new Map(data.bands.map((b) => [b.key, b])), [data]);

  // ui.sel  = the skill being looked at.
  // ui.root = in path mode, the skill whose path is shown. Tapping another card inside a path only
  //           shows what that card means; it never re-draws the path around it.
  // Path mode is in the phone's history, so the Back button returns to the whole chain.
  // A link can name a skill (#skill=<id>) or open straight on its path (#path=<id>).
  const fromHash = useCallback(() => {
    const h = readHash();
    const id = [h.path, h.skill].find((x) => x && byId.has(x)) ?? null;
    return { sel: id, path: Boolean(h.path && id), root: h.path && id ? id : null };
  }, [byId]);
  const [ui, setUi] = useState(fromHash);
  const uiRef = useRef(ui);
  const [activeBand, setActiveBand] = useState(null);
  const layoutRef = useRef(null);
  const toolbar = useRef(null);
  const chainTop = useRef(null);
  const strip = useRef(null);
  // Where the chosen card sat on screen just before the chain was narrowed or widened. The chain is then
  // redrawn around it without it moving, so the parent sees the other skills disappear, not the page jump.
  const anchor = useRef(null);
  const tail = useRef(null);
  const holdCard = (id) => {
    const el = id && document.querySelector(`[data-skill="${id}"]`);
    anchor.current = el ? { id, top: el.getBoundingClientRect().top } : null;
  };

  const pvRoot = useRef(null);
  // How much of the top of the screen is covered: the host's pinned header (--pv-offset) plus our own pinned year strip.
  const covered = useCallback(() => {
    const host = parseFloat(getComputedStyle(pvRoot.current).getPropertyValue("--pv-offset")) || 0;
    return host + (toolbar.current && getComputedStyle(toolbar.current).position === "sticky" ? toolbar.current.offsetHeight : 0);
  }, []);

  const emit = (name, params = {}) => { try { onEvent?.(name, params); } catch { /* analytics must never break the page */ } };

  const go = useCallback((next) => {
    const prev = uiRef.current;
    const merged = { ...prev, ...next };
    if (!merged.sel) merged.path = false;
    merged.root = merged.path ? (prev.path ? prev.root : merged.sel) : null;
    const url = merged.path ? `#path=${merged.root}` : merged.sel ? `#skill=${merged.sel}` : window.location.pathname + window.location.search;
    const state = { ...window.history.state, chain: merged };
    if (merged.path && !prev.path) window.history.pushState(state, "", url); else window.history.replaceState(state, "", url);
    uiRef.current = merged;
    setUi(merged);
  }, []);
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, chain: uiRef.current }, "", window.location.href);
    // Back and Forward carry our state. A link followed while the page is already open carries none, so read it from the address.
    const onPop = (e) => { holdCard(uiRef.current.root ?? uiRef.current.sel); const c = e.state?.chain; const s = c && (c.sel === null || byId.has(c.sel)) ? c : fromHash(); uiRef.current = s; setUi(s); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [byId, fromHash]);
  const leavePath = useCallback(() => {
    if (window.history.state?.chain?.path) window.history.back(); // the popstate handler holds the card
    else { holdCard(uiRef.current.root); go({ path: false, sel: uiRef.current.root }); }
  }, [go]);

  const skill = ui.sel ? byId.get(ui.sel) : null;
  const rootId = ui.path ? ui.root : ui.sel; // whose chain is lit up
  const line = useMemo(() => (rootId ? lineage(data, rootId) : null), [data, rootId]);
  const only = useMemo(() => (ui.path && line ? new Set([...line.below, rootId]) : null), [ui.path, rootId, line]);
  const count = line ? line.below.size : 0;
  const rootSkill = rootId ? byId.get(rootId) : null;
  const peeking = ui.path && ui.sel !== ui.root; // looking at one card inside a path
  useEffect(() => {
    onFocus?.(rootSkill ? { topic: rootSkill.topic, line: rootSkill.line, earlierSkills: count } : null);
  }, [onFocus, rootSkill, count]);

  // ── scrolling: the pinned year strip follows the page, and the stage headers pin under it ──
  useEffect(() => {
    const set = () => document.documentElement.style.setProperty("--pv-toolbar-h", `${toolbar.current && getComputedStyle(toolbar.current).position === "sticky" ? toolbar.current.offsetHeight : 0}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(toolbar.current);
    window.addEventListener("resize", set); // rotating the phone can pin or unpin the toolbar
    return () => { ro.disconnect(); window.removeEventListener("resize", set); };
  }, []);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const layout = layoutRef.current;
        if (!layout || !chainTop.current) return;
        const y = covered() + 80 - chainTop.current.getBoundingClientRect().top;
        const band = [...layout.bands].reverse().find((b) => b.top <= y) ?? layout.bands[0];
        setActiveBand((cur) => (cur === band?.key ? cur : band?.key ?? null));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.cancelAnimationFrame(frame); };
  }, [covered]);
  useEffect(() => {
    const row = strip.current;
    const on = row?.querySelector('[aria-current="true"]');
    if (on) row.scrollTo({ left: on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2, behavior: "smooth" });
  }, [activeBand]);

  const scrollToY = (y) => window.scrollTo({ top: Math.max(0, y), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const chainY = () => chainTop.current.getBoundingClientRect().top + window.scrollY - covered();
  const jumpToBand = (key) => { const b = layoutRef.current?.bands.find((x) => x.key === key); if (b) scrollToY(chainY() + b.top + 1); };

  const chooseYear = (y) => {
    emit("chain_year", { year: y });
    const key = data.bands.find((b) => b.years.includes(y)).key;
    if (ui.path) { go({ sel: null }); window.setTimeout(() => jumpToBand(key), 60); } else jumpToBand(key);
  };

  // When the chain is redrawn (narrowed to a path, or widened again), keep the chosen card exactly where it
  // was on screen. "instant" matters: a host page may set scroll-behavior: smooth, and a glide here is the
  // page jump we are avoiding. Arriving by a link, there is no "before", so the card is simply brought into view.
  const onLayout = useCallback((layout) => {
    const rebuilt = !layoutRef.current || layoutRef.current.nodes.length !== layout.nodes.length;
    layoutRef.current = layout;
    const { sel, root } = uiRef.current;
    const id = root ?? sel;
    const n = id && layout.nodes.find((x) => x.id === id);
    if (!rebuilt || !n) return;
    const held = anchor.current?.id === id ? anchor.current.top : null;
    anchor.current = null;
    window.requestAnimationFrame(() => {
      const cardY = chainTop.current.getBoundingClientRect().top + window.scrollY + n.y;
      const onScreenAt = held ?? Math.max(covered() + 60, window.innerHeight * 0.35);
      const want = Math.max(0, cardY - onScreenAt);
      // The chosen skill is the LAST card of its own path, so a narrowed page can be too short to keep it
      // where it was. Add just enough room under the chain for that, and none when it is not needed.
      tail.current.style.height = "0px";
      const short = want - (document.documentElement.scrollHeight - window.innerHeight);
      if (short > 0) tail.current.style.height = `${Math.ceil(short)}px`;
      window.scrollTo({ top: want, behavior: "instant" });
    });
  }, [covered]);

  // Keep a tapped card clear of the dock that rises over the bottom of the screen.
  const select = (id) => {
    if (id) emit("chain_skill", { topic: byId.get(id).topic, stage: byId.get(id).band });
    // inside a path, tapping empty space or the same card again just puts the card down
    go({ sel: id ?? (uiRef.current.path ? uiRef.current.root : null) });
    if (!id) return;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      const el = document.querySelector(`[data-skill="${id}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dockTop = document.querySelector(".pv-dock")?.getBoundingClientRect().top ?? window.innerHeight;
      const ceiling = covered() + 52;
      if (r.bottom > dockTop - 14) window.scrollBy({ top: r.bottom - (dockTop - 14), behavior: "smooth" });
      else if (r.top < ceiling) window.scrollBy({ top: r.top - ceiling, behavior: "smooth" });
    }));
  };

  const seniorBands = data.bands.filter((b) => b.course);
  const inSenior = seniorBands.some((b) => b.key === activeBand);
  const activeYears = bandByKey.get(activeBand)?.years ?? [];

  return (
    <div ref={pvRoot} className={`pv${skill ? (ui.path && !peeking ? " pv--docked pv--docked-tall" : " pv--docked") : ""}`}>
      {(copy.brand || switcher) && (
        <header className="pv-top">
          <span className="pv-brand">{copy.brand}</span>
          {switcher}
        </header>
      )}

      <section className="pv-hero">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </section>

      <div className="pv-toolbar" ref={toolbar}>
        <div className="pv-strip" role="group" aria-label="Jump to a school year" ref={strip}>
          {YEARS.map((y) => (
            <button key={y} type="button" className="pv-year" data-year={y} aria-current={activeYears.includes(y)} onClick={() => chooseYear(y)}>
              <span className="pv-sr">{y === "K" ? "" : "Year "}</span>{y === "K" ? "Kindy" : y}
            </button>
          ))}
        </div>
        {inSenior && !ui.path && (
          <div className="pv-strip pv-strip--course" role="group" aria-label="Jump to a Year 11 and 12 course">
            {seniorBands.map((b) => <button key={b.key} type="button" className="pv-course" aria-current={activeBand === b.key} onClick={() => jumpToBand(b.key)}>{b.course}</button>)}
          </div>
        )}
      </div>

      <main>
        <div ref={chainTop} />
        <VerticalChain data={data} focus={rootId} peek={peeking ? ui.sel : null} line={line} only={only} onSelect={select} onLayout={onLayout} />
        <div ref={tail} aria-hidden="true" />

      </main>

      {/* The dock, in thumb reach, with the chain still visible above it. Three states:
          a tapped skill (its sentence, and the one button); that skill's path (how many earlier skills
          it depends on, and the way back); and a card tapped inside a path (just what it means). */}
      {skill && ui.path && !peeking && (
        <aside className="pv-dock pv-dock--path" aria-label="This skill's path" aria-live="polite">
          <h2 className="pv-dock-title">This depends on {plural(count, "earlier skill")}.</h2>
          <p className="pv-dock-note">{copy.pathNote}</p>
          <div className="pv-dock-actions">
            <button type="button" className="pv-ghost" onClick={leavePath}>Back to the full chain</button>
          </div>
        </aside>
      )}
      {skill && (!ui.path || peeking) && (
        <aside className="pv-dock" aria-label="Selected skill" aria-live="polite">
          <p className="pv-dock-line">{skill.line}</p>
          <button type="button" className="pv-dock-close" onClick={() => select(null)} aria-label="Close">×</button>
          {!ui.path && (
            <div className="pv-dock-actions">
              {count > 0
                ? <button type="button" className="pv-solid" onClick={() => { emit("chain_path", { topic: skill.topic, earlierSkills: count }); holdCard(skill.id); go({ path: true }); }}>See the {plural(count, "skill")} it depends on</button>
                : <p className="pv-dock-note">This is where the chain begins.</p>}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
