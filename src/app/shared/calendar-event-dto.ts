export interface CalendarEventDto {
  id?: number;
  title: string;
  description: string;
  location: string;
  reminder: string;
  startTime: Date;
  endTime: Date;
}
