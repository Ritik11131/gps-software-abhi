
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SwitchButton } from "../../../interfaces/switch-button";

@Component({
  selector: 'sky-switch-button',
  templateUrl: './sky-switch-button.component.html',
  styleUrls: ['./sky-switch-button.component.scss']
})
export class SkySwitchButtonComponent {
  @Input("config") config!: SwitchButton;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() onValueOutput: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onChange(e: any) {
    const isChecked = e.target.checked;
    if (isChecked) {
     // this.change.emit(this.config.rightValue);
      this.onValueOutput.emit(this.config.rightValue);
    } else {
     // this.change.emit(this.config.leftValue);
      this.onValueOutput.emit(this.config.leftValue);
    }
  }
  onImitValue(value: string) {
    this.onValueOutput.emit(value);
  }

}
