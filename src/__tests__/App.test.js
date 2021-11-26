import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import config from "../config.json";
import App from "../App";
import { nextMonth, previousMonth } from "../components/MonthSelector";

describe("Calendar App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("should let the user go back and forward in months", () => {
    const buttons = screen.getAllByRole("button");
    const nextBtn = buttons.find((btn) =>
      btn.getAttribute("aria-label").match(/next month/i)
    );
    const prevBtn = buttons.find((btn) =>
      btn.getAttribute("aria-label").match(/previous month/i)
    );
    const thisMonth = moment(new Date()).format("MMMM");
    const thisMonthRegEx = new RegExp(thisMonth, "i");
    const nextMonthRegEx = new RegExp(
      moment(nextMonth(new Date())).format("MMMM"),
      "i"
    );
    const prevMonthRegEx = new RegExp(
      moment(previousMonth(new Date())).format("MMMM"),
      "i"
    );

    expect(screen.getByText(thisMonthRegEx)).toBeInTheDocument();

    userEvent.click(nextBtn);
    expect(screen.getByText(nextMonthRegEx)).toBeInTheDocument();

    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    expect(screen.getByText(prevMonthRegEx)).toBeInTheDocument();
  });

  it("should open year and month selector on clicking month and allow selecting", () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    const thisMonth = moment(new Date()).format("MMMM");
    const thisMonthRegEx = new RegExp(thisMonth, "i");
    const monthElement = screen.getByText(thisMonthRegEx);

    userEvent.click(monthElement);
    const upperLimitYear = new RegExp(
      new Date().getFullYear() + config.year_range
    );
    const lowerLimitYear = new RegExp(
      new Date().getFullYear() - config.year_range
    );

    expect(screen.getByText(upperLimitYear)).toBeInTheDocument();
    expect(screen.getByText(lowerLimitYear)).toBeInTheDocument();

    const months =
      /january|february|march|april|may|june|july|august|september|october|november|december/i;
    expect(screen.getAllByText(months).length).toEqual(12 + 1);

    const nextMonthRegEx = new RegExp(
      moment(nextMonth(new Date())).format("MMMM"),
      "i"
    );

    expect(screen.getAllByText(nextMonthRegEx).length).toEqual(1);

    const newMonthSelect = screen.getByText(nextMonthRegEx);
    userEvent.click(newMonthSelect);
    expect(screen.getAllByText(nextMonthRegEx).length).toEqual(2);

    const nextYearRegEx = Math.min(
      new Date().getFullYear() + 1,
      new Date().getFullYear() + config.year_range
    );
    const nextYear = new RegExp(nextYearRegEx);
    userEvent.click(screen.getByText(nextYear));
    expect(screen.getAllByText(nextYearRegEx).length).toEqual(2);

    userEvent.click(screen.getByRole("button", { name: /done/i }));
    const monthYearExp = new RegExp(nextMonthRegEx + "|" + nextYearRegEx, "i");

    expect(screen.getByText(monthYearExp)).toBeInTheDocument();
  });

  it("should allow to add new reminder and persist it", () => {
    const addNewBtn = screen.getByRole("button", { name: /add new/i });
    userEvent.click(addNewBtn);

    const titleInput = screen.getByPlaceholderText(/remind me to/i);
    userEvent.type(titleInput, "Buy milk");

    const dateInput = screen.getByLabelText(/when/i);
    userEvent.type(dateInput, "2021-12-21");

    const timeInput = screen.getByLabelText(/from/i);
    userEvent.type(timeInput, "12:00 am");

    const saveBtn = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveBtn);

    const month = screen.getByText(/december/i);
    expect(month).toBeInTheDocument();

    expect(localStorage.setItem).toBeCalledTimes(1);
    expect(JSON.parse(localStorage.getItem("events")).length).toEqual(1);

    userEvent.click(screen.getByText("21"));
    const reminder = screen.getByText(/buy milk/i);
    expect(reminder).toBeInTheDocument();

    window.location.reload();
    expect(reminder).toBeInTheDocument();
  })

  it("should open agenda on full screen on tap/click", () => {
    const agenda = screen.getByText(/today/i);
    userEvent.click(agenda);

    const month = screen.queryByText(/december/i);
    expect(month).not.toBeInTheDocument();
  })
});
