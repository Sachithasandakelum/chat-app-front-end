import {auth} from "../firebase.js";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
const API_BASE_URL = 'ws://localhost:8080/api/v1';

const btnSignInElm = document.querySelector("#btn-sign-in")
const txtMessageElm = document.querySelector("#txt-message");
const btnSendElm = document.querySelector("#btn-send");
const outputElm = document.querySelector("#output");
const logInOverleyElm = document.querySelector("#login-overley");
const accountElm = document.querySelector("#account");
const userNameElm = document.querySelector("#user-name");
const userEmailElm = document.querySelector("#user-email");
const btnSignOutElm = document.querySelector("#btn-sign-out");
const accountDetailsElm = document.querySelector("#account-details");
const loaderElm = document.querySelector("#loader");


const user = {
    email:null,
    name:null,
    picture:null
};

let ws = null;

btnSignOutElm.addEventListener('click',()=>{
    signOut(auth);
});

accountElm.addEventListener('click',(e)=>{
    accountDetailsElm.classList.remove("d-none");
    e.stopPropagation();
});

document.addEventListener('click',()=>{
    accountDetailsElm.classList.add("d-none")
})

onAuthStateChanged(auth,(loggedUser)=>{
    loaderElm.classList.add("d-none");
    if(loggedUser){
        user.email=loggedUser.email;
        user.name=loggedUser.name;
        user.picture=loggedUser.photoURL;
        finalizeLogin();
        logInOverleyElm.classList.add("d-none");
        ws = new WebSocket(`${API_BASE_URL}/messages`);
        ws.addEventListener('message',loadChatMessages);
        ws.addEventListener('error',()=>{
            alert("Connection faliure. Try refreshing the application");
        })
    }else{
        user.email=null;
        user.name=null;
        user.picture=null;
        logInOverleyElm.classList.remove("d-none");
        if(ws){
            ws.close();
            ws=null;
        }
    }
})

const provider = new GoogleAuthProvider();

// signInWithPopup(auth,provider)

console.log(auth);

btnSignInElm.addEventListener('click',()=>{
    signInWithPopup(auth,provider)
        .then(res=>{
            user.name=res.user.displayName;
            user.email=res.user.email;
            user.picture=res.user.photoURL;
            logInOverleyElm.classList.add("d-none");
            finalizeLogin();
        }).catch(err=>alert("Failed to Sign In"))
});

function finalizeLogin(){
    userNameElm.innerText=user.name;
    userEmailElm.innerText=user.email;
    accountElm.style.backgroundImage=`url(${user.picture})`;
}

btnSendElm.addEventListener('click', ()=> {
    const message = txtMessageElm.value.trim();
    console.log(message)
    if (!message) return;
    const msgObj={
        message,
        email:user.email
    }

    ws.send(JSON.stringify(msgObj));
    addChatMessageRecord(msgObj);
    outputElm.scrollTo(0, outputElm.scrollHeight);
    txtMessageElm.value = '';
    txtMessageElm.focus();
});

function addChatMessageRecord({message,email}){
    const messageElm = document.createElement('div');
    messageElm.classList.add('message');
    if(email===user.email){
        messageElm.classList.add("me");
    }else{
        messageElm.classList.add("others");
    }
    outputElm.append(messageElm);
    messageElm.innerText = message;
}


function loadChatMessages(e){
    const msg =JSON.parse( e.data);
    addChatMessageRecord(msg);
}
