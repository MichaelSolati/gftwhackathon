import {Loader} from 'google-maps';

import {environment} from '../environments';

export const googleMapsLoader = async () => {
  const loader = new Loader(environment.firebase.apiKey);
  await loader.load();
};
