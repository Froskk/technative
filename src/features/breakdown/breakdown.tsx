import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import useWindowSize from "@rehooks/window-size";

import { Container, Table, Row, Position, Driver, Score, Canvas } from "./breakdown.s";
import { LEADERBOARD } from "data/leaderboard";
import { Controls } from "features/controls/controls";

// gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(TextPlugin);

const COLOURS = ["hsl(50, 100%, 50%)", "hsl(0, 7%, 72%)", "hsl(36, 81%, 34%)"];
const DEFAULT_COLOUR = "#ffffffa6";

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

export const Breakdown = () => {
  const windowSize = useWindowSize();

  const timeline = useMemo(() => gsap.timeline({ paused: false }), []);
  const tableRef = useRef<HTMLUListElement>(null);
  const chartRef = useRef<SVGElement>(null);

  const slideUpStaggered = useCallback(() => {
    const rows = tableRef.current!.childNodes;

    timeline.from(rows, {
      y: 300,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.05,
    });

    return timeline;
  }, [timeline]);

  const hideHeader = useCallback(() => {
    const header = tableRef.current!.firstChild;

    timeline.to(header, {
      y: "100%",
      duration: 0.5,
      delay: 2,
      autoAlpha: 0,
      ease: "power3.in",
    });

    return timeline;
  }, [timeline]);

  const highlightGroup = useCallback(() => {
    const rows = [...tableRef.current!.childNodes];

    // take top 3 drivers
    const active = rows.filter((_, index) => index > 0 && index < 4);
    const inactive = rows.filter((_, index) => index >= 4);

    timeline.to(
      inactive,
      {
        y: 20,
        duration: 0.1,
        stagger: -0.1,
      },
      "+=2"
    );

    timeline
      .to(active, {
        boxShadow: "0px 0px 3px 2px goldenrod",
        duration: 0.3,
      })
      .to(active, {
        boxShadow: "0px 0px 0px 0px goldenrod",
        duration: 0.3,
      })
      .to(inactive, {
        y: "250%",
        opacity: 0,
        duration: 0.8,
        stagger: -0.2,
      });

    return timeline;
  }, [timeline]);

  const slideTextRight = useCallback(() => {
    const rows = [...tableRef.current!.childNodes];

    // take top 3 drivers... again
    const active = rows.filter((_, index) => index > 0 && index < 4);
    const children = active.map((child) => child.childNodes);

    // remove 'driver' node from array of nodeLists
    const positionsAndScores = children.map((nodeList) =>
      [...nodeList].filter((_, i) => i !== 1)
    );

    // select driver node from same array
    const drivers = children.map((nodeList) =>
      [...nodeList].filter((_, i) => i === 1)
    );

    timeline.to(positionsAndScores, { opacity: 0, duration: 1 }, "<");

    timeline.to(
      active,
      { x: windowSize.innerWidth * 0.8 - 80, duration: 0.8 },
      "<"
    );

    drivers.forEach((driver, i) => {
      const fullname = LEADERBOARD[i + 1].name;
      const initials = fullname.split(" ").map((name) => name.slice(0, 1));

      timeline.to(
        driver,
        { text: initials.join(""), x: -65, duration: 0.8 },
        "<"
      );
    });

    return timeline;
  }, [timeline, windowSize.innerWidth]);

  const svgAnim = useCallback(() => {
    timeline.from(chartRef.current, { autoAlpha: 0, duration: 2 });
  }, [timeline]);

  useEffect(() => {
    timeline
      .add(slideUpStaggered, 2)
      .add(hideHeader)
      .add(highlightGroup, "+=0.5")
      .add(slideTextRight, "+=1")
      .add(svgAnim);
  }, [
    timeline,
    slideUpStaggered,
    hideHeader,
    highlightGroup,
    slideTextRight,
    svgAnim,
  ]);

  const width = windowSize.innerWidth * 0.8 - 140;
  const height = 400

  const xPadding = width / 7;
  const range = width - 2 * xPadding;
  const xMap = (width: number) => (value: number) => {
    // [0, 5] -> [width / 6, width - padding]
    const ratio = range / 5;
    return value * ratio + xPadding;
  };
  const xMapPartial = xMap(width);

  return (
    <Container>
      <Table ref={tableRef}>
        {LEADERBOARD.map((driver, i) => (
          <Row key={i}>
            <Position>{i === 0 ? "P" : i}</Position>
            <Driver>{driver.name}</Driver>
            <Score>{driver.points}</Score>
          </Row>
        ))}
      </Table>
      <Canvas
      ref={chartRef}
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
      <Controls timeline={timeline} />
    </Container>
  );
};
