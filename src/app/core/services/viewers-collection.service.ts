import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  GeoFirestore,
  GeoCollectionReference,
  GeoFirestoreTypes,
} from 'geofirestore';
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
        console.log(snapshot);
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed' && markers.has(change.doc.id)) {
            markers.delete(change.doc.id);
          } else if (change.type !== 'removed') {
            markers.set(change.doc.id, change.doc.data());
          }
        });
      });
  }
}
