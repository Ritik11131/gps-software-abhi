import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'history-slider-control',
  templateUrl: './history-slider-control.component.html',
  styleUrls: ['./history-slider-control.component.scss'],
})
export class HistorySliderControlComponent {
  @Input() isPlay: any;
  @Input() sliderValue: number = 0;  // Define the @Input property for sliderValue
  @Output() sliderValueevent = new EventEmitter<number>();
  @Output() isPlayed = new EventEmitter<boolean>();

  constructor(public userService: UserService) {}

  sliderChange(event: any) {
    this.sliderValue = 0
    this.sliderValue = event.target.value;
    
    this.sliderValueevent.emit(this.sliderValue);
  }

  sliderplay() {
    this.isPlay = !this.isPlay;
    this.isPlayed.emit(this.isPlay);
    this.sliderValueevent.emit(this.sliderValue);
  }
  
}
