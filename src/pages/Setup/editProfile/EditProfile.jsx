import { useEffect, useState } from 'react';
import './edit-profile.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebase-config';
import { NavLink } from 'react-router';
import { get, ref, update } from 'firebase/database';

function EditProfile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

  // New: Error message states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);

      // Fetch User Info
      if (user) {
        get(ref(db, `/users/${user.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setUserData(data);
              // Initialize input values
              setFirstName(data.firstName || '');
              setLastName(data.lastName || '');
              setContactNumber(data.contactNumber || '');
              // Assume valid if data exists
              setIsFirstNameValid(true);
              setIsLastNameValid(true);
              setIsContactValid(true);
            }
          })
          .catch((err) => console.error(err));
      }
    });
  }, []);

  // Update Existing User Data
  function updateData() {
    const updatedUserData = {
      firstName,
      lastName,
      contactNumber
    };

    update(ref(db, `/users/${user.uid}`), updatedUserData)
      .then(() => {
        alert('Data Updated Successfully');
        window.location.href = '/final-project/dashboard';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // VALIDATION FUNCTIONS
  function checkFirstName(e) {
    const fName = e.target.value;
    setFirstName(fName);

    if (fName.trim().length === 0) {
      setFirstNameError("Blankspaces are not allowed");
      setIsFirstNameValid(false);
    } else if (fName.trim().length <= 3) {
      setFirstNameError("At least 3 characters");
      setIsFirstNameValid(false);
    } else {
      setFirstNameError("");
      setIsFirstNameValid(true);
    }
  }

  function checkLastName(e) {
    const lName = e.target.value;
    setLastName(lName);

    if (lName.trim().length === 0) {
      setLastNameError("Blankspaces are not allowed");
      setIsLastNameValid(false);
    } else if (lName.trim().length <= 3) {
      setLastNameError("At least 3 characters");
      setIsLastNameValid(false);
    } else {
      setLastNameError("");
      setIsLastNameValid(true);
    }
  }

  function checkContact(e) {
    const contact = e.target.value;
    setContactNumber(contact);

    if (contact.trim().length === 0) {
      setContactError("Input required");
      setIsContactValid(false);
    } else if (!contact.startsWith("09")) {
      setContactError("Must start with 09");
      setIsContactValid(false);
    } else if (contact.trim().length !== 11) {
      setContactError("Must be 11 digits only");
      setIsContactValid(false);
    } else {
      setContactError("");
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

            <input value={firstName} onChange={checkFirstName} type="text" placeholder='First Name' />
            <p className='txtError'>{firstNameError}</p>

            <input value={lastName} onChange={checkLastName} type="text" placeholder='Last Name' />
            <p className='txtError'>{lastNameError}</p>

            <input value={contactNumber}  onChange={checkContact} type="text" placeholder='Contact Number' />
            <p className='txtError'>{contactError}</p>

            <button onClick={updateData} disabled={!isFirstNameValid || !isLastNameValid || !isContactValid} >Confirm Edit</button>

            <NavLink to="/final-project/dashboard"><button>Return</button></NavLink>

          </div>

        </div>
      }
    </>
  );
}

export default EditProfile;
