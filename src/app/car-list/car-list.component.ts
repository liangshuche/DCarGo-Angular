import { Component, OnInit } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { ContractService } from '../core/services/contract.service';
import { map, mergeMap } from 'rxjs/operators';
import { range } from 'rxjs';
import { CarRepoService } from '../core/services/car-repo.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  carArray: CarModel[] = [];
  constructor(
    private contractService: ContractService,
    private carRepoService: CarRepoService
  ) { }

  ngOnInit() {
    this.carRepoService.updateCars();
    this.carRepoService.getAllCars().subscribe((cars) => {
      this.carArray = cars;
    });
  }

}
