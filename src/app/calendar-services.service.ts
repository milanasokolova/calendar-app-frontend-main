import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarEventDto } from './shared/calendar-event-dto';

@Injectable()
export class CalendarEventsService {
  private _baseUrl = 'http://localhost:8080';
  constructor(private _http: HttpClient) {}

  getCalendarEvents(): Observable<CalendarEventDto[]> {
    const calendarEvents: Observable<CalendarEventDto[]> = this._http.get<
      CalendarEventDto[]
    >(`${this._baseUrl}/event`);
    console.log('calendar events vo service', calendarEvents);
    return calendarEvents;
  }

  insertCalendarEvent(
    calendarEventDto: CalendarEventDto
  ): Observable<CalendarEventDto> {
    return this._http.post<CalendarEventDto>(
      `${this._baseUrl}/event`,
      calendarEventDto
    );
  }

  updateCalendarEvent(
    calendarEventDto: CalendarEventDto
  ): Observable<CalendarEventDto> {
    return this._http.put<CalendarEventDto>(
      `${this._baseUrl}/event/${calendarEventDto.id}`,
      calendarEventDto
    );
  }

  deleteCalendarEvent(calendarEventId: number): Observable<number> {
    return this._http.delete<number>(
      `${this._baseUrl}/event/${calendarEventId}`
    );
  }
}
