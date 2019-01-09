import { Component, OnInit } from '@angular/core';
import { ContractService } from '../core/services/contract.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit() {
  }

}
