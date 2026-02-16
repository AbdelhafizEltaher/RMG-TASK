import { DatePipe, SlicePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isDisabled: boolean;
}
@Component({
  selector: 'app-custom-calendar',
  imports: [FormsModule , SlicePipe , DatePipe],
  templateUrl: './custom-calendar.html',
})
export class CustomCalendar implements OnInit, OnChanges {
  @Input() highlightedDays: Date[] = [];
  @Input() value?: Date;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showOutsideDays = true;
  @Input() className = '';
  @Input() disabled = false;
  @Input() placeholder = 'Select a date';
  @Input() inputClassName = '';
  @Input() errorMessage?: string;
  @Input() label?: string;
  @Input() labelClass = '';
  @Input() required = false;
  @Output() valueChange = new EventEmitter<Date | undefined>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('calendarRef') calendarRef!: ElementRef<HTMLDivElement>;

  // Constants
  readonly MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  readonly WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // State
  currentDate: Date;
  isOpen = false;
  viewMode: 'calendar' | 'month' | 'year' = 'calendar';
  yearRangeStart: number;
  calendarDays: CalendarDay[] = [];

  constructor() {
    const today = new Date();
    this.currentDate = this.value ? new Date(this.value) : new Date();
    this.yearRangeStart =
      Math.floor((this.value?.getFullYear() || today.getFullYear()) / 12) * 12;
  }

  ngOnInit(): void {
    this.updateCalendarDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !this.isOpen) {
      if (this.value) {
        this.currentDate = new Date(
          this.value.getFullYear(),
          this.value.getMonth(),
          1,
        );
      }
      this.updateCalendarDays();
    }

    if (
      changes['highlightedDays'] ||
      changes['minDate'] ||
      changes['maxDate'] ||
      changes['disabled']
    ) {
      this.updateCalendarDays();
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen) {
      const target = event.target as Node;
      const isClickInside =
        this.calendarRef?.nativeElement?.contains(target) ||
        this.inputRef?.nativeElement?.contains(target);

      if (!isClickInside) {
        this.isOpen = false;
        this.viewMode = 'calendar';
      }
    }
  }

  // Helper functions
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private updateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month days
    if (this.showOutsideDays && firstDayWeekday > 0) {
      const prevMonth = new Date(year, month - 1, 0);
      const daysInPrevMonth = prevMonth.getDate();

      for (let i = firstDayWeekday - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPrevMonth - i);
        days.push(this.createCalendarDay(date, false));
      }
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true));
    }

    // Next month days
    if (this.showOutsideDays) {
      const remainingDays = 42 - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        days.push(this.createCalendarDay(date, false));
      }
    }

    this.calendarDays = days;
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    return {
      date,
      isCurrentMonth,
      isToday: this.isSameDay(date, today),
      isSelected: this.value ? this.isSameDay(date, this.value) : false,
      isHighlighted: this.highlightedDays.some((hDate) => this.isSameDay(date, hDate)),
      isDisabled:
        this.disabled ||
        (this.minDate ? date < this.minDate : false) ||
        (this.maxDate ? date > this.maxDate : false),
    };
  }

  // Navigation methods
  navigateMonth(direction: 'prev' | 'next'): void {
    const newDate = new Date(this.currentDate);
    if (direction === 'prev') {
      newDate.setMonth(this.currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(this.currentDate.getMonth() + 1);
    }

    // Apply constraints
    if (this.maxDate && newDate > this.maxDate) {
      this.currentDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
    } else if (this.minDate && newDate < this.minDate) {
      this.currentDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1);
    } else {
      this.currentDate = newDate;
    }

    this.updateCalendarDays();
  }

  navigateYearRange(direction: 'prev' | 'next'): void {
    if (direction === 'prev') {
      this.yearRangeStart -= 12;
    } else {
      this.yearRangeStart += 12;
    }
  }

  // Selection methods
  handleMonthSelect(selectedMonth: number): void {
    let newDate = new Date(this.currentDate.getFullYear(), selectedMonth, 1);

    // Apply constraints
    if (this.minDate && newDate < this.minDate) {
      newDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1);
    } else if (this.maxDate && newDate > this.maxDate) {
      newDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
    }

    this.currentDate = newDate;
    this.viewMode = 'calendar';
    this.updateCalendarDays();
  }

  handleYearSelect(selectedYear: number): void {
    let newDate = new Date(selectedYear, this.currentDate.getMonth(), 1);

    // Apply constraints
    if (this.minDate && newDate < this.minDate) {
      newDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1);
    } else if (this.maxDate && newDate > this.maxDate) {
      newDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
    }

    this.currentDate = newDate;
    this.viewMode = 'calendar';
    this.updateCalendarDays();
  }

  handleDateClick(day: CalendarDay): void {
    if (!day.isDisabled) {
      this.valueChange.emit(day.date);
      this.isOpen = false;
      this.viewMode = 'calendar';
    }
  }

  handleClearDate(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.valueChange.emit(undefined);
      this.isOpen = false;
      this.viewMode = 'calendar';
    }
  }

  // UI actions
  toggleCalendar(): void {
    if (!this.disabled) {
      if (!this.isOpen && this.value) {
        this.currentDate = new Date(
          this.value.getFullYear(),
          this.value.getMonth(),
          1,
        );
        this.updateCalendarDays();
      }
      this.isOpen = !this.isOpen;
    }
  }

  setViewMode(mode: 'calendar' | 'month' | 'year'): void {
    if (!this.disabled) {
      if (mode === 'year') {
        this.yearRangeStart = Math.floor(this.currentDate.getFullYear() / 12) * 12;
      }
      this.viewMode = mode;
    }
  }

  // Getters
  get displayValue(): string {
    if (this.value) {
      return this.formatDate(this.value);
    }
    return '';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isPrevMonthDisabled(): boolean {
    return (
      !!this.disabled ||
      (!!this.minDate &&
        this.currentDate.getMonth() === this.minDate.getMonth() &&
        this.currentDate.getFullYear() === this.minDate.getFullYear())
    );
  }

  isNextMonthDisabled(): boolean {
    return (
      !!this.disabled ||
      (!!this.maxDate &&
        this.currentDate.getMonth() === this.maxDate.getMonth() &&
        this.currentDate.getFullYear() === this.maxDate.getFullYear())
    );
  }

  isMonthDisabled(monthIndex: number): boolean {
    const monthDate = new Date(this.currentDate.getFullYear(), monthIndex, 1);
    return (
      this.disabled ||
      (this.minDate
        ? monthDate < new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1)
        : false) ||
      (this.maxDate
        ? monthDate > new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1)
        : false)
    );
  }

  isYearDisabled(yearValue: number): boolean {
    const yearDate = new Date(yearValue, this.currentDate.getMonth(), 1);
    return (
      this.disabled ||
      (this.minDate
        ? yearDate < new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1)
        : false) ||
      (this.maxDate
        ? yearDate > new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1)
        : false)
    );
  }
}
