import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _locationEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(private _alert: AlertController) {
    this._watchLocationEnabled();
  }

  get locationEnabled$(): Observable<boolean> {
    return this._locationEnabled$.asObservable();
  }

  getCurrentPosition(): Observable<firebase.firestore.GeoPoint> {
    return new Observable((observer) => {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (success) => {
            observer.next(
              new firebase.firestore.GeoPoint(
                success.coords.latitude,
                success.coords.longitude
              )
            );
            observer.complete();
          },
          (error) => {
            observer.error(error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        observer.error(new Error('Geolocation API unavailable'));
      }
    });
  }

  async getLocationPermission(): Promise<
    boolean | firebase.firestore.GeoPoint
  > {
    const permissionModal = new Promise<boolean>(async (resolve) => {
      const alert = await this._alert.create({
        header: 'Allow gftwhackathon location access',
        message: 'This app will not function properly without your loaction',
        buttons: [
          {
            text: 'DENY',
            handler: () => resolve(false),
          },
          {
            text: 'ALLOW',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });

    if (!(await permissionModal)) {
      return this.getLocationPermission();
    }

    return this._getLocation();
  }

  private async _getLocation(): Promise<boolean | firebase.firestore.GeoPoint> {
    const location = new Promise<boolean | firebase.firestore.GeoPoint>(
      (resolve) => {
        this.getCurrentPosition().subscribe({
          next: (loc) => resolve(loc),
          error: () => resolve(false),
        });
      }
    );

    if (await location) {
      return location;
    } else {
      const alert = await this._alert.create({
        header: 'Permission not granted',
        message:
          'Without access to your location this app will not work properly, sorry ahead of time',
        buttons: ['OK'],
      });
      await alert.present();
      return false;
    }
  }

  private _watchLocationEnabled(): void {
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(
        (result) => {
          this._locationEnabled$.next(result.state === 'granted');
          const self = this;
          result.onchange = function () {
            self._locationEnabled$.next(this.state === 'granted');
          };
        },
        () => {
          this._locationEnabled$.next(false);
        }
      );
    } else {
      this._locationEnabled$.next(false);
    }
  }
}
