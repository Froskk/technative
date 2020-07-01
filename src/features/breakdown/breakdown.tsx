import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import useWindowSize from "@rehooks/window-size";

import { Container, Table, Row, Position, Driver, Score } from "./breakdown.s";
import { LEADERBOARD } from "data/leaderboard";
import { PreviousResults } from "./previousResults";
import { Controls } from "features/controls/controls";

// gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(TextPlugin);

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
      <PreviousResults
        ref={chartRef}
        width={windowSize.innerWidth * 0.8 - 140}
        height={450 - 50}
      />
      <Controls timeline={timeline} />
    </Container>
  );
};
