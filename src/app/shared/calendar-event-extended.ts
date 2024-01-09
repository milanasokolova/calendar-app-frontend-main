import { CalendarEvent } from "angular-calendar";

export interface CalendarEventExtended extends CalendarEvent {
  description?: string;
  reminder?: string;
  location?: string;
}
