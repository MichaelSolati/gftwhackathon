import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../../environments/environment';
import { LocationService } from './services/location.service';
import { ViewersCollectionService } from './services/viewers-collection.service';
import { WebMonetizationService } from './services/web-monetization.service';
import { PopupsService } from './services/popups.service';

const providers: any[] = [
  LocationService,
  ViewersCollectionService,
  WebMonetizationService,
  PopupsService,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers,
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers,
    };
  }
}
