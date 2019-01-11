import { LocationModel } from './location.model';

export class CarModel {
    name: string;
    // info: string;
    type: string;
    age: number;
    price: number;
    location: LocationModel;
    id: number;
    oil: number;
    damage: number;
    rentTime: number;
    ownerAddr: string;
    ownerName: string;
    renterAddr: string;
    renterName: string;
    rented: boolean;
}
