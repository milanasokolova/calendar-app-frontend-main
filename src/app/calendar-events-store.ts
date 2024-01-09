import { CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';
import { CalendarEventDto } from './shared/calendar-event-dto';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { CalendarEventsService } from './calendar-services.service';
import { ToastrService } from 'ngx-toastr';

export interface CalendarEventState {
  calendarEvents: CalendarEventDto[];
}

const initialState: CalendarEventState = {
  calendarEvents: [],
};

@Injectable()
export class CalendarEventStore extends ComponentStore<CalendarEventState> {
  readonly calendarEvents$ = this.select((state) => state.calendarEvents);

  constructor(
    private _calendarService: CalendarEventsService,
    private _toastrService: ToastrService
  ) {
    super(initialState);
  }

  getCalendarEvents = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this._calendarService.getCalendarEvents().pipe(
          tapResponse(
            (calendarEvents: CalendarEventDto[]) => {
              this.setState({
                calendarEvents,
              });
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  insertCalendarEvents = this.effect(
    (calendarEventDto$: Observable<CalendarEventDto>) =>
      calendarEventDto$.pipe(
        switchMap((calendarEventDto) =>
          this._calendarService.insertCalendarEvent(calendarEventDto).pipe(
            tapResponse(
              (calendarEvent) => {
                this.insertCalendarEvent(calendarEvent);
                this._toastrService.success(
                  'Calendar Event added successfully!'
                );
              },
              (_) => this._toastrService.error('An error has occured')
            )
          )
        )
      )
  );

  updateCalendarEvents = this.effect(
    (calendarEventDto$: Observable<CalendarEventDto>) =>
      calendarEventDto$.pipe(
        switchMap((calendarEventDto) =>
          this._calendarService.updateCalendarEvent(calendarEventDto).pipe(
            tapResponse(
              (calendarEvent) => {
                this.updateCalendarEvent(calendarEvent);
                this._toastrService.success('Update successful!');
              },
              (_) => this._toastrService.error('An error has occured')
            )
          )
        )
      )
  );

  deleteCalendarEvent = this.effect((calendarEventId$: Observable<number>) =>
    calendarEventId$.pipe(
      switchMap((calendarEventId) =>
        this._calendarService.deleteCalendarEvent(calendarEventId).pipe(
          tapResponse(
            (deletedcalendarEventId) => {
              this.removeCalendarEvent(deletedcalendarEventId);
              this._toastrService.success('Event successfully deleted!');
            },
            (_) => this._toastrService.error('An error has occured')
          )
        )
      )
    )
  );

  private readonly insertCalendarEvent = this.updater(
    (state: CalendarEventState, calendarEvent: CalendarEventDto) => ({
      ...state,
      calendarEvents: [...state.calendarEvents, calendarEvent],
    })
  );

  private readonly updateCalendarEvent = this.updater(
    (state: CalendarEventState, calenarEvent: CalendarEventDto) => {
      const newState = {
        ...state,
        calendarEvents: state.calendarEvents.map((ce) =>
          ce.id === calenarEvent.id ? calenarEvent : ce
        ),
      };
      return newState;
    }
  );

  private readonly removeCalendarEvent = this.updater(
    (state: CalendarEventState, calendarEventId: number) => {
      const newState = {
        ...state,
        calendarEvents: state.calendarEvents.filter(
          (ce) => ce.id !== calendarEventId
        ),
      };
      return newState;
    }
  );
}
