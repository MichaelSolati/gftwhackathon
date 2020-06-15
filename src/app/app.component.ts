import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { GeoFirestoreTypes } from 'geofirestore';
import * as firebase from 'firebase/app';

import { LocationService } from './core/services/location.service';
import { ViewersCollectionService } from './core/services/viewers-collection.service';
import { LatLngLiteral } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private _center = new firebase.firestore.GeoPoint(0, 0);
  private _location = new firebase.firestore.GeoPoint(0, 0);
  private _locationEnabled = false;
  private _markers = new Map<string, GeoFirestoreTypes.GeoDocumentData>();

  constructor(
    private _ls: LocationService,
    private _viewers: ViewersCollectionService
  ) {}

  ngOnInit() {
    this._ls.locationEnabled$.pipe(first()).subscribe(async (enabled) => {
      this._locationEnabled = enabled;
      if (!this._locationEnabled) {
        const result = await this._ls.getLocationPermission();
        if (result) {
          this._location = result as firebase.firestore.GeoPoint;
          this._center = this._location;
          this._locationEnabled = true;
          this._queryAll();
        }
      }
    });
  }

  get location(): firebase.firestore.GeoPoint {
    return this._location;
  }

  get locationEnabled(): boolean {
    return this._locationEnabled;
  }

  get markers(): Map<string, GeoFirestoreTypes.GeoDocumentData> {
    return this._markers;
  }

  centerChange($event: LatLngLiteral): void {
    this._center = new firebase.firestore.GeoPoint($event.lat, $event.lng);
    this._queryAll();
  }

  private _queryAll() {
    this._viewers.queryAll(this._markers, this._center, this._locationEnabled);
  }
}
