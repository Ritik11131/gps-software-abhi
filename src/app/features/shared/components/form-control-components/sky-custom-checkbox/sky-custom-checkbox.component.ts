
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sky-custom-checkbox',
  templateUrl: './sky-custom-checkbox.component.html',
  styleUrls: ['./sky-custom-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkyCustomCheckboxComponent),
      multi: true,
    },
  ],
})
export class SkyCustomCheckboxComponent implements OnInit {
  @Input("type") type: string = "checkbox";
  @Input("id") id: string = Date.now().toString();
  @Input("value") value: any;
  @Input("name") name: string = "";
  @Input("disabled") disabled: boolean = false;
  @Input("label") label: string = "";
  @Input("rtl") rtl: boolean = false;
  @Input("group") group: string = '';
  @Input('checked')checked!: boolean;
  @Output("model") model = new EventEmitter<any>();
  @Output("callCheck") callCheck = new EventEmitter<any>();

  onChange: any = () => {
    let state = {
      state: this.checked,
      value: this.value,
      group: this.group
    };
    this.model.emit(state);
  };
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  constructor() {}

  ngOnInit() {}

  writeValue(checked: boolean) {
    this.checked = checked;
  }

  onControlChange(e: boolean) {
    this.checked = !this.checked;
    this.onChange(this.checked);
  }
}
