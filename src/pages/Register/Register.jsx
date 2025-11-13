import { useState } from 'react';
import "../../components/styles/auth-forms.css";
import { NavLink } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import registerHero from "../../assets/images/register-hero.jpg";
import { FaGoogle, FaApple } from 'react-icons/fa';

function Register() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
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
        setEmailError("Invalid email address");
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
          setPasswordError("Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character");
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
      setConfirmError("Input required");
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
          <h1 className='title-bold'>SIGN-UP</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem</p>
        </div>

        <div className='forms'>
          <div className='input-container'>
            <label htmlFor="email" className="input-label">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              onInput={(e)=>checkEmail(e)}
              className={emailError ? 'input-error':''}
            />
            {emailError && <p className='txtError'>{emailError}</p>}
          </div>

          <div className='input-container'>
            <label htmlFor="password" className="input-label">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password"
              onChange={(e)=>checkPassword(e)} 
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && <p className='txtError'>{passwordError}</p>}
          </div>

          <div className='input-container'>
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="Confirm your password"
              onChange={(e)=>checkConfirmPassword(e)} 
              className={confirmError ? 'input-error' : ''}
            />
            {confirmError && <p className='txtError'>{confirmError}</p>}
          </div>

          <div className='form-options'>
            <label className='remember-option'>
              <input 
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                
              <span>I agree with the <NavLink to='#' className="link-text">Terms and Conditions</NavLink></span>
            </label>
          </div>

          <button className='auth-btn' onClick={handleRegister} 
          disabled={!isEmailValid || !isPasswordValid ||!isConfirmValid || !agreeTerms}>
            Continue
          </button>
          
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

          <p className='form-footer'>Already have an account? <NavLink to='./login' className="link-text">Login</NavLink></p>
      </div>

    </div>
  )
}

export default Register;
