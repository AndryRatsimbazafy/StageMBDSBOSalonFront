import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { TimerService } from 'src/app/@core/service/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  message: string
  periodForm = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });

  constructor(public timerService: TimerService) {

  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.message = undefined
    const obj = {
      start: this.periodForm.value['start'].toString().split('GMT')[0].trim(),
      end: this.periodForm.value['end'].toString().split('GMT')[0].trim()
    }
    console.log(obj);
    this.timerService.post(obj).subscribe(timer => {
      if (timer && timer.body) this.message = 'ok'
    }, err => {
      this.message = 'failed'
    })
  }

}
