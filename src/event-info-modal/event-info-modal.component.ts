import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventExtended } from '../app/shared/calendar-event-extended';

@Component({
  selector: 'app-event-info-modal',
  templateUrl: './event-info-modal.component.html',
  styleUrls: ['./event-info-modal.component.scss'],
})
export class EventInfoModalComponent implements OnInit {

  calendarEventData = this.data?.calendarEvent

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: {
      calendarEvent?: CalendarEventExtended;
    }
  ) {}

  ngOnInit() {}
}
