import {Component, Input, OnInit} from '@angular/core';
import { Laboratory } from '../../../../data/models/laboratory';
import {TitleCasePipe} from '@angular/common';
import {Schedule} from '../../../../data/models/schedule';
import {Day} from '../../../../data/models/day';

@Component({
  selector: 'app-laboratory-view',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './laboratory-view.component.html',
  styleUrl: './laboratory-view.component.css',
  standalone: true,
})
export class LaboratoryViewComponent implements OnInit {
  @Input() laboratory?: Laboratory;

  scheduleData: { time: string; [key: string]: any }[] = [];
  displayedColumns: string[] = ['time'];
  days: Day[] = [];

  ngOnInit(): void {
    this.prepareScheduleData();
  }

  private prepareScheduleData(): void {
    if (!this.laboratory?.laboratorySchedules?.length) return;

    // Extract and sort unique days
    this.days = this.extractUniqueDays();
    this.displayedColumns = ['time', ...this.days.map(day => `day-${day.dayId}`)];

    // Prepare schedule data rows
    this.scheduleData = [
      this.createTimeRow('Початок роботи', 'startTime'),
      this.createTimeRow('Кінець роботи', 'endTime'),
      this.createTimeRow('Кінець прийому', 'collectionEndTime')
    ];
  }

  private extractUniqueDays(): Day[] {
    return (this.laboratory?.laboratorySchedules || [])
      .map(ls => ls.schedule.day)
      .filter((day, index, self) =>
        index === self.findIndex(d => d.dayId === day.dayId)
      )
      .sort((a, b) => a.dayId - b.dayId);
  }

  private createTimeRow(timeLabel: string, timeProperty: keyof Schedule):
    { time: string; [key: string]: any } {
    const row: { time: string; [key: string]: any } = { time: timeLabel };

    this.days.forEach(day => {
      const schedule = this.getScheduleForDay(day.dayId);
      const timeValue = schedule?.[timeProperty];

      row[`day-${day.dayId}`] = {
        value: timeValue ? this.formatTime(timeValue.toString()) : '—',
        dayName: day.dayName
      };
    });

    return row;
  }

  private getScheduleForDay(dayId: number): Schedule | undefined {
    if (!this.laboratory?.laboratorySchedules) return undefined;

    const foundSchedule = this.laboratory.laboratorySchedules
      .find(ls => ls?.schedule?.day?.dayId === dayId);

    return foundSchedule?.schedule;
  }

  private formatTime(timeString: string): string {
    if (!timeString) return '—';

    try {
      // Extract just hours and minutes (HH:mm)
      return timeString.split(':').slice(0, 2).join(':');
    } catch {
      return timeString; // Return original if formatting fails
    }
  }

  getDayName(column: string): string {
    if (column === 'time') return '';
    const dayId = parseInt(column.replace('day-', ''));
    return this.days.find(day => day.dayId === dayId)?.dayName || '';
  }
}
