import moment from "moment";
import React from "react";
import { FiBell, FiClock, FiMapPin } from "react-icons/fi";
import { Reminder } from "../events";
import config from "../config.json";
import "./Agenda.css";
import { View } from "./Calendar";

/**
 * Checks if selectedDate is in this week but after today
 * @param selectedDate Date Object
 */
const isThisWeek = (selectedDate: Date) => {
  moment.updateLocale(config.locale.value, config.locale.options);
  const res =
    moment(selectedDate).isSame(new Date(), "week") &&
    moment(selectedDate).isSameOrAfter(new Date(), "day");
  moment.updateLocale(config.locale.value, null);
  return res;
};

/**
 * Check if selectedDate falls in the next week of today
 * @param selectedDate Date Object
 */
const isNextWeek = (selectedDate: Date) => {
  moment.updateLocale(config.locale.value, config.locale.options);
  const res = moment(selectedDate).isBetween(
    moment(),
    moment().add(8, "days"),
    "day",
    "[]"
  );
  moment.updateLocale(config.locale.value, null);
  return res;
};

/**
 * Returns appropriate context-aware string for selected date
 * @param selectedDate Date Object
 * @returns
 * Prepends "This" before every day in this week
 * Prepends "Next" before every day in the next week
 * Returns just the full day name otherwise
 *
 * @requires isThisWeek()
 * @requires isNextWeek()
 */
const getDayString = (selectedDate: Date) => {
  const isToday = moment(selectedDate).isSame(moment(), "day");
  const day = moment(selectedDate).format("dddd");

  if (isToday) return "Today";
  if (isThisWeek(selectedDate)) return `This ${day}`;
  if (isNextWeek(selectedDate)) return `Next ${day}`;
  return day;
};

interface AgendaProps {
  date: Date;
  events: Array<Reminder>;
  view: View;
  handleView: () => void;
  handleExpand?: () => void;
}

const Agenda: React.FC<AgendaProps> = ({
  date,
  events,
  handleView,
  view,
  handleExpand
}) => {
  const eventsForDate = events.filter((event) =>
    moment(event.date).isSame(date, "date")
  );

  const sortedEvents = eventsForDate.sort((a, b) => {
    if (a.startTime === null) {
      return 1;
    } else if (b.startTime === null) {
      return -1;
    } else {
      return moment(a.startTime).diff(moment(b.startTime));
    }
  });

  return (
    <div
      onClick={handleExpand}
      className="agenda"
      aria-expanded={view === "agenda"}
      data-weekend={moment(date).day() === 0 || moment(date).day() === 6}
    >
      <div className="agenda-header">
        <div>
          <div className="agenda-day">{getDayString(date)}</div>
          <div className="agenda-date">{moment(date).format("DD/MM/YYYY")}</div>
        </div>
        <button
          id="agenda-new-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
        >
          Add new
        </button>
      </div>
      {sortedEvents.length ? (
        <div className="events-root" aria-expanded={view === "agenda"}>
          <div>
            {sortedEvents.map((item) => (
              <div className="timeline" key={item._id}>
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
            ))}
          </div>
          <div>
            {sortedEvents.map((event) => (
              <div className="event-item" key={event._id}>
                <div className="event-title">{event.title}</div>
                <div className="event-location">
                  <FiMapPin />
                  <div>{event.location || "No Location Specified"}</div>
                </div>
                <div className="event-time">
                  <FiClock />
                  <div>
                    {event.startTime !== null
                      ? moment(event.startTime).format("hh:mm A")
                      : "N/A"}
                    {` - `}
                    {event.endTime !== null
                      ? moment(event.endTime).format("hh:mm A")
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="events-empty">
          <FiBell id="no-event-icon" />
          <div id="no-event-title">No reminders for this date</div>
          <div id="no-event-subtitle">
            Click on 'Add New' button to add a reminder
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
