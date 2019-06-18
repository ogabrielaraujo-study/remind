import Firebase from 'firebase';
import 'firebase/firestore';

let config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
};

export const firebase = Firebase.initializeApp(config);
