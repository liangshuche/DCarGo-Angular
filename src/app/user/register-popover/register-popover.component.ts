import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ContractService } from 'src/app/core/services/contract.service';

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
    private contractService: ContractService
  ) { }

  ngOnInit() {
  }

  onConfirm() {
    if (this.name.length) {
      this.contractService.registerUserName(this.name).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.dialogRef.close();
    }
    // this.doConfirm.emit(this.name);
  }

}
