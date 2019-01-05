import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RegisterPopoverComponent } from './register-popover/register-popover.component';
import { MatDialog } from '@angular/material';
import { ContractService } from '../core/services/contract.service';
import { tap, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userAddress: string;
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.contractService.getCurrentAddress().subscribe((addr) => {
      this.userAddress = addr;
    });
  }

  onClickRegister() {
    const registerDialogRef = this.dialog.open(RegisterPopoverComponent);
    registerDialogRef.afterClosed().pipe(
      tap((name) => { console.log(name); }),
      mergeMap((name) => {
        return this.contractService.registerUserName(name);
      }),
      map((result) => {
        if (result) {
          console.log('success');
        }
      })
    ).subscribe();
  }

}
