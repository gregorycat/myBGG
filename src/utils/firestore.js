import * as firebase from "firebase";
import "firebase/firestore";
import { loadJsonFile } from './configLoader';

let config = undefined;

try {
  config = loadJsonFile(__dirname+'/../config/firebase.json');
} catch (exception) {
  console.log(exception);
}

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();


