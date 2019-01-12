import { Injectable, ɵbypassSanitizationTrustStyle } from '@angular/core';
import { ContractService } from './contract.service';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private contractService: ContractService,
    private snackBar: MatSnackBar,
    private router: Router
    ) { }

  canActivate() {
    return this.contractService.getCurrentName().pipe(
      map((name) => {
        if (!name) {
          this.snackBar.open('Please Register First', 'Dismiss', {
            duration: 2000,
          });
          this.router.navigateByUrl('/user');
          return false;
        }
        return true;
      })
    );
  }
}
