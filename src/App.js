import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD0zwuAOZ5GJz7yGsQibKUztwuUVS8MHD4",
  authDomain: "zipzap-2e0f8.firebaseapp.com",
  projectId: "zipzap-2e0f8",
  storageBucket: "zipzap-2e0f8.appspot.com",
  messagingSenderId: "1056458319459",
  appId: "1:1056458319459:web:07b1a7027c6f50a0797a56",
  measurementId: "G-9HD21H4VZ7"
}) 

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>zap2.0? ⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        { user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>Entrar com Google</button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sair</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, { idField: 'id' })
  const[formValue, setFormValue] = useState('')
  
  const sendMessage = async (e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={ (e) => setFormValue(e.target.value)} placeholder="Mensagem"/>
        <button type='submit'>🎈</button>

      </form>
    </>
  )

  function ChatMessage(props) {
    const { text, uid, photoURL} = props.message
    const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received'

    return (
      <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{ text }</p>
      </div>
      </>
    )
  }
}

export default App;
