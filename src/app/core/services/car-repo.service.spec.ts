import { TestBed } from '@angular/core/testing';

import { CarRepoService } from './car-repo.service';

describe('CarRepoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarRepoService = TestBed.get(CarRepoService);
    expect(service).toBeTruthy();
  });
});
