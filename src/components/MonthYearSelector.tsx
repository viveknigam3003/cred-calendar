import moment from "moment";
import React, { useEffect, useRef } from "react";
import { generateRange } from "../utils";
import "./MonthYearSelector.css";
import config from "../config.json";

const YEAR_RANGE = config.year_range;

const upperYearLimit = Number(
  moment().clone().add(YEAR_RANGE, "years").format("YYYY")
);
const lowerYearLimit = Number(
  moment().clone().subtract(YEAR_RANGE, "years").format("YYYY")
);

const months = moment.months();
const years = generateRange(lowerYearLimit, upperYearLimit);

interface MonthYearSelectorProps {
  currentDate: Date;
  handleCurrentDate: (value: Date) => void;
  handleView: () => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentDate,
  handleCurrentDate,
  handleView
}) => {
  const yearRef = useRef<null | HTMLDivElement>(null);

  const isSelectedMonth = (currentDate: Date, month: string) =>
    moment(currentDate).format("MMMM") === month;

  const isSelectedYear = (currentDate: Date, year: number) =>
    Number(moment(currentDate).format("YYYY")) === year;

  useEffect(() => {
    if (yearRef && yearRef.current) {
      yearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, []);

  const handleMonthSelect = (month: string) => {
    const y = currentDate.getFullYear();
    const d = currentDate.getDate();
    const m = Number(moment().month(month).format("M")) - 1;
    handleCurrentDate(new Date(y, m, d));
  };

  const handleYearSelect = (year: number) => {
    const y = year;
    const d = currentDate.getDate();
    const m = currentDate.getMonth();
    handleCurrentDate(new Date(y, m, d));
  };

  return (
    <div>
      <div className="month-year-body">
        <div className="list-container">
          <h4 className="month">{moment(currentDate).format("MMMM")}</h4>
          <div className="long-list">
            {months.map((month) => (
              <div
                className="list-item"
                key={month}
                data-selected={isSelectedMonth(currentDate, month)}
                onClick={() => handleMonthSelect(month)}
              >
                {month}
              </div>
            ))}
          </div>
        </div>
        <div className="list-container">
          <h4 className="month">{moment(currentDate).format("YYYY")}</h4>
          <div className="long-list">
            {years.map((year) => (
              <div
                className="list-item"
                key={year}
                data-selected={isSelectedYear(currentDate, year)}
                onClick={() => handleYearSelect(year)}
                ref={isSelectedYear(currentDate, year) ? yearRef : null}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="month-year-footer">
        <button className="ghost-btn" onClick={handleView}>
          Done
        </button>
      </div>
    </div>
  );
};

export default MonthYearSelector;
