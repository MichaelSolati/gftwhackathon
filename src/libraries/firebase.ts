import firebase from '@firebase/app';
import 'firebase/firestore';
import {environment} from '../environments';

firebase.initializeApp(environment.firebase);
