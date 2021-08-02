import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-card-checkable',
  templateUrl: './card-checkable.component.html',
  styleUrls: ['./card-checkable.component.scss']
})
export class CardCheckableComponent implements OnInit {

  @Input() public title: string;
  @Input() public imagesource: string;
  @Input() public checked = false;
  @Input() public uncheckable = false;
  @Output() checkEvent = new EventEmitter<boolean>();
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showImg(e) {
    this.openDetail(this.imagesource);
  }

  openDetail(source): void {
    this.dialog.open(ConfiguratorViewModalComponent, {
      data: source
    });
  }

  toggle(event): void {
    this.checkEvent.emit(event.checked);
  }
}

@Component({
  selector: 'app-configurator-view-modal',
  template: `
    <img [src]="data" style="max-width: 100%; max-height: 80vh;" />
  `,
})
export class ConfiguratorViewModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
