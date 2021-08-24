import { Component, Input, OnInit } from '@angular/core';
import { RoomEntry } from 'src/app/core/schema/room.shema';

@Component({
  selector: 'app-configurator-confirmed',
  templateUrl: './configurator-confirmed.component.html',
  styleUrls: ['./configurator-confirmed.component.scss']
})
export class ConfiguratorConfirmedComponent implements OnInit {

  @Input() room: RoomEntry;
  @Input() companyName: string;
  constructor() { }

  ngOnInit(): void {
  }

}
