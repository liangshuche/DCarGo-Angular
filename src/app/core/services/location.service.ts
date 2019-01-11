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

  createLocation(xLocate: number, yLocate: number): LocationModel {
    const location: LocationModel = {
      intLatitude: yLocate,
      intLongitude: xLocate,
      geoLatitude: 0,
      geoLongitude: 0
    };
    return this.intToGeo(location);
  }

  intToGeo(location: LocationModel): LocationModel {
    if (location.intLatitude >= 0 && location.intLatitude < this.numSteps &&
        location.intLongitude >= 0 && location.intLongitude < this.numSteps) {
      location.geoLatitude = this.originLatitude + location.intLatitude * this.latitudeStep;
      location.geoLongitude = this.originLongitude + location.intLongitude * this.longitudeStep;
    }
    return location;
  }

  geoToInt(location: LocationModel): LocationModel {
    if (location.geoLatitude >= this.originLatitude && location.geoLatitude < this.latitudeBoundary &&
        location.geoLongitude >= this.originLongitude && location.geoLongitude < this.longitudeBoundary) {
      location.intLatitude = Math.round((location.geoLatitude - this.originLatitude) / this.latitudeStep);
      location.intLongitude = Math.round((location.geoLongitude - this.originLongitude) / this.longitudeStep);
    }
    return location;
  }
}
