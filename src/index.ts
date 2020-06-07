import './styles/index.scss';

import './libraries/firebase';
import {googleMapsLoader} from './libraries/google-maps';

import './components/map';
import './components/root';

(async () => {
  await googleMapsLoader();
  document.body.append(document.createElement('app-root'));
})();
