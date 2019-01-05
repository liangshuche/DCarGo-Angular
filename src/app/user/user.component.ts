import { Component, OnInit } from '@angular/core';
import { RegisterPopoverComponent } from './register-popover/register-popover.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onClickRegister() {
    this.dialog.open(RegisterPopoverComponent);
  }

}
