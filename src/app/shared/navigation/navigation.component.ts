import { Component, OnInit } from '@angular/core';
import { CarRepoService } from 'src/app/core/services/car-repo.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private carRepoService: CarRepoService
  ) { }

  ngOnInit() {
    this.carRepoService.updateCars();
  }

}
