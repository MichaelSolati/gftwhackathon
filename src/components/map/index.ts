import {LitElement, customElement} from 'lit-element';
import {google} from 'google-maps';

@customElement('google-maps')
export class GoogleMaps extends LitElement {
  private _google: google;
  private _map: google.maps.Map;

  get map(): google.maps.Map {
    return this._map;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();

    if (!window.google) {
      throw new Error("Google Map's not found");
    }

    this._google = window.google;

    const div = document.createElement('div');
    div.setAttribute('style', 'height: 100%; width: 100%');

    this._map = new this._google.maps.Map(div, {
      center: {lat: 0, lng: 0},
      zoom: 2,
    });

    this.append(div);
  }
}
