import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IListResponse } from '@interfaces/shared.interfaces';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './custom-dropdown.html',
})
export class CustomDropdown implements OnInit, OnChanges {
  @Input() label?: string;
  @Input() placeholder = 'Select...';
  @Input() options: IListResponse[] = [];
  @Input() showClear = false;
  @Input() enableFilter = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage?: string;
  @Input() value: number | string | null = null;

  @Output() valueChange = new EventEmitter<number | null>();

  isOpen = false;
  filterText = '';
  filteredOptions: IListResponse[] = [];
  _value: number | null = null;

  ngOnInit(): void {
    this.filteredOptions = this.options ?? [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = this.options ?? [];
      if (this.filterText) {
        this.filter();
      }
    }
  }

  get selectedOption(): IListResponse | undefined {
    return this.options.find((o) => o.id === this._value);
  }

  writeValue(val: number | null): void {
    this._value = val ?? null;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterText = '';
      this.filteredOptions = this.options;
    }
  }

  select(option: IListResponse): void {
    this._value = option.id;
    this.valueChange.emit(option.id);
    this.isOpen = false;
    this.filterText = '';
  }

  clear(e: MouseEvent): void {
    e.stopPropagation();
    this._value = null;
    this.valueChange.emit(null);
  }

  filter(): void {
    const txt = this.filterText.toLowerCase().trim();
    this.filteredOptions = txt
      ? this.options.filter((o) => o.name.toLowerCase().includes(txt))
      : this.options;
  }
}
