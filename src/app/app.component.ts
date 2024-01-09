import { Observable } from 'rxjs';
import { CalendarEventStore } from './calendar-events-store';
import { Component, DestroyRef, inject } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

import { Subject } from 'rxjs';
import { CalendarEventDto } from './shared/calendar-event-dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventColor } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventExtended } from './shared/calendar-event-extended';
import { EventInfoModalComponent } from '../event-info-modal/event-info-modal.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  destroyRef = inject(DestroyRef);
  extendedEvents!: CalendarEventExtended[];

  constructor(
    private _componentStore: CalendarEventStore,
    public dialog: MatDialog
  ) {}

  calendarEvents$!: Observable<CalendarEventDto[]>;

  ngOnInit(): void {
    this.calendarEvents$ = this._componentStore.calendarEvents$;
    this._componentStore.getCalendarEvents();

    this.calendarEvents$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((calendarEvents) => {
        this.extendedEvents = this.mapEventsToExtended(calendarEvents);
      });
  }

  refresh = new Subject<void>();

  handleEvent(action: string, event: CalendarEventExtended): void {
    this.dialog.open(EventInfoModalComponent, {
      data: {
        calendarEvent: event,
      },
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.extendedEvents = this.extendedEvents.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: any) {
    this.view = view;
  }

  private mapEventsToExtended(
    events: CalendarEventDto[]
  ): CalendarEventExtended[] {
    const colorKeys = Object.keys(colors); // Get all color keys
    return events.map((event: CalendarEventDto, index: number) => {
      const randomColorKey = colorKeys[index % colorKeys.length]; // Get a color key based on the index
      return {
        id: event.id ? event.id.toString() : undefined,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        title: event.title,
        color: { ...colors[randomColorKey] }, // Use the randomly selected color
        // actions: this.actions,
        allDay: false,
        description: event.description,
        reminder: event.reminder,
        location: event.location,
      };
    });
  }
}
