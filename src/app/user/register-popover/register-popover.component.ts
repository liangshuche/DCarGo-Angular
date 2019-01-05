import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-register-popover',
  templateUrl: './register-popover.component.html',
  styleUrls: ['./register-popover.component.scss']
})
export class RegisterPopoverComponent implements OnInit {
  @Output() doConfirm: EventEmitter<string>;

  name: string;
  constructor(
    private dialogRef: MatDialogRef<RegisterPopoverComponent>,
  ) { }

  ngOnInit() {
  }

  onConfirm() {
    this.dialogRef.close(this.name);
    // this.doConfirm.emit(this.name);
  }

}
