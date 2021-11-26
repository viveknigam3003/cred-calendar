import moment from "moment";
import React from "react";
import { Reminder } from "../events";
import { uid } from "../utils";
import config from "../config.json";
import "./Dates.css";

type DateData = Array<number | null>;

/**
 * Generates a valid JS Date object from date: number, and currentDate object
 * @param dateNumber Date in number [1, 31]
 * @param currentDate Current Date Object
 */
const getFullDateObject = (dateNumber: number, currentDate: Date) =>
  new Date(currentDate.getFullYear(), currentDate.getMonth(), dateNumber);

/**
 * Checks if the passed date: number is today or not
 * @param dateNumber Date in number [1, 31]
 * @param currentDate Current Date Object
 */
const isToday = (dateNumber: number, currentDate: Date) =>
  moment(getFullDateObject(dateNumber, currentDate)).isSame(new Date(), "day");

/**
 * Checks if the currentDate is also the selected date
 * @param dateNumber
 * @param currentDate
 * @param selectedDate
 */
const isSelected = (
  dateNumber: number,
  currentDate: Date,
  selectedDate: Date
) =>
  moment(getFullDateObject(dateNumber, currentDate)).isSame(
    selectedDate,
    "date"
  );

interface DatesProps {
  data: DateData;
  events: Array<Reminder>;
  selectedDate: Date;
  currentDate: Date;
  handleSelectedDate: (value: Date) => void;
}

const Dates: React.FC<DatesProps> = ({
  data,
  events,
  selectedDate,
  currentDate,
  handleSelectedDate
}) => {
  const STOP_LIMIT = config.max_reminder_limit;

  const eventDatesForThisMonth = events
    .filter((event) => moment(event.date).isSame(currentDate, "month"))
    .map((event) => new Date(event.date).getDate());

  const totalEventsForDate = (dateNumber: number) =>
    eventDatesForThisMonth.filter((date) => date === dateNumber).length;

  return (
    <div className="grid">
      {data.map((date) => (
        <div
          className="date"
          data-today={isToday(Number(date), currentDate)}
          data-selected={
            date && isSelected(Number(date), currentDate, selectedDate)
          }
          key={uid()}
          onClick={() =>
            handleSelectedDate(getFullDateObject(Number(date), currentDate))
          }
        >
          <div>{date}</div>
          {eventDatesForThisMonth.includes(Number(date)) ? (
            <div className="date-indicator">
              {"•".repeat(
                Math.min(totalEventsForDate(Number(date)), STOP_LIMIT)
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Dates;
