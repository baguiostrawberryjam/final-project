import { useState } from 'react';
import "../../components/styles/auth-forms.css";
import { NavLink } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import registerHero from "../../assets/images/login-hero.jpg";
import { FaGoogle, FaApple } from 'react-icons/fa';

function Register() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  {/* Handle Registration of Information */}
  function handleRegister(){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userInfo)=>{
      alert("Registered Successfully\nEmail: "+userInfo.user.email);
      window.location.href = "/final-project/setup";
    })
    .catch((error)=>{
      console.log(error);
      alert("Error: "+error.message);
    });
  }

  function checkEmail(e){
    let email = e.target.value
    setEmail(email);


    if(email.trim().length <= 0){
        setEmailError("Input required");
        setIsEmailValid(false);
    } else if(email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
        setEmailError("Invalid email");
        setIsEmailValid(false);
    }   else {
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
          setPasswordError("Invalid Password (8-20 chars, upper, lower, number, symbol)");
          setIsPasswordValid(false);
      } else {
          setPasswordError("");
          setIsPasswordValid(true);
      }
  }

  function checkConfirmPassword(e){
    let confirm = e.target.value;

    setConfirmPassword(confirm);

    if (confirm.trim().length <= 0) {
      setConfirmError("Input Required");
      setIsConfirmValid(false);
    } else if (confirm !== password) {
      setConfirmError("Passwords do not match");
      setIsConfirmValid(false);
    } else {
      setConfirmError("");
      setIsConfirmValid(true);
    }
  }

  return (
    <div className='main-container'>

      <div className='left-section'>
        <img src={registerHero} alt="" />
      </div>

      <div className='right-section'>

        <div className='header'>
          <h1 className='title-bold'>SIGNUP</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem</p>
        </div>

        <div className='forms'>

          <div className='input-container'>
            <input onInput={(e)=>checkEmail(e)} type="email" placeholder="Email" className={emailError ? 'input-error':''}/>
            {emailError && <p className='txtError'>{emailError}</p>}
          </div>

          <div className='input-container'> 
            <input onChange={(e)=>checkPassword(e)} type="password" placeholder="Password" className={passwordError ? 'input-error' : ''}/>
            {passwordError && <p className='txtError'>{passwordError}</p>}
          </div>

          <div className='input-container'>
            <input onChange={(e)=>checkConfirmPassword(e)} type="password" placeholder="Confirm Password" className={confirmError ? 'input-error' : ''}/>
            {confirmError && <p className='txtError'>{confirmError}</p>}
          </div>

          <div className='form-options'>
            <label className='remember-option'>
              <input type="checkbox"/>
              <span>I agree with the Terms and Conditions</span>
            </label>
          </div>

          <button className='auth-btn' onClick={handleRegister} 
          disabled={!isEmailValid || !isPasswordValid ||!isConfirmValid}>Continue</button>
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

          <p>Already have an Account? <NavLink to='./login' className="link-text">Login</NavLink></p>
      </div>

    </div>
  )
}

export default Register;
