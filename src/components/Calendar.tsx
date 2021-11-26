import moment from "moment";
import React, { useMemo, useState } from "react";
import { generateRange } from "../utils";
import AddReminder from "./AddReminder";
import Agenda from "./Agenda";
import "./Calendar.css";
import Dates from "./Dates";
import MonthSelector from "./MonthSelector";
import MonthYearSelector from "./MonthYearSelector";
import WeekDayRow from "./WeekDayRow";

/**
 * Returns the number of the first day on
 * the month of the given date
 * @param date Date Object
 */
const firstDayOfMonth = (date: Date) => {
  return parseInt(moment(date).startOf("month").format("d"), 10);
};

/**
 * Returns an Array[null] with length equal
 * to number of extra days in start of the month
 * @param firstDayOfMonth Number for the day of the month
 */
const getBlanksForMonth = (firstDayOfMonth: number): Array<null> => {
  const length = Math.max(firstDayOfMonth - 1, 0);
  return new Array(length).fill(null);
};

/**
 * Returns an Array containing date: number sequence
 * corresponding to the month of the date given
 * @param date Date Object
 */
const datesOfTheMonth = (date: Date): Array<number> => {
  const daysInMonth = moment(date).daysInMonth();
  const dates = generateRange(1, daysInMonth);
  return dates;
};

export type View = "select" | "agenda" | "reminder" | null;

const Calendar: React.FC = () => {
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  const [view, setView] = useState<View>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthData = useMemo(
    () => [
      ...getBlanksForMonth(firstDayOfMonth(currentDate)),
      ...datesOfTheMonth(currentDate)
    ],
    [currentDate]
  );

  switch (view) {
    case "select":
      return (
        <main>
          <div className="root">
            <MonthYearSelector
              currentDate={currentDate}
              handleCurrentDate={setCurrentDate}
              handleView={() => setView(null)}
            />
          </div>
          <Agenda
            view={view}
            date={selectedDate}
            events={events}
            handleView={() => setView("reminder")}
          />
        </main>
      );
    case "reminder":
      return (
        <AddReminder
          handleView={() => setView(null)}
          selectedDate={selectedDate}
          setCurrentDate={setCurrentDate}
        />
      );
    case "agenda":
      return (
        <main>
          <div className="root" aria-expanded={view !== "agenda"}>
            <MonthSelector
              date={currentDate}
              handleMonth={setCurrentDate}
              handleView={() => setView("select")}
            />
            <WeekDayRow />
            <Dates
              data={monthData}
              events={events}
              currentDate={currentDate}
              selectedDate={selectedDate}
              handleSelectedDate={setSelectedDate}
            />
          </div>
          <Agenda
            view={view}
            date={selectedDate}
            events={events}
            handleView={() => setView("reminder")}
            handleExpand={() => setView(null)}
          />
        </main>
      );
    default:
      return (
        <main>
          <div className="root">
            <MonthSelector
              date={currentDate}
              handleMonth={setCurrentDate}
              handleView={() => setView("select")}
            />
            <WeekDayRow />
            <Dates
              data={monthData}
              events={events}
              currentDate={currentDate}
              selectedDate={selectedDate}
              handleSelectedDate={setSelectedDate}
            />
          </div>
          <Agenda
            view={view}
            date={selectedDate}
            events={events}
            handleView={() => setView("reminder")}
            handleExpand={() => setView("agenda")}
          />
        </main>
      );
  }
};

export default Calendar;
