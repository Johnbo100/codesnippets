import React,{useRef,useState,useEffect,useContext} from 'react'
import { auth,provider } from './config'
import {signInWithPopup} from 'firebase/auth'
import Template from './Template'
const Login = () => {
    const[value,setValue]=useState('')
    const handleclick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue(data.user.email)
            localStorage.setItem("email",data.user.email)
        })
    }
    
    useEffect(()=>{
        setValue(localStorage.getItem('email'))
    },[])
  return (
  <>
    {value?<Template />:
    <button onClick={handleclick}>Sign In with Google</button>
    }
  </> 
   
  )
}

export default Login