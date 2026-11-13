import type { SVGProps } from "react";

type Point = readonly [number, number];

interface LegSpec {
  id: "inner" | "middle" | "outer";
  tripod: "a" | "b";
  points: readonly [shoulder: Point, knee: Point, tip: Point];
}

const CENTER_X = 18;
const LEG_WIDTH = 3.2;
const TIP_Y = 15;

// Right-side legs; the left side mirrors these. Every tip lands on TIP_Y.
const RIGHT_LEGS: LegSpec[] = [
  { id: "inner", tripod: "a", points: [[20.2, 6.6], [21.9, 1.6], [23.6, TIP_Y]] },
  { id: "middle", tripod: "b", points: [[21.8, 8.6], [24.6, 4.0], [28.4, TIP_Y]] },
  { id: "outer", tripod: "a", points: [[22.8, 9.8], [26.8, 1.8], [33.0, TIP_Y]] },
];

// Crop the artboard to the legs so the tips sit exactly on the bottom edge.
const HALF_WIDTH = Math.max(...RIGHT_LEGS.map((leg) => leg.points[2][0])) - CENTER_X + LEG_WIDTH / 2;
const VIEW_BOX = `${CENTER_X - HALF_WIDTH} 0 ${HALF_WIDTH * 2} ${TIP_Y + LEG_WIDTH / 2}`;

const mirror = ([x, y]: Point): Point => [CENTER_X * 2 - x, y];
const toPoints = (points: readonly Point[]) => points.map((p) => p.join(",")).join(" ");

const LEGS = RIGHT_LEGS.flatMap(({ id, tripod, points }) => [
  { key: `right-${id}`, side: "right", tripod, points },
  {
    key: `left-${id}`,
    side: "left",
    tripod: tripod === "a" ? "b" : "a",
    points: points.map(mirror) as unknown as LegSpec["points"],
  },
]);

interface SpiderRigProps extends SVGProps<SVGSVGElement> {
  color?: string;
  eyeColor?: string;
}

export default function SpiderRig({
  color = "currentColor",
  eyeColor = "white",
  ...props
}: SpiderRigProps) {
  return (
    <svg viewBox={VIEW_BOX} fill="none" overflow="visible" aria-hidden="true" {...props}>
      {LEGS.map(({ key, side, tripod, points }) => (
        <g key={key} data-leg={side} data-tripod={tripod} data-origin={points[0].join(" ")}>
          <polyline
            points={toPoints(points)}
            stroke={color}
            strokeWidth={LEG_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      <ellipse data-part="body" cx={CENTER_X} cy="10.4" rx="5.8" ry="5.9" fill={color} />
      <g data-part="eyes" fill={eyeColor}>
        <ellipse data-part="eye" cx="16.4" cy="9.8" rx="1.3" ry="1.7" />
        <ellipse data-part="eye" cx="19.6" cy="9.8" rx="1.3" ry="1.7" />
      </g>
    </svg>
  );
}
