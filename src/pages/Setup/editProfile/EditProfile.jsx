import { useEffect, useState } from 'react'
import './edit-profile.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebase-config';
import { NavLink } from 'react-router';
import { get, ref, update } from 'firebase/database'; // Changed: import update instead of set

function EditProfile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);

      {/* Fetch User Info */}
      if (user) {
        get(ref(db, `/users/${user.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setUserData(data);
              // Initialize state with fetched data
              setFirstName(data.firstName || '');
              setLastName(data.lastName || '');
              setContactNumber(data.contactNumber || '');
            }
          })
          .catch((err) => console.error(err));
      }
    });

  }, []);
  
  {/* Update Existing User Data */}
  function updateData() {
    let userData = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber
    };

    // Changed: Use update() instead of set() to only update specific fields
    update(ref(db, `/users/${user.uid}`), userData)
    .then(()=>{
      alert('Data Updated Successfully');
      window.location.href='/final-project/dashboard';
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  return (
    <>
      {/* To make sure that we have both User and their Data */}
      {user && userData &&
      <div className='setup-container'>

        <div className='setup-card'>

          <h1>Edit Information Page</h1>
          <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} type="text" placeholder='First Name'/>
          <input value={lastName} onChange={(e)=>setLastName(e.target.value)} type="text" placeholder='Last Name'/>
          <input value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} type="text" placeholder='Contact Number'/>
          <button onClick={updateData}>Setup</button>
          <NavLink to="/dashboard"><button>Return</button></NavLink>
          
        </div>

      </div>
      }
    </>
  )
}

export default EditProfile;