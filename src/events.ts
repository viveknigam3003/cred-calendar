import { uid } from "./utils";

export interface Reminder {
  _id: string;
  date: Date;
  title: string;
  location?: string;
  startTime?: Date | null;
  endTime?: Date | null;
}

export const eventData: Array<Reminder> = [
  {
    _id: uid(),
    date: new Date("2021-11-25"),
    title: "Complete CRED Assignment",
    startTime: new Date("2021-11-25 02:00 pm"),
    endTime: new Date("2021-11-25 03:00 pm"),
    location: "Codesandbox"
  },
  {
    _id: uid(),
    date: new Date("2021-11-25"),
    title: "Talk to Liana",
    startTime: new Date("2021-11-25 11:00 am"),
    endTime: null,
    location: "Phone"
  },
  {
    _id: uid(),
    date: new Date("2021-11-28"),
    title: "My Event",
    startTime: null,
    endTime: null
  },
  {
    _id: uid(),
    date: new Date("2021-12-01"),
    title: "My Event",
    startTime: null,
    endTime: null
  },
  {
    _id: uid(),
    date: new Date("2021-12-05"),
    title: "My Event",
    startTime: null,
    endTime: null
  }
];
