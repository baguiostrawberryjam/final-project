import { NavLink } from 'react-router';
import './login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useState } from 'react';

import logo from "../../assets/images/react.svg";

// Test: Login folder still exists

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  {/* Handle Login Verification */}
  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
      alert('Login Successful\n Email: '+userCredential.user.email);
      window.location.href='/dashboard';
    }).catch((error)=>{
      alert(error.message);
    });
  }

  return (
    <div className='login-container'>

      <div className='login-left-section'>
        <img src={logo} alt="" />
      </div>

      <div className='login-right-section'>

        <div className='header'>
          <h1 className='title-bold'>Login Page</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem, fuga quisquam molestias dolorem hic cumque ratione eveniet, omnis distinctio repellat nesciu</p>
        </div>

        <div className='login-forms'>
          <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email'/>
          <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password'/>
          <button onClick={handleLogin}>Login</button>
        </div>
        <p>or</p>

        <div className='quick-login'>
          <button>Continue with Google</button>
          <button>Continue with Apple</button>
        </div>
        
        
        <p>Don't have an Account? <NavLink to="/register">Register</NavLink></p>

      </div>
      
    </div>
  )
}

export default Login;
