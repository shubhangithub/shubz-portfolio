import React from "react";
import type { ProjectStudyKind } from "../../data/projectStudies";

/** Illustrative objects, not measured charts or an asserted implementation diagram. */
export function ProjectStudy({
  kind,
  compact = false,
}: {
  kind: ProjectStudyKind;
  compact?: boolean;
}) {
  const paper = "var(--nb-paper2)",
    rule = "var(--nb-rule)";
  const text = (x: number, y: number, s: string, size = 10) => (
    <text
      x={x}
      y={y}
      fill="currentColor"
      stroke="none"
      fontFamily="var(--f-mono)"
      fontSize={size}
      letterSpacing=".5"
    >
      {s}
    </text>
  );
  const hex = (x: number, y: number) =>
    `M${x} ${y - 16}l14 8v16l-14 8-14-8v-16z`;
  const lines = (x: number, y: number, w: number, n: number) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={i}
        d={`M${x} ${y + i * 11}h${w - (i % 3) * 12}`}
        stroke={rule}
      />
    ));
  let drawing: React.ReactNode;
  switch (kind) {
    case "engineering":
      drawing = <>
        <path d="M54 38h224v166H54z" fill={paper} />
        <path d="M42 50h224v166H42z" fill={paper} />
        <path d="M30 62h224v166H30z" fill={paper} />
        <path d="M44 190h196M183 190v24M44 214h196" stroke={rule} />
        {text(44, 82, "ENGINEERING / TORUS", 9)}
        <path d="M49 128h37m30 0h38m35 0h37M101 102v-10h72v18M101 154v17h72v-25" />
        <circle cx="101" cy="128" r="25" fill={paper} />
        <path d="m91 115 23 13-23 13z" />
        <path d="M158 110h30v36h-30z" fill={paper} />
        <path d="m158 110 30 36m0-36-30 36" />
        <circle cx="226" cy="128" r="7" fill={paper} />
        {text(47, 205, "DRAWINGS + CALCULATIONS", 7)}
        {text(191, 205, "REV 01", 7)}
      </>;
      break;
    case "map":
      drawing = (
        <>
          <path
            d="m36 64 83-31 83 29 82-29-5 159-83 29-81-30-83 26z"
            fill={paper}
          />
          <path d="m119 33-4 158m87-129-6 159" stroke={rule} />
          {[
            [85, 98],
            [113, 98],
            [141, 98],
            [99, 122],
            [127, 122],
            [155, 122],
            [113, 146],
            [141, 146],
          ].map(([x, y]) => (
            <path key={x + "," + y} d={hex(x, y)} opacity=".6" />
          ))}
          <path d="m65 176 45-50 33 22 44-51 51 26" strokeDasharray="4 5" />
          <circle cx="187" cy="97" r="10" fill={paper} />
          <circle cx="187" cy="97" r="3" fill="currentColor" />
          {text(212, 179, "H3", 21)}
          <path d="m259 48 16-15c18-16 30-3 18 14l-14 145" />
        </>
      );
      break;
    case "fashion":
      drawing = (
        <>
          <path d="M139 56c0-27 38-25 38-2 0 14-18 14-18 29l-78 54c-11 7-6 15 4 15h159c13 0 16-9 5-16l-90-53" />
          <path
            d="m117 95 23 18 37-2 21-20 32 27-24 31-11 59H122l-9-58-25-26z"
            fill={paper}
          />
          <path d="m140 113 7 91m30-93-6 93M119 172h79" stroke={rule} />
          <path d="m224 127 49-4 20 27-44 45-37-41z" fill={paper} />
          <circle cx="229" cy="146" r="4" />
          {text(233, 166, "LMSR", 10)}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${52 + i * 14} 57v12`} opacity=".5" />
          ))}
          {text(43, 43, "FIVE SOURCES", 9)}
        </>
      );
      break;
    case "course":
      drawing = (
        <>
          <path d="M40 55h70l17 18v95H40z" fill={paper} />
          <path d="M110 55v18h17" />
          {text(54, 91, "PDF", 14)}
          {lines(53, 108, 52, 4)}
          <path d="m74 146 64-10 10 64-64 10z" fill={paper} />
          <path d="m101 158 22 12-18 16z" />
          <path d="M149 101h36m-7-7 8 7-8 7" />
          <path d="M203 46h75v161h-75z" fill={paper} />
          <path d="M214 46v161" />
          <path d="M222 77h43m-43 12h30" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="223" y={108 + i * 25} width="10" height="10" />
              <path d={`M240 ${113 + i * 25}h25`} />
            </g>
          ))}
          {text(222, 67, "COURSE", 9)}
        </>
      );
      break;
    case "mixer":
      drawing = (
        <>
          <path d="m43 60 239-8 9 153-240 10z" fill={paper} />
          <path d="m49 82 233-8M55 189l228-8" />
          {["SBERT", "VAE", "n2v", "NCF", "SSL", "Σ"].map((s, i) => (
            <g key={s}>
              {text(61 + i * 35, 72, s, 7)}
              <path d={`M${74 + i * 35} 99v65`} />
              <rect
                x={66 + i * 35}
                y="127"
                width="16"
                height="10"
                rx="2"
                fill={paper}
              />
              <circle cx={74 + i * 35} cy="181" r="4" />
            </g>
          ))}
          <path d="M65 52V34h50m118 19V34h45M89 222h167" stroke={rule} />
          {text(113, 239, "SIX ENGINES", 10)}
        </>
      );
      break;
    case "slide":
      drawing = (
        <>
          <path d="m51 96 218-35 16 99-218 35z" fill={paper} />
          <path d="m71 112 141-23 10 61-141 23z" />
          {[
            [102, 126, 10],
            [128, 121, 7],
            [160, 120, 12],
            [186, 110, 8],
            [119, 146, 9],
            [154, 146, 7],
            [190, 139, 11],
          ].map(([x, y, r]) => (
            <g key={x + "," + y}>
              <circle cx={x} cy={y} r={r} />
              <circle cx={x + 2} cy={y} r="2" fill="currentColor" />
            </g>
          ))}
          <path d="m227 88 30-5 9 57-29 5z" fill={paper} />
          {text(242, 115, "IF", 9)}
          <path d="M67 204h95m-95 7h63" stroke={rule} />
          <path d="M177 42v24m-9-12h18" />
          {text(207, 212, "MFoCS / 2024", 9)}
        </>
      );
      break;
    case "press":
      drawing = (
        <>
          <path d="m52 52 203-16 15 170-204 15z" fill={paper} />
          <path d="m68 64 183-14m-182 22 183-14" />
          {text(81, 96, "FLIPKART", 16)}
          {text(84, 118, "WALMART", 16)}
          <path d="m82 130 163-12" />
          {lines(84, 145, 68, 5)}
          {lines(170, 140, 66, 5)}
          <path
            d="m91 159 50-4m35 7 38-3m-121 21 35-2"
            strokeWidth="5"
            opacity=".2"
          />
          <circle cx="244" cy="184" r="27" fill={paper} />
          {text(228, 181, "BEST", 10)}
          {text(225, 195, "PAPER", 10)}
          <path d="m229 207-6 27 18-9 13 10 3-27" />
        </>
      );
      break;
    case "features":
      drawing = (
        <>
          <path
            d="M44 63c31-48 52 44 82 0s51 43 83 0 47 40 68 0M44 140c31 48 52-44 82 0s51-43 83 0 47-40 68 0"
            stroke={rule}
          />
          {[65, 93, 122, 151, 180, 209, 238, 266].map((x, i) => (
            <path
              key={x}
              d={`M${x} ${80 + (i % 2) * 8}v${40 - (i % 2) * 16}`}
              stroke={i % 3 ? "currentColor" : rule}
            />
          ))}
          <path d="m70 174 179-9 3 47-180 9z" fill={paper} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={85 + i * 21}
              y={185 - Math.floor(i / 3)}
              width="11"
              height="13"
              fill={i % 3 === 0 ? "currentColor" : "none"}
            />
          ))}
          {text(92, 41, "JAYA", 15)}
          <path d="M161 144v21m-6-6 6 6 6-6" />
        </>
      );
      break;
    case "satellite":
      drawing = (
        <>
          <path d="m132 46 37 22-25 41-38-23z" fill={paper} />
          <path d="m105 46 22 13-27 44-22-13zm69 30 22 13-27 44-22-13z" />
          <path
            d="m112 52-27 44m20-21-20-12m96 21-27 44m20-21-20-12"
            stroke={rule}
          />
          <path
            d="m151 92 51 66m-57-62 30 64m-24-68 72 59"
            strokeDasharray="4 5"
          />
          <path
            d="M49 194c73-42 150-38 229-2M64 213c74-35 141-31 199-1"
            stroke={rule}
          />
          <path d="M183 184h52m-26-1v-30m-14 0c0-20 28-20 28 0z" fill={paper} />
          {text(52, 237, "GNSS / WATER VAPOUR", 10)}
        </>
      );
      break;
    case "computer":
      drawing = (
        <>
          <path d="M76 37h171v116H76z" fill={paper} />
          <path d="M85 47h153v92H85z" />
          <path d="m131 153-9 24h77l-9-24M55 185h211l15 31H41z" fill={paper} />
          <path d="M66 198h187m-135 9h86" stroke={rule} />
          {text(106, 81, "NAND → OS", 13)}
          <path d="M107 103h24m10 0h12m11 0h25m11 0h13M107 118h71" />
          <path d="m249 68 31 12v86l-31-13z" fill={paper} />
          <path d="m256 89 17 6m-17 11 17 6m-17 11 17 6" stroke={rule} />
        </>
      );
      break;
    case "site":
      drawing = (
        <>
          <path d="m59 45 209 19-13 161-210-18z" fill={paper} />
          <path d="m58 72 209 19" />
          <path d="m74 58 28 3m137 12 12 1" />
          <path d="m74 95 63 5-8 99-63-5z" fill={paper} />
          <path d="m91 98-8 99m14-77 27 3m-28 8 18 2" />
          {text(151, 119, "~/notebook", 10)}
          {lines(150, 139, 82, 4)}
          <path d="m163 188 17-9 18 13 24-21" />
          <path d="M33 228h180" stroke={rule} />
        </>
      );
      break;
    case "record":
      drawing = (
        <>
          <path d="m70 42 180 15-14 169-181-15z" fill={paper} />
          <circle cx="155" cy="132" r="65" />
          <circle cx="155" cy="132" r="53" />
          <circle cx="155" cy="132" r="42" />
          <circle cx="155" cy="132" r="23" fill={paper} />
          <circle cx="155" cy="132" r="4" />
          {text(139, 128, "R /", 11)}
          {text(138, 144, "Shiny", 9)}
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${86 + i * 14} 207v6`} />
          ))}
          {text(93, 52, "2022", 10)}
          <path d="m209 76 18 1-8 82-17 14" />
        </>
      );
      break;
    case "weather":
      drawing = (
        <>
          <path d="M51 119h121v96H51z" fill={paper} />
          <path d="M61 129h43v50H61z" />
          <path d="M72 141h22m-22 10h16" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={125 + i * 15} cy="188" r="4" />
          ))}
          <path d="M154 111c0-24 35-24 35 0m-28 0c0-14 21-14 21 0" />
          <path d="M171 151h29m-98-32V76h28" />
          <circle cx="235" cy="160" r="37" fill={paper} />
          <circle cx="235" cy="160" r="7" />
          <path d="M232 151c-30-35 23-41 12-4m-1 20c45-10 20 35-6 5m-12-12c-18 40-43-5-9-10" />
          <path d="M235 198v17m-21 5h43" />
          <path d="M80 50c-18-23 11-42 24-26 24-22 47 7 27 24z" />
          {text(58, 236, "TEMPERATURE / HUMIDITY", 9)}
        </>
      );
      break;
    case "cipher":
      drawing = (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 14} ${i * 12})`}>
              <path d="M70 40h141v135H70z" fill={paper} />
              <path d="M83 57h113v101H83z" stroke={rule} />
              {text(90, 77, String(i + 1).padStart(2, "0"), 11)}
            </g>
          ))}
          <path d="M148 105v60m-30-40h60m-60 20h60" />
          <path d="m262 105 17 10-17 10m-3 63-17 10 17 10" />
          {text(71, 237, "SCATTER / SPIN / TRANSFORM", 8)}
        </>
      );
      break;
  }
  return (
    <svg
      className={`project-study ${compact ? "project-study-compact" : ""}`}
      viewBox="0 0 320 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawing}
    </svg>
  );
}
