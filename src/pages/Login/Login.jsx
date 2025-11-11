import { NavLink } from 'react-router';
import './login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useState } from 'react';
import loginHero from "../../assets/images/login-hero.jpg";
import { FaGoogle, FaApple } from 'react-icons/fa';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  {/* Handle Login Verification */}
  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
      alert('Login Successful\n Email: '+userCredential.user.email);
      window.location.href='/final-project/dashboard';
    }).catch((error)=>{
      alert(error.message);
    });
  }

  function checkEmail(e){
    let email = e.target.value
    setEmail(email);
    
    // Always update the email state
    setEmail(email)

    if(email.trim().length <= 0){
        setEmailError("Input required");
        setIsEmailValid(false);
    } else if(email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
        setEmailError("Invalid email");
        setIsEmailValid(false);
    } else {
        setEmailError("");
        setIsEmailValid(true);
    }
  }

  function checkPassword(e){
      let pass = e.target.value
      

      // Always update the password state
      setPassword(pass)

      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\S+$).{8,20}$/

      if(pass.trim().length <= 0){
          setPasswordError("Input Required");
          setIsPasswordValid(false);
      } else if(!passwordRegex.test(pass)){
          setPasswordError("Invalid Password");
          setIsPasswordValid(false);
      } else {
          setPasswordError("");
          setIsPasswordValid(true);
      }
  }

  return (
    <div className='login-container'>

      <div className='login-left-section'>
        <img src={loginHero} alt="" />
      </div>

      <div className='login-right-section'>

        <div className='header'>
          <h1 className='title-bold'>WELCOME</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem</p>
        </div>

        <div className='login-forms'>
          
          <div className='input-container'>
            <input onChange={(e)=>checkEmail(e)} type="email" placeholder='Email' className={emailError ? 'input-error': ''}/>
            {emailError && <p className='txtError'>{emailError}</p>}
          </div>
          
          <div className='input-container'>
            <input onChange={(e)=>checkPassword(e)} type="password" placeholder='Password' className={passwordError ? 'input-error' : ''}/>
            {passwordError && <p className='txtError'>{passwordError}</p>}
          </div>

          <button className='login-btn' onClick={handleLogin} disabled={!isEmailValid || !isPasswordValid}>Login</button>
        </div>
        <p>or</p>

        <div className='quick-login'>
          <button>
            <FaGoogle /> Continue with Google
          </button>
          <button>
            <FaApple /> Continue with Apple
          </button>
        </div>
        
        
        <p>Don't have an account? <NavLink to="/register" className="link-text">Register</NavLink></p>

      </div>
      
    </div>
  )
}

export default Login;