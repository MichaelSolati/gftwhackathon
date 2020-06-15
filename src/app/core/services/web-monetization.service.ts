import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { ViewersCollectionService } from './viewers-collection.service';
import { PopupsService } from './popups.service';

@Injectable({
  providedIn: 'root',
})
export class WebMonetizationService {
  private _donated: boolean;
  private _monitized: Map<string, number> = new Map();
  private _monitizationEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    typeof document !== 'undefined' && 'monetization' in document
  );

  constructor(
    private _alert: AlertController,
    private _popups: PopupsService,
    private _viewers: ViewersCollectionService
  ) {
    if (localStorage) {
      this._donated = localStorage.getItem('donated') !== 'false';
    }
  }

  get donated(): boolean {
    return this._donated;
  }

  get monitizationEnabled(): boolean {
    return this._monitizationEnabled$.value;
  }

  get monitizationEnabled$(): Observable<boolean> {
    return this._monitizationEnabled$.asObservable();
  }

  async checkEnabled(): Promise<boolean> {
    if (this.monitizationEnabled) {
      return this.monitizationEnabled;
    }
    const alert = await this._alert.create({
      header: "Web Monitization isn't available",
      message: 'This app may not provide details...',
      buttons: ['OK'],
    });

    await alert.present();

    return this.monitizationEnabled;
  }

  async monitize(location: firebase.firestore.GeoPoint) {
    if (!(await this.checkEnabled()) || !location) {
      return;
    }
    (document as any).monetization.addEventListener('monetizationprogress', (e) => {
      const scale = e.detail.assetScale;
      const currency = e.detail.assetCode;
      const scaled = Number(
        (Number(e.detail.amount) * Math.pow(10, -scale)).toFixed(scale)
      );

      let total = this._monitized.has(currency)
        ? this._monitized.get(currency)
        : 0;
      total += scaled;
      this._donated = true;
      if (localStorage) {
        localStorage.setItem('donated', 'true');
      }
      this._monitized.set(currency, total);
      this._viewers.update(total, currency, location);
      this._popups.toast(`Thank you for the ${total} ${currency}`);
    });
  }
}
