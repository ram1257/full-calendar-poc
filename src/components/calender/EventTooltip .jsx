import React, { useEffect, useRef } from "react";
import styles from "./calendar.module.css";

const EventTooltip = ({ event, mouseCoords }) => {
  const tooltipRef = useRef(null);

  // Set the hovered event location coords x and y
  useEffect(() => {
    const tooltip = tooltipRef?.current;
    const tooltipRect = tooltip?.getBoundingClientRect();
    const x = mouseCoords?.x - tooltipRect?.width / 2;
    const y = mouseCoords?.y - tooltipRect?.height + 15;
    tooltip.style.top = `${y}px`;
    tooltip.style.left = `${x}px`;
  }, [event, mouseCoords]);

  return (
    <div ref={tooltipRef} className={styles.tooltip}>
      <h4 style={{ borderBottom: "1px solid lightgray" }}>{event.title}</h4>
      <p>{event.start.toLocaleString()}</p>
      <p>{event.location}</p>
      <p>{event.description}</p>
    </div>
  );
};

export default EventTooltip;
