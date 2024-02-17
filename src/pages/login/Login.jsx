import React from 'react'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../services/firebaseConfig';
import styles from './Login.module.css'
import googleIcon from './../../assets/google_icon.png'

const provider = new GoogleAuthProvider();

export const Login = () => {

  const login = () => {
    
    signInWithPopup(auth, provider)
  }

  return (
    <div className={styles.login}>
      <h1>Seja bem vindo!</h1>
      <button className={styles.buttonGoogle} onClick={login}>
        <img src={googleIcon} alt="teste" />
        <span>Fazer login com o google</span>
      </button>
    </div>
  )
}
