import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-calling',
  templateUrl: './calling.component.html',
  styleUrls: ['./calling.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CallingComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    private socket: Socket
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    console.log("hang up from calling modal", this.data.socket)
    this.socket.emit("hangup", {to: this.data.socket})
    this.dialogRef.close(false);
  }

  answer(): void {
    this.dialogRef.close(true);
  }
}
