import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CalendarEventExtended } from '../app/shared/calendar-event-extended';
import { Subject, take } from 'rxjs';
import { endOfDay, startOfDay } from 'date-fns';
import { CalendarEventStore } from '../app/calendar-events-store';
import { CalendarEventDto } from '../app/shared/calendar-event-dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-add-edit-calendar-event',
  templateUrl: './add-edit-calendar-event.component.html',
  styleUrl: './add-edit-calendar-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditCalendarEventComponent {
  @Input() extendedEvents!: CalendarEventExtended[];
  refresh = new Subject<void>();
  hasValidationErrors!: boolean;

  constructor(
    private readonly _componentStore: CalendarEventStore,
    public dialog: MatDialog
  ) {}

  addEvent() {
    this.extendedEvents = [
      ...this.extendedEvents,
      {
        title: '',
        description: '',
        location: '',
        reminder: '',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventId?: string | number) {
    if (!eventId) {
      this.extendedEvents.pop();

      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        isDelete: true,
        message: 'Are you sure you want to delete this event?',
        buttonText: {
          ok: 'Delete',
          cancel: 'No',
        },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._componentStore.deleteCalendarEvent(+eventId);
        }
      });
  }

  saveEvent(calendarEvent: CalendarEventExtended) {
    if (
      calendarEvent.title === '' ||
      calendarEvent.description === '' ||
      calendarEvent.location === '' ||
      calendarEvent.reminder === ''
    ) {
      this.hasValidationErrors = true;
      return;
    }
    const calendarEventDto: CalendarEventDto = {
      id: calendarEvent?.id ? +calendarEvent.id : undefined,
      title: calendarEvent.title,
      description: calendarEvent.description || '',
      location: calendarEvent.location || '',
      reminder: calendarEvent.reminder || '',
      startTime: calendarEvent.start,
      endTime: calendarEvent.end || new Date(),
    };

    this.hasValidationErrors = false;

    const startDate = this.adjustTimezone(calendarEventDto.startTime);
    const endDate = this.adjustTimezone(calendarEventDto.endTime);

    calendarEventDto.startTime = startDate;
    calendarEventDto.endTime = endDate;

    if (calendarEvent?.id) {
      this._componentStore.updateCalendarEvents(calendarEventDto);
    } else {
      this._componentStore.insertCalendarEvents(calendarEventDto);
    }
  }

  private adjustTimezone(date: Date): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(
      adjustedDate.getHours() - adjustedDate.getTimezoneOffset() / 60,
      adjustedDate.getMinutes(),
      0,
      0
    );
    return adjustedDate;
  }
}
