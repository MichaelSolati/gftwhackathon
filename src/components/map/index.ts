import {LitElement, customElement} from 'lit-element';
import {Loader, google} from 'google-maps';

import {environment} from '../../environments';

@customElement('google-maps')
export class GoogleMaps extends LitElement {
  private _google: google;
  private _map: google.maps.Map;

  constructor() {
    super();
    this.setAttribute('style', 'display: block; height: 100vh; width: 100vw;');
  }

  get map(): google.maps.Map {
    return this._map;
  }

  createRenderRoot(): Element {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();

    if (!window.google) {
      const loader = new Loader(environment.firebase.apiKey);
      window.google = await loader.load();
    }

    this._google = window.google;

    const div = document.createElement('div');
    div.setAttribute('style', 'height: 100%; width: 100%');

    this._map = new this._google.maps.Map(div, {
      center: {lat: 0, lng: 0},
      zoom: 17,
    });

    this.append(div);
  }
}
