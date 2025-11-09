import { NavLink } from 'react-router';
import './login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useState } from 'react';

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

      <div className='login-card'>

        <h1>Login Page</h1>
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email'/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password'/>
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an Account? <NavLink to="/register">Register</NavLink></p>

      </div>
      
    </div>
  )
}

export default Login;
