import moment from "moment";
import React, { useState } from "react";
import { Reminder } from "../events";
import { uid } from "../utils";
import "./AddReminder.css";

interface AddReminderProps {
  handleView: () => void;
  setCurrentDate: (value: Date) => void;
  selectedDate: Date;
}

const AddReminder: React.FC<AddReminderProps> = ({
  handleView,
  selectedDate,
  setCurrentDate,
}) => {
  const [error, setError] = useState({
    for: "title",
    message: "",
  });
  const [reminder, setReminder] = useState<Reminder>({
    _id: uid(),
    title: "",
    date: selectedDate,
    startTime: null,
    endTime: null,
    location: "",
  });

  const validateInput = (data: Reminder) => {
    if (!data.title) {
      setError({ for: "title", message: "Required" });
      return false;
    }
    if (!data.date) {
      setError({ for: "date", message: "Set a date for the reminder" });
      return false;
    }
    if (data.endTime && !data.startTime) {
      setError({ for: "startTime", message: "Add start time also" });
      return false;
    }
    if (moment(data.startTime).diff(data.endTime) > 0) {
      setError({ for: "endTime", message: "End time should be after start" });
      return false;
    }
    return true;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [key, value] = [e.target.name, e.target.value];
    setReminder({ ...reminder, [key]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    setReminder({
      ...reminder,
      [key]: new Date(e.target.value),
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [key, value] = [e.target.name, e.target.value];
    const [hh, mm] = value.split(":");
    const date =
      moment(reminder.date).format("YYYY-MM-DD") +
      " " +
      moment({ hour: Number(hh), minute: Number(mm) }).format("hh:mm a");
    setReminder({ ...reminder, [key]: new Date(date) });
  };

  const handleAdd = () => {
    if (!validateInput(reminder)) return;

    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.push(reminder);

    localStorage.setItem("events", JSON.stringify(events));

    setCurrentDate(reminder.date);
    setReminder({
      _id: uid(),
      title: "",
      date: selectedDate,
      startTime: null,
      endTime: null,
      location: "",
    });
    handleView();
  };

  return (
    <div className="add-rem-root">
      <h3 id="add-rem-title">Add New Reminder</h3>

      <div className="input-field">
        <input
          id="reminder"
          type="text"
          name="title"
          value={reminder.title}
          onChange={handleInput}
          placeholder="Remind me to..."
        />
        <div data-name="title" className="input-error">
          {error.for === "title" && error.message}
        </div>
      </div>

      <div className="input-field">
        <label>
          When?
          <input
            placeholder={String(reminder.date)}
            value={moment(reminder.date).format("YYYY-MM-DD")}
            name="date"
            onChange={handleDateChange}
            type="date"
            required
          />
        </label>
        <div data-name="date" className="input-error">
          {error.for === "date" && error.message}
        </div>
      </div>

      <div className="time-input">
        <div className="input-field">
          <label>
            From
            <input
              type="time"
              name="startTime"
              value={
                reminder.startTime !== null
                  ? moment(reminder.startTime).format("HH:mm")
                  : ""
              }
              onChange={handleTimeChange}
            />
          </label>
          <div data-name="startTime" className="input-error">
            {error.for === "startTime" && error.message}
          </div>
        </div>

        <div className="input-field">
          <label>
            To
            <input
              type="time"
              name="endTime"
              value={
                reminder.endTime !== null
                  ? moment(reminder.endTime).format("HH:mm")
                  : ""
              }
              onChange={handleTimeChange}
            />
          </label>
          <div data-name="date" className="input-error">
            {error.for === "endTime" && error.message}
          </div>
        </div>
      </div>

      <div className="input-field">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={reminder.location}
          onChange={handleInput}
        />
      </div>

      <div className="action-footer">
        <button className="ghost-btn" onClick={handleAdd}>
          Save Reminder
        </button>
        <button className="ghost-btn" onClick={handleView}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddReminder;
