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
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

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

  function checkFirstName(e){
        let fName = e.target.value
        let eFName = document.querySelector('#eFirstName');
        eFName.innerHTML = ""

        setFirstName(fName);

        if(fName.trim().length <= 0){
            eFName.innerHTML = "Blankspaces are not allowed"
            setIsFirstNameValid(false);
        } else if(fName.trim().length <= 3){
            eFName.innerHTML = "Atleast 3 Characters"
            setIsFirstNameValid(false);
        } else {
            setIsFirstNameValid(true);
        }
    }

    function checkLastName(e){
        let lName = e.target.value
        let eLName = document.querySelector('#eLastName');
        eLName.innerHTML = ""

        setLastName(lName);

        if(lName.trim().length <= 0){
            eLName.innerHTML = "Blankspaces are not allowed";
            setIsLastNameValid(false);
        } else if(lName.trim().length <= 3){
            eLName.innerHTML = "Atleast 3 Characters";
            setIsLastNameValid(false);
        } else {
            setIsLastNameValid(true);
        }
    }

    function checkContact(e){
        let contact = e.target.value
        let eCont = document.querySelector('#eContact');
        eCont.innerHTML = ""

        setContactNumber(contact)

        if(contact.trim().length <= 0){
            eCont.innerHTML = "Input Required"
            setIsContactValid(false);
        } else if(!contact.startsWith("09")){
            eCont.innerHTML = "Must Start with 09"
            setIsContactValid(false);
        } else if(contact.trim().length !== 11){
            eCont.innerHTML = "11 Digits only"
        }  else {
            setIsContactValid(true);
        }
    }


  return (
    <>
      {/* To make sure that we have both User and their Data */}
      {user && userData &&
      <div className='setup-container'>

        <div className='setup-card'>

          <h1>Edit Information Page</h1>
          <input value={firstName} onChange={(e)=>checkFirstName(e)} type="text" placeholder='First Name'/>
          <p className='txtError' id='eFirstName'></p>

          <input value={lastName} onChange={(e)=>checkLastName(e)} type="text" placeholder='Last Name'/>
          <p className='txtError' id='eLastName'></p>

          <input value={contactNumber} onChange={(e)=>checkContact(e)} type="text" placeholder='Contact Number'/>
          <p className='txtError' id='eContact'></p>

          <button onClick={updateData} disabled={!isFirstNameValid || !isLastNameValid || !isContactValid}>Confirm Edit</button>
          <NavLink to="/final-project/dashboard"><button>Return</button></NavLink>
          
        </div>

      </div>
      }
    </>
  )
}

export default EditProfile;