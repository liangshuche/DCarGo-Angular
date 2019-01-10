import { Injectable } from '@angular/core';
import { LocationModel } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  originLatitude: number = 24.996800;
  originLongitude: number = 121.457000;

  latitudeStep: number = 0.000005;
  longitudeStep: number = 0.00001;

  numSteps: number = 15000;

  latitudeBoundary: number = this.originLatitude + this.latitudeStep * this.numSteps;
  longitudeBoundary: number = this.originLongitude + this.longitudeStep * this.numSteps;

  constructor() { }

  intToGeo(location: LocationModel) {
    if (location.intLatitude > 0 && location.intLatitude < this.numSteps &&
        location.intLongitude > 0 && location.intLongitude < this.numSteps) {
      location.geolatitude = this.originLatitude + location.intLatitude * this.latitudeStep;
      location.geolongitude = this.originLongitude + location.intLongitude * this.longitudeStep;
    }
  }

  geoToInt(location: LocationModel) {
    if (location.geolatitude > this.originLatitude && location.geolatitude < this.latitudeBoundary &&
        location.geolongitude > this.originLongitude && location.geolongitude < this.longitudeBoundary) {
      location.intLatitude = Math.round((location.geolatitude - this.originLatitude) / this.latitudeStep);
      location.intLongitude = Math.round((location.geolongitude - this.originLongitude) / this.longitudeStep);
    }
  }
}
