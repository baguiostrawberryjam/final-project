import { NavLink } from 'react-router';
import './login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useState } from 'react';
import loginHero from "../../assets/images/login-hero.jpg";

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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
    let eMail = document.querySelector('#eEmail');
    eMail.innerHTML = ""
    
    // Always update the email state
    setEmail(email)

    if(email.trim().length <= 0){
        eMail.innerHTML = "Input Required"
        setIsEmailValid(false);
    } else if(email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
        eMail.innerHTML = "Invalid Email"
        setIsEmailValid(false);
    } else {
        setIsEmailValid(true);
    }
  }

  function checkPassword(e){
      let pass = e.target.value
      let ePass = document.querySelector('#ePassword');
      ePass.innerHTML = ""

      // Always update the password state
      setPassword(pass)

      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\S+$).{8,20}$/

      if(pass.trim().length <= 0){
          ePass.innerHTML = "Input Required"
          setIsPasswordValid(false);
      } else if(!passwordRegex.test(pass)){
          ePass.innerHTML = "Invalid Password"
          setIsPasswordValid(false);
      } else {
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
          <h1 className='title-bold'>Login Page</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem, fuga quisquam molestias dolorem hic cumque ratione eveniet, omnis distinctio repellat nesciu</p>
        </div>

        <div className='login-forms'>
          <input onChange={(e)=>checkEmail(e)} type="email" placeholder='Email'/>
          <input onChange={(e)=>checkPassword(e)} type="password" placeholder='Password'/>
          <button onClick={handleLogin} disabled={!isEmailValid || !isPasswordValid}>Login</button>
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