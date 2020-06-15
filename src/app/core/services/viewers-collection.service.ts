import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  GeoFirestore,
  GeoCollectionReference,
  GeoFirestoreTypes,
} from 'geofirestore';
import { Geokit } from 'geokit';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ViewersCollectionService {
  private _collection: GeoCollectionReference;
  private _subscription: any = false;

  constructor(firestore: AngularFirestore) {
    const geofirestore = new GeoFirestore(firestore.firestore);
    this._collection = geofirestore.collection('viewers');
  }

  async update(
    amount: number,
    currency: string,
    location: firebase.firestore.GeoPoint
  ): Promise<void> {
    if (!location) return;
    const fixed = {
      lat: Number(location.latitude.toFixed(1)),
      lng: Number(location.longitude.toFixed(1)),
    };
    const hash = Geokit.hash(fixed);

    const geodoc = this._collection.doc(hash);
    const snapshot = await geodoc.get();

    let data: any = snapshot.data();
    if (!data) {
      const collections = {};
      collections[currency] = amount;
      data = { collections, coordinates: location };
    } else if (data.collections[currency]) {
      data.collections[currency] += amount;
    } else {
      data.collections[currency] = amount;
    }

    try {
      await geodoc.set(data);
    } catch (e) {
      console.log(e)
    }
    return;
  }

  queryAll(
    markers: Map<string, GeoFirestoreTypes.GeoDocumentData>,
    center: firebase.firestore.GeoPoint,
    locationEnabled = false
  ): void {
    if (!locationEnabled) return;
    if (this._subscription) {
      this._subscription();
      this._subscription = false;
    }

    this._subscription = this._collection
      .near({ center, radius: 1500 })
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed' && markers.has(change.doc.id)) {
            markers.delete(change.doc.id);
          } else if (change.type !== 'removed') {
            const data: GeoFirestoreTypes.GeoDocumentData = change.doc.data();
            data.location = data.g.geopoint.latitude.toFixed(1) + ', ' + data.g.geopoint.longitude.toFixed(1);
            markers.set(change.doc.id, data);
          }
        });
      });
  }
}
