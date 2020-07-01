import React from "react";
import styled from "styled-components";

import { LEADERBOARD } from "data/leaderboard";
const COLOURS = ["hsl(50, 100%, 50%)", "hsl(0, 7%, 72%)", "hsl(36, 81%, 34%)"];
const DEFAULT_COLOUR = "#ffffffa6";

type Props = {
  height: number;
  width: number;
  ref: any
};

const Canvas = styled.svg<Props>`
  position: absolute;
  top: 50px;
  left: 0;
  width: ${(p) => p.width};
  height: ${(p) => p.height};

  z-index: 0;
  visibility: hidden;
`;

const ROUNDS = ["R1", "R2", "R3", "R4", "R5", "R6"];

const DRIVERS = LEADERBOARD.slice(1, 4);

// [1, ...,  50] -> [height - 100, ..., 25]
// -1 and 0 -> height - 50
const yMap = (value: number) => {
  if (value <= 0) return 400 - 50;

  const reversed = 50 - value;
  // [49, 0] -> [300, 25]

  const ratio = 275 / 49;
  const mapped = reversed * ratio + 25;

  return mapped;
};

export const PreviousResults = (({width, height, ref}: Props) => {
  const xPadding = width / 7;
  const range = width - 2 * xPadding;
  const xMap = (width: number) => (value: number) => {
    // [0, 5] -> [width / 6, width - padding]
    const ratio = range / 5;
    return value * ratio + xPadding;
  };
  const xMapPartial = xMap(width);

  return (
    <Canvas
      // @ts-ignore
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {ROUNDS.map((round, i) => {
        const y = height - 20;
        const x = xMapPartial(i);

        return (
          <g id="text">
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={height}
              stroke="#FFFFFF"
              opacity="0.3"
            />
            <text x={x} y={y} fill="white" textAnchor="middle">
              {round}
            </text>
          </g>
        );
      })}
      {DRIVERS.map((driver, i) => {
        const scores = driver.previousResults;
        return (
          <g id="chartLines">
            <g id="paths">
              <path
                stroke={COLOURS[i] || DEFAULT_COLOUR}
                strokeWidth={3}
                fill="none"
                d={`
                M ${xMapPartial(0)} ${yMap(scores[0])},
                C ${xMapPartial(0) + (xMapPartial(1) - xMapPartial(0)) / 2} ${yMap(scores[0])}, ${xMapPartial(1) - (xMapPartial(1) - xMapPartial(0)) / 2} ${yMap(scores[1])} , ${xMapPartial(1)} ${yMap(scores[1])}
                S ${xMapPartial(1) + (xMapPartial(2) - xMapPartial(1)) / 2} ${yMap(scores[2])}, ${xMapPartial(2)} ${yMap(scores[2])},
                S ${xMapPartial(2) + (xMapPartial(3) - xMapPartial(2)) / 2} ${yMap(scores[3])}, ${xMapPartial(3)} ${yMap(scores[3])},
                S ${xMapPartial(3) + (xMapPartial(4) - xMapPartial(3)) / 2} ${yMap(scores[4])}, ${xMapPartial(4)} ${yMap(scores[4])},
                S ${xMapPartial(4) + (xMapPartial(5) - xMapPartial(4)) / 2} ${yMap(scores[5])}, ${xMapPartial(5)} ${yMap(scores[5])},
                `}
              />
            </g>
            <g id="points">
              {scores.map((score, j) => 
                <circle r={7} cx={xMapPartial(j)} cy={yMap(score)} fill={COLOURS[i] || DEFAULT_COLOUR} />
              )}
            </g>
          </g>
        );
      })}
    </Canvas>
  );
});
