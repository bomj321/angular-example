import { Component, OnInit, Input, Output, forwardRef, EventEmitter, Inject  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements OnInit, ControlValueAccessor {

  @Input() min = 1;
  @Input('max') max = undefined
  @Input('id') id: any;

  @Input() readonly: boolean = false
  @Output() change = new EventEmitter()

  constructor() { }

  

  value: number;
  isDisabled: boolean;
  onChange = (_:any) => { }
  onTouch = () => { }

  ngOnInit() 
  {
    this.value = 1;
  }

  addGuests(){
    this.value++
    if (this.max) {
      if (this.value > this.max) {
        this.value = this.max
      }
    }
    this.onInput(this.value)
  }
  subGuests(){
    this.value--
    if (this.value < this.min) {
      this.value = this.min
    }
    this.onInput(this.value)
  }

  onChangeEvent(value: number) {
    this.change.emit(value)
    this.onTouch();
    this.onChange(this.value);
  }

  onInput(value: number) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value || 0;
    } else {
      this.value = 0;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
