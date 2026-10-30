import React from "react";
import type { FieldObjectKind } from "../../data/fieldKit";

/** Small original pen studies. Their captions, never the drawing, carry factual claims. */
export function FieldObject({
  kind,
  className = "",
}: {
  kind: FieldObjectKind;
  className?: string;
}) {
  const coordinate = (n: number) => Math.round(n * 1000) / 1000;
  const paper = "var(--nb-paper2)",
    ink = "currentColor",
    muted = "var(--nb-rule)";
  const text = (x: number, y: number, value: string, size = 11) => (
    <text
      x={coordinate(x)}
      y={coordinate(y)}
      fill={ink}
      stroke="none"
      fontFamily="var(--f-ui)"
      fontSize={size}
      letterSpacing="1"
    >
      {value}
    </text>
  );
  const lines = (x: number, y: number, w: number, n = 4) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={i}
        d={`M${x} ${y + i * 12}h${w - (i % 3) * 13}`}
        stroke={muted}
      />
    ));
  let art: React.ReactNode;
  switch (kind) {
    case "terminal":
      art = (
        <>
          <path d="M59 39h202v125H59z" fill={paper} />
          <path d="M66 47h188v108H66zM141 164l-8 21h54l-8-21M115 193h92M64 170h193" />
          <path d="m83 75 13 10-13 10m27 0h27M83 120h92m-92 9h60" />
          <circle cx="241" cy="143" r="3" fill={ink} />
          {text(170, 68, "TORUS", 14)}
          <path d="M202 93c35-23 62 17 33 31-32 17-51-16-23-23" opacity=".45" />
          <path d="m48 202 13-18h60m92 0h45l14 18H48" fill={paper} />
          <path d="M78 191h13m7 0h13m88 0h13m7 0h13M137 198h40" />
        </>
      );
      break;
    case "notebook":
    case "course":
      art = (
        <>
          <path d="M70 30h182v166H70z" fill={paper} />
          <g className="field-course-leaf">
          <path d="M78 22h167v169H78z" fill={paper} />
          <path d="M96 22v169M110 51h112M110 56h65" />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M69 ${40 + i * 22}c-17-8-17 12 0 7`} />
          ))}
          {text(111, 43, kind === "course" ? "STUDY NOTES" : "RESEARCH", 12)}
          {lines(112, 76, 104, 3)}
          <path className="field-study-chart" pathLength="100" d="m115 158 18-25 18 14 20-32 27 42M115 160h100" />
          <path className="field-study-underline" pathLength="100" d="M110 61h65" opacity=".7" />
          </g>
          <path d="m253 37 12 3-36 143-10 13-2-16z" fill={paper} />
          <path d="m219 181 10 2m30-132-10-3" />
        </>
      );
      break;
    case "envelope":
      art = (
        <>
          <path d="m64 82 179-17 15 126-179 17z" fill={paper} />
          <path d="M81 97 94 30l127 25-13 67" fill={paper} />
          {text(112, 58, "RESEARCH", 11)}
          {lines(107, 73, 85, 3)}
          <path d="m64 82 104 71 75-88m-164 143 66-77m113 60-75-52" />
          <circle cx="172" cy="150" r="17" fill={paper} />
          <path d="m163 150 6 6 12-13" />
          <path d="m238 37 4-9m5 19 11-3m-211 87-9 2" />
        </>
      );
      break;
    case "patch":
      art = (
        <>
          <path d="M84 37 211 30l43 66-24 88-116 17-52-65z" fill={paper} />
          <path
            d="m91 47 114-7 38 59-22 77-103 15-46-57z"
            strokeDasharray="4 4"
          />
          <path
            d="m129 87-27 24 27 24m61-48 27 24-27 24m-20-54-20 60"
            strokeWidth="3"
          />
          {text(110, 168, "OPEN SOURCE", 11)}
          <path
            d="M246 174c38 0 20 37-5 25-28-15-59 17-93 9"
            strokeDasharray="2 3"
          />
        </>
      );
      break;
    case "pins":
      art = (
        <>
          <circle cx="124" cy="104" r="63" fill={paper} />
          <circle cx="124" cy="104" r="55" />
          <path
            d="M94 128c13-46 43-49 57-5M90 87c31 38 63 40 67-1M123 61c-11 38-7 76 14 82"
            opacity=".65"
          />
          <circle cx="124" cy="104" r="5" fill={ink} />
          {text(106, 181, "IOP", 14)}
          <path d="m200 91 52 30-7 59-54 23-44-37 13-53z" fill={paper} />
          <path d="m202 102 39 24-6 46-42 18-34-28 10-40z" />
          {text(178, 151, "IMA", 16)}
          <path d="m67 49-6-9m4 37-12-3m207 111 9 7" />
        </>
      );
      break;
    case "badge":
      art = (
        <>
          <path d="m100 17 46 74h35l42-74M117 17l42 67m46-67-35 67" />
          <rect x="89" y="83" width="140" height="119" rx="9" fill={paper} />
          <rect x="141" y="91" width="36" height="7" rx="3" />
          <circle cx="126" cy="130" r="17" />
          <path d="M108 166c0-28 37-28 37 0" />
          {text(154, 128, "STEM", 12)}
          {text(154, 146, "& AI", 12)}
          <path d="M104 180h108" />
          {text(110, 193, "AMBASSADOR", 10)}
        </>
      );
      break;
    case "board":
      art = (
        <>
          <path d="m60 58 183-23 18 149-183 23z" fill={paper} />
          <path d="m86 71 35-5m-33 21 31-4m-29 23 30-4m78-56 5 39 34-4M91 150l49-6 5 35m27-130 5 41m24 40 38-5m-67 19 5 36" />
          <path d="m127 85 61-8 9 62-62 8z" fill={paper} />
          {Array.from({ length: 4 }, (_, i) => (
            <path
              key={i}
              d={`m${136 + i * 14} 83-2-10m${10 + i * 0} 75 1 10`}
            />
          ))}
          {[
            [82, 64],
            [235, 48],
            [87, 190],
            [246, 172],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" />
          ))}
          {text(145, 117, "I/O", 14)}
          <path d="M265 80c38 17-6 61 21 78M55 147c-26 1-22 42 8 43" />
        </>
      );
      break;
    case "books":
      art = (
        <>
          <path d="m61 158 170-19 25 42-174 22z" fill={paper} />
          <path
            d="m75 167 163-17m-158 25 162-17m-159 26 161-17"
            stroke={muted}
          />
          <path d="m76 73 68 19 66-30 22 77-70 31-69-18z" fill={paper} />
          <path
            d="m144 92 18 78m-65-84 38 11m-35 0 38 11m-35 0 38 11m-35 0 38 11m-35 0 38 11m27-51 39-17m-36 27 39-17m-36 27 39-17m-36 27 39-17"
            stroke={muted}
          />
          <g className="field-book-leaf">
            <path className="field-book-curl" d="M144 92Q177 77 210 62Q221 100 232 139Q197 154 162 170Z" fill={paper}/>
            <path className="field-book-print" d="m159 92 39-17m-36 27 39-17m-36 27 39-17m-36 27 39-17" stroke={muted}/>
          </g>
          <path d="m146 92 18-5 14 65-11 14" fill={ink} opacity=".23" />
          <path d="M99 46c17-26 40-19 49 0m3 2c7-31 35-30 47-9M148 46l5 2M99 46l-8 5m107-12 8-4" />
        </>
      );
      break;
    case "card":
      art = (
        <>
          <path d="m57 65 193-19 12 126-193 19z" fill={paper} />
          <path d="m59 86 193-19" />
          {text(74, 79, "UNIVERSITY / NOTES", 10)}
          <path d="m80 110 41-4 5 50-40 4z" />
          <path d="m88 143 8-20 9-1 11 20m-27 4 26-3m-12-34 3 43" />
          {text(137, 113, "OXFORD", 13)}
          {text(140, 133, "FLAME", 12)}
          <path d="m140 145 87-9m-85 17 57-5" stroke={muted} />
          <path d="m84 180 3 12m5-13 3 12m5-13 3 12m5-13 3 12m5-13 3 12m5-13 3 12" />
          <path d="m200 43 28-13 9 21-27 12z" fill={paper} />
        </>
      );
      break;
    case "map":
      art = (
        <>
          <path
            d="m60 71 64-29 68 26 66-27-8 132-63 29-69-30-65 26z"
            fill={paper}
          />
          <path d="m124 42-6 130m74-104-5 134" stroke={muted} />
          <path
            d="m61 109 31-12 21 15 40-16 28 18 27-12 43-8m-195 60 37-19 27 21 33-24 39 24 50-31"
            stroke={muted}
          />
          <path d="m80 147 25-26 46 7 30-31 38 15" strokeDasharray="5 4" />
          <circle cx="181" cy="97" r="10" fill={paper} />
          <circle cx="181" cy="97" r="3" fill={ink} />
          {text(147, 174, "ORION", 12)}
          <path d="m249 41 11-6c19-5 13 18 2 17l-12 122" />
        </>
      );
      break;
    case "folio":
      art = (
        <>
          <path d="m59 65 183-28 23 146-183 28z" fill={paper} />
          <path d="m71 48 172 13-10 137-172-13z" fill={paper} />
          <path d="m87 34 162 20-18 136-163-20z" fill={paper} />
          {text(104, 64, "RESEARCH LOG", 10)}
          <path d="m100 79 122 15" />
          {[
            [120, 112],
            [145, 105],
            [155, 130],
            [187, 119],
            [198, 143],
          ].map(([x, y], i) => (
            <g key={x}>
              <circle cx={x} cy={y} r={8 + (i % 3)} />
              <circle cx={x + 2} cy={y - 1} r="2" fill={ink} />
            </g>
          ))}
          {lines(93, 155, 89, 2)}
          <path d="m212 41 17 2c14 1 10 18-3 16l-27-4c-12-2-7-19 4-16l25 3" />
        </>
      );
      break;
    case "oar":
      art = (
        <>
          <path d="m63 182 145-126 7 8L70 190z" fill={paper} />
          <path d="m207 56 22-29 29 21-34 24z" fill={paper} />
          <path d="m228 31 24 17m-19-21 8 7M66 180l8 9" />
          <path
            d="M67 142c27-6 50-7 67 4m-76 8c24-5 37-5 55 0m64 25c26-9 50-10 70-6m-59 18c18-5 36-7 54-4"
            stroke={muted}
          />
          <path d="m98 82 28-17 18 10-7 20-27 9-26-10z" fill={paper} />
          <path d="m114 68 8-21 15 1 7 27m-47 22-11 20m46-22 11 10" />
          {text(153, 144, "OFFLINE", 11)}
        </>
      );
      break;
    case "committee":
      art = (
        <>
          <path
            className="field-committee-links" pathLength="100"
            d="M84 79 160 49l77 39-15 83-91 22-47-114m0 0 138 92M160 49l-29 144m106-105L84 79m47 114L237 88"
            stroke={muted}
          />
          {[
            [84, 79],
            [160, 49],
            [237, 88],
            [222, 171],
            [131, 193],
          ].map(([x, y], i) => (
            <g key={x} className="field-committee-node">
              <circle cx={x} cy={y} r="19" fill={paper} />
              <path d={`M${x - 7} ${y + 4}h14m-11-8h8`} />
              {text(x - 3, y - 25, String(i + 1), 9)}
            </g>
          ))}
          <circle cx="162" cy="120" r="23" fill={paper} />
          <path className="field-committee-check" pathLength="100" d="m150 120 8 8 16-18" />
        </>
      );
      break;
    case "tablet":
      art = (
        <>
          <rect x="64" y="37" width="180" height="154" rx="13" fill={paper} />
          <rect x="74" y="48" width="160" height="131" rx="4" />
          <path className="field-tablet-stroke" pathLength="100" d="M86 154c26-70 43 32 65-27s42 41 68-43M84 167c24-25 45-39 74-32" />
          <circle cx="153" cy="184" r="2" fill={ink} />
          <g className="field-tablet-pen"><path d="m251 38 9 4-37 144-10 14 1-19z" fill={paper} />
          <path d="m215 179 8 4" /></g>
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx={90 + i * 15}
              cy="62"
              r="4"
              fill={i === 0 ? ink : "none"}
            />
          ))}
        </>
      );
      break;
    case "recommender":
      art = (
        <>
          <circle cx="156" cy="117" r="51" fill={paper} />
          <circle cx="156" cy="117" r="40" />
          <circle cx="156" cy="117" r="28" />
          <circle cx="156" cy="117" r="7" fill={ink} />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 3,
              x = coordinate(156 + Math.cos(a) * 105),
              y = coordinate(117 + Math.sin(a) * 84);
            return (
              <g key={i}>
                <path
                  d={`M${coordinate(156 + Math.cos(a) * 53)} ${coordinate(117 + Math.sin(a) * 53)}L${x} ${y}`}
                  strokeDasharray="3 3"
                />
                <rect
                  x={coordinate(x - 23)}
                  y={coordinate(y - 13)}
                  width="46"
                  height="26"
                  rx="3"
                  fill={paper}
                />
                {text(
                  coordinate(x - 7),
                  coordinate(y + 4),
                  String(i + 1).padStart(2, "0"),
                  11,
                )}
              </g>
            );
          })}
          <path d="m142 101 14-7 10 5v26m-11-22 11-4m-27 30c-12 5-10 13 1 11 11-3 11-13-1-11m21-11c-12 5-10 13 1 11 11-3 11-13-1-11" />
        </>
      );
      break;
    case "san-francisco":
      art = <>
        <path d="M38 172H285M42 179H281" />
        <path d="M92 172V58H107V172M215 172V58H230V172M92 68H107M215 68H230M92 101H107M215 101H230" fill={paper}/>
        <path className="field-city-cable" d="M37 165Q73 137 92 65M107 65Q160 190 215 65M230 65Q250 137 285 165"/>
        <path d="M54 149V172M72 120V172M124 101V172M144 122V172M165 130V172M185 120V172M203 95V172M247 115V172M267 145V172" stroke={muted}/>
        <path className="field-city-water" d="M40 195Q65 185 90 195T140 195T190 195T240 195T290 195" stroke={muted}/>
        <circle cx="264" cy="62" r="17" stroke={muted}/>
        {text(126, 47, "SAN FRANCISCO", 9)}
      </>;
      break;
    case "microphone":
      art = (
        <>
          <rect x="125" y="37" width="61" height="104" rx="30" fill={paper} />
          <path d="M113 89v26c0 57 86 57 86 0V89M155 158v35m-34 8h68M135 55h40m-43 12h46m-45 12h44m-44 12h44m-43 12h42" />
          <path className="field-microphone-wave" d="M93 71c-19 21-19 42 0 61m123-61c19 21 19 42 0 61" stroke={muted}/>
          <path className="field-microphone-wave" d="M79 58c-27 29-27 60 0 87m151-87c27 29 27 60 0 87" stroke={muted}/>
        </>
      );
      break;
  }
  return (
    <svg
      className={`field-object field-object-${kind} ${className}`}
      viewBox="0 0 320 230"
      fill="none"
      stroke={ink}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {art}
    </svg>
  );
}
