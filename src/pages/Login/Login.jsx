import { NavLink } from 'react-router';
import "../../components/styles/auth-forms.css";
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
  const [remember, setRemember] = useState(false);

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
    

    if(email.trim().length <= 0){
        setEmailError("Input required");
        setIsEmailValid(false);
    } else if(email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
        setEmailError("Invalid email address");
        setIsEmailValid(false);
    } else {
        setEmailError("");
        setIsEmailValid(true);
    }
  }

  function checkPassword(e){
      let pass = e.target.value
      setPassword(pass);

      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\S+$).{8,20}$/

      if(pass.trim().length <= 0){
          setPasswordError("Input required");
          setIsPasswordValid(false);
      } else if(!passwordRegex.test(pass)){
          setPasswordError("Invalid password");
          setIsPasswordValid(false);
      } else {
          setPasswordError("");
          setIsPasswordValid(true);
      }
  }

  return (
    <div className='main-container'>

      <div className='left-section'>
        <img src={loginHero} alt="" />
      </div>

      <div className='right-section'>

        <div className='header'>
          <h1 className='title-bold'>WELCOME</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem</p>
        </div>

        <div className='forms'>
          
          <div className='input-container'>
            <label htmlFor="email" className='input-label'>Email</label>
            <input 
              id='email'
              type="email"
              placeholder='Enter your email'
              onChange={(e)=>checkEmail(e)}   
              className={emailError ? 'input-error': ''}/>
            {emailError && <p className='txtError'>{emailError}</p>}
          </div>
          
          <div className='input-container'>
            <label htmlFor="password" className='input-label'>Password</label>
            <input
              id='password'
              type="password"
              placeholder='Enter your Password' 
              onChange={(e)=>checkPassword(e)}  
              className={passwordError ? 'input-error' : ''}/>
              {passwordError && <p className='txtError'>{passwordError}</p>}
          </div>

          <div className='form-options'>
            <label className='remember-option'>
              <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <NavLink to="/forgot" className='link-text'>Forgot password?</NavLink>
          </div>

          <button className='auth-btn' onClick={handleLogin} disabled={!isEmailValid || !isPasswordValid}>Login</button>
          
        </div>

        <p>or</p>

        <div className='social-btn'>
          <button>
            <FaGoogle /> Continue with Google
          </button>
          <button>
            <FaApple /> Continue with Apple
          </button>
        </div>
        
        
        <p className='form-footer'>Don't have an account? <NavLink to="/register" className="link-text">Sign-up</NavLink></p>

      </div>
      
    </div>
  )
}

export default Login;