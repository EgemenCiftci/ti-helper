import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent {
  values = [-1, 0, 1, 2, 3, 4];
  classes = ["red", "red", "red", "orange", "yellow", "green"];

  private _selectedValue?: number;
  @Output() selectedValueChange = new EventEmitter<number | undefined>();
  @Input()
  get selectedValue(): number | undefined {
    return this._selectedValue;
  }

  set selectedValue(val: number | undefined) {
    if (val !== this.selectedValue) {
      this._selectedValue = val;
      this.selectedValueChange.emit(this._selectedValue);
    }
  }

  getClass(value: number): string {
    return this.classes[this.values.indexOf(value)];
  }
}

