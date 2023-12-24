// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOOydBsiN-u3FHO8Dc8jHN0WTtKytQOjA",
    authDomain: "dep11-chat-app-798e0.firebaseapp.com",
    projectId: "dep11-chat-app-798e0",
    storageBucket: "dep11-chat-app-798e0.appspot.com",
    messagingSenderId: "1074873904057",
    appId: "1:1074873904057:web:806210c972c01d5487a468"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)