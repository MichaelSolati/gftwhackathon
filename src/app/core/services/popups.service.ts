import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';

@Injectable({
  providedIn: 'root',
})
export class PopupsService {
  private _activeToast: HTMLIonToastElement;
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async toast(
    arg: string | Error,
    actions: (ToastButton | string)[] = [],
    duration = 3000
  ): Promise<void> {
    if (this._activeToast) {
      await (this._activeToast as HTMLIonToastElement).dismiss();
    }

    this._activeToast = await this.toastController.create({
      message: arg instanceof Error ? `ERROR: ${arg.message}` : arg,
      duration,
      buttons: actions,
    });

    return this._activeToast.present();
  }
}
