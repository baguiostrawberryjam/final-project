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
      contactNumber: contactNumber
    };

    {/* Pushing data in to the database */}
    set(ref(db, `/users/${user.uid}`), userData)
    .then(()=>{
      alert('Data Saved Successfully');
      window.location.href='/dashboard';
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  return (
    <div className='setup-container'>

      <div className='setup-card'>

        <h1>Setup Page</h1>
        <input onChange={(e)=>setFirstName(e.target.value)} type="text" placeholder='First Name'/>
        <input onChange={(e)=>setLastName(e.target.value)} type="text" placeholder='Last Name'/>
        <input onChange={(e)=>setContactNumber(e.target.value)} type="text" placeholder='Contact Number'/>
        <button onClick={saveData}>Setup</button>
        <p>Not your account? <NavLink onClick={logOut}>Sign Out</NavLink></p>

      </div>

    </div>
  )
}

export default Setup
