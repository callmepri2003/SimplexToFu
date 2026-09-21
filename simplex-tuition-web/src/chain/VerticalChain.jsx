// Draws the vertical chain: real buttons for the skills (so a screen reader and a
// keyboard meet them in chain order), one SVG behind them for the links, and a
// header per stage that pins under the toolbar while that stage is on screen.

import { useEffect, useMemo, useRef, useState } from "react";
import { layoutVertical } from "./verticalLayout";

export default function VerticalChain({ data, focus, peek = null, line, only, onSelect, onLayout }) {
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      setWidth(Math.floor(box.current?.clientWidth ?? 0));
      // Follow the reader's text size: a parent who has enlarged text gets taller cards, not clipped words.
      setScale(Math.min(1.6, Math.max(1, parseFloat(getComputedStyle(document.documentElement).fontSize) / 16)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => (width ? layoutVertical(data, width, { only, scale }) : null), [data, width, only, scale]);
  useEffect(() => { if (layout) onLayout?.(layout); }, [layout, onLayout]);

  const role = (id) => {
    if (!focus || !line) return "";
    if (id === focus) return "focus";
    return line.below.has(id) ? "below" : "dim"; // one colour only: what the chosen skill depends on
  };
  const edgeRole = (e) => {
    if (!focus || !line) return "";
    return (e.to === focus || line.below.has(e.to)) && line.below.has(e.from) ? "below" : "dim";
  };

  const edges = useMemo(() => {
    if (!layout) return [];
    // lit links are drawn last so they sit on top of the grey ones
    return [...layout.edges].sort((a, b) => (edgeRole(a) === "dim" || !edgeRole(a) ? 0 : 1) - (edgeRole(b) === "dim" || !edgeRole(b) ? 0 : 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, focus, line]);

  return (
    <div className="vc" ref={box} style={{ height: layout?.height }} onClick={() => onSelect(null)}>
      {layout && (
        <>
          <svg className="vc-links" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" focusable="false">
            <defs>
              {["plain", "below"].map((k) => (
                <marker key={k} id={`vc-arrow-${k}`} viewBox="0 0 10 10" refX="5" refY="9" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
                  <path d="M1.5,1 L5,9 L8.5,1 Z" className={`vc-arrow vc-arrow--${k}`} />
                </marker>
              ))}
            </defs>
            {edges.map((e) => {
              const r = edgeRole(e);
              return <path key={`${e.from}>${e.to}`} d={e.d} className={`vc-link vc-link--${r}`} markerEnd={`url(#vc-arrow-${r === "below" ? "below" : "plain"})`} />;
            })}
          </svg>

          {layout.bands.map((b, i) => (
            <section key={b.key} className={`vc-band${i % 2 ? " vc-band--alt" : ""}`} style={{ top: b.top, height: b.height }} data-band={b.key} aria-label={b.label}>
              <h3 className="vc-band-head">{b.label}</h3>
            </section>
          ))}

          {layout.nodes.map((n) => {
            const r = role(n.id);
            return (
              <button key={n.id} type="button" data-skill={n.id}
                className={`vc-card${n.skill.spine ? " vc-card--spine" : ""}${r ? ` vc-card--${r}` : ""}${peek === n.id ? " vc-card--peek" : ""}`}
                style={{ transform: `translate(${n.x}px, ${n.y}px)`, width: n.w, height: n.h }}
                aria-pressed={focus === n.id || peek === n.id}
                aria-label={`${n.skill.topic}. ${n.skill.line}`}
                onClick={(ev) => { ev.stopPropagation(); onSelect(focus === n.id || peek === n.id ? null : n.id); }}>
                <span className="vc-topic">{n.skill.label ?? n.skill.topic}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
