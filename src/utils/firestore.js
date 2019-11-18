import * as firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: ""
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();
