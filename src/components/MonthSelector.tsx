import moment from "moment";
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./MonthSelector.css";

const Month: React.FC<{ date: Date; onClick: () => void }> = ({
  date,
  onClick
}) => {
  const parsedDate = moment(date);
  const [month, year] = [
    moment.months()[parsedDate.month()],
    parsedDate.year()
  ];

  return (
    <div className="month" onClick={onClick}>
      {month} {year}
    </div>
  );
};

/**
 * Takes in a date and returns a new date object with previous month
 * @param date Date Object
 */
export const previousMonth = (date: Date) =>
  moment(date).subtract(1, "M").toDate();

/**
 * Takes in a date and returns a new date with next month
 * @param date Date Object
 */
export const nextMonth = (date: Date) => moment(date).add(1, "M").toDate();

interface MonthSelectorProps {
  date: Date;
  handleMonth: (value: Date) => void;
  handleView: () => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  date,
  handleMonth,
  handleView
}) => {
  return (
    <div className="month-header">
      <div
        role="button"
        className="ghost-icon-btn"
        onClick={() => handleMonth(previousMonth(date))}
        aria-label="Previous Month"
      >
        <FiChevronLeft />
      </div>
      <Month date={date} onClick={handleView} />
      <div
        role="button"
        className="ghost-icon-btn"
        onClick={() => handleMonth(nextMonth(date))}
        aria-label="Next Month"
      >
        <FiChevronRight />
      </div>
    </div>
  );
};

export default MonthSelector;
