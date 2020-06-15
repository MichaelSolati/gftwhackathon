import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { LocationService } from './services/location.service';
import { ViewersCollectionService } from './services/viewers-collection.service';
import { WebMonetizationService } from './services/web-monetization.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    LocationService,
    ViewersCollectionService,
    WebMonetizationService,
  ],
})
export class CoreModule {}
