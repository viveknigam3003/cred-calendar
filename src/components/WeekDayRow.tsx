import React from "react";
import { uid } from "../utils";
import "./Dates.css";

const WeekDayRow = () => {
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="grid">
      {weekdays.map((day) => (
        <p className="header" key={uid()}>
          {day}
        </p>
      ))}
    </div>
  );
};

export default WeekDayRow;
