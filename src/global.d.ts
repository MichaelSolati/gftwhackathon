import {google} from 'google-maps';

declare global {
  interface Window {
    google: google;
  }
}

export {};
