import { useState } from 'react';
import './register.css';
import { NavLink } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  {/* Handle Registration of Information */}
  function handleRegister(){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userInfo)=>{
      alert("Registered Successfully\nEmail: "+userInfo.user.email);
      window.location.href = "./setup";
    })
    .catch((error)=>{
      console.log(error);
      alert("Error: "+error.message);
    });
  }

  return (
    <div className='register-container'>

      <div className='register-card'>
          <h1>Register Page</h1>
          <input onChange={(e)=>setEmail(e.target.value)} type="email" id="" placeholder="Email" />
          <input onChange={(e)=>setPassword(e.target.value)} type="password" id="" placeholder="Password" />
          <button onClick={handleRegister}>Register</button>
          <p>Already have an Account? <NavLink to='./login'>Login</NavLink></p>
      </div>

    </div>
  )
}

export default Register;
