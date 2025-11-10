import { useEffect, useState } from 'react'
import './setup.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { NavLink } from 'react-router';
import { ref, set } from 'firebase/database';

function Setup() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [user, setUser] = useState(null);
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

  function checkFirstName(e){
        let fName = e.target.value
        let eFName = document.querySelector('#eFirstName');
        eFName.innerHTML = ""

        if(fName.trim().length <= 0){
            eFName.innerHTML = "Blankspaces are not allowed"
            setIsFirstNameValid(false);
        } else if(fName.trim().length <= 3){
            eFName.innerHTML = "Atleast 3 Characters"
            setIsFirstNameValid(false);
        } else {
            setFirstName(fName);
            setIsFirstNameValid(true);
        }
    }

    function checkLastName(e){
        let lName = e.target.value
        let eLName = document.querySelector('#eLastName');
        eLName.innerHTML = ""

        if(lName.trim().length <= 0){
            eLName.innerHTML = "Blankspaces are not allowed";
            setIsLastNameValid(false);
        } else if(lName.trim().length <= 3){
            eLName.innerHTML = "Atleast 3 Characters";
            setIsLastNameValid(false);
        } else {
            setLastName(lName);
            setIsLastNameValid(true);
        }
    }

    function checkContact(e){
        let contact = e.target.value
        let eCont = document.querySelector('#eContact');
        eCont.innerHTML = ""

        if(contact.trim().length <= 0){
            eCont.innerHTML = "Input Required"
            setIsContactValid(false);
        } else if(!contact.startsWith("09")){
            eCont.innerHTML = "Must Start with 09"
            setIsContactValid(false);
        } else if(contact.trim().length !== 11){
            eCont.innerHTML = "11 Digits only"
        }  else {
            setContactNumber(contact)
            setIsContactValid(true);
        }
    }

  {/* Get the Logged In User*/}
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=> {
      setUser(user);
    })
  }, [])

  {/* Logged out the current user */}
  function logOut() {
    auth.signOut();
  }
  
  {/* Save New User Data */}
  function saveData() {
    let userData = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      todos: null,
      profileURL: null
    };

    {/* Pushing data in to the database */}
    set(ref(db, `/users/${user.uid}`), userData)
    .then(()=>{
      alert('Data Saved Successfully');
      window.location.href='/final-project/dashboard';
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  return (
    <div className='setup-container'>
      <div className='setup-card'>

        <h1>Setup Page</h1>
        <input onChange={(e)=>checkFirstName(e)} type="text" placeholder='First Name'/>
        <p className='txtError' id='eFirstName'></p>

        <input onChange={(e)=>checkLastName(e)} type="text" placeholder='Last Name'/>
        <p className='txtError' id='eLastName'></p>

        <input onChange={(e)=>checkContact(e)} type="text" placeholder='Contact Number'/>
        <p className='txtError' id='eContact'></p>

        <button onClick={saveData} disabled={!isFirstNameValid || !isLastNameValid || !isContactValid}>Setup</button>
        <p>Not your account? <NavLink onClick={logOut}>Sign Out</NavLink></p>

      </div>
    </div>
  )
}

export default Setup
