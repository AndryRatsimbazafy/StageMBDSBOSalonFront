import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfiguratorViewModalComponent } from '../card-checkable/card-checkable.component';

@Component({
  selector: 'app-simple-card-clickable',
  templateUrl: './simple-card-clickable.component.html',
  styleUrls: ['./simple-card-clickable.component.scss']
})
export class SimpleCardClickableComponent implements OnInit {

  @Input() public title: string;
  @Input() public value: string;
  @Input() public image: string;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showImg(): void {
    this.openDetail(this.image);
  }

  openDetail(source): void {
    this.dialog.open(ConfiguratorViewModalComponent, {
      data: source
    });
  }
}
