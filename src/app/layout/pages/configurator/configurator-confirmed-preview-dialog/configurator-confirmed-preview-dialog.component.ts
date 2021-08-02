import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-configurator-confirmed-preview-dialog',
  templateUrl: './configurator-confirmed-preview-dialog.component.html',
  styleUrls: ['./configurator-confirmed-preview-dialog.component.scss']
})
export class ConfiguratorConfirmedPreviewDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
