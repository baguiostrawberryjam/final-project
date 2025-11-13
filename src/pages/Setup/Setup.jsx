import { useEffect, useState } from 'react'
import "../../components/styles/auth-forms.css";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { NavLink } from 'react-router';
import { ref, set } from 'firebase/database';
import { storage } from '../../firebase-config';
import { getDownloadURL, uploadBytes, ref as sref } from 'firebase/storage';
import setupHero from "../../assets/images/setup-hero.jpg";

function Setup() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileURL, setProfileURL] = useState(null);

  const [user, setUser] = useState(null);

  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

  const [fNameError, setFNameError] = useState('');
  const [lNameError, setLNameError] = useState('');
  const [contactError, setContactError] = useState('');

  function checkFirstName(e){
        let fName = e.target.value
        setFirstName(fName);

        if(fName.trim().length <= 0){
            setFNameError("Blank spaces are not allowed");
            setIsFirstNameValid(false);
        } else if(fName.trim().length < 3){
            setFNameError("Must contain at least 3 characters")
            setIsFirstNameValid(false);
        } else {
            setFNameError("");
            setIsFirstNameValid(true);
        }
    }

    function checkLastName(e){
        let lName = e.target.value
        setLastName(lName);

        if(lName.trim().length <= 0){
            setLNameError("Blank spaces are not allowed");
            setIsLastNameValid(false);
        } else if(lName.trim().length < 3){
            setLNameError("Must contain at least 3 characters");
            setIsLastNameValid(false);
        } else {
            setLNameError("");
            setIsLastNameValid(true);
        }
    }

    function checkContact(e){
        let contact = e.target.value
        setContactNumber(contact);

        if(contact.trim().length <= 0){
            setContactError("Input required");
            setIsContactValid(false);
        } else if(!contact.startsWith("09")){
            setContactError("Must begin with 09");
            setIsContactValid(false);
        } else if(contact.trim().length !== 11){
            setContactError("Must contain only 11 digits");
            setIsContactValid(false);
        } else if(!/^\d+$/.test(contact)){
            setContactError("Must contain numbers only");
            setIsContactValid(false);
        } else {
            setContactError("");
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

  // Trigger file upload for profile picture
  function triggerUpload(){
    document.getElementById('inpProfilePicture').click();
  }

  // Handle selected file upload
  function handleFile(f){
    if (!f) return;
    
    // Show local preview immediately (for UI only)
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };
    reader.readAsDataURL(f);

    // Upload to Firebase and save the URL
    uploadBytes(sref(storage, `/profile/${user.uid}`), f)
    .then(() => {    
        getDownloadURL(sref(storage, `/profile/${user.uid}`)).then((url) => {
            // Save the Firebase URL (not the preview)
            setProfileURL(url);
            console.log("Profile picture uploaded successfully!");
        });
    })
    .catch((error) => {
      console.log("Upload error:", error);
      alert("Error uploading profile picture");
    });
  }
  
  {/* Save New User Data */}
  function saveData() {

    const getDate = new Date().toISOString().split("T")[0];
    const projectId = "getting-started-" + Date.now(); // unique project ID
    const todoId = "welcome-todo-" + Date.now(); // unique todo ID

    let userData = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      profileURL: profileURL || null,
      projects: {
        [projectId]: {
          title: "Getting started",
          description:
            "This is your first project! You can edit or delete this project and add new projects to manage your tasks effectively.",
          targetDate: getDate,
          folderColor: "#3498db",
          createdAt: getDate,
          status: "pending"
        },
      },
      todos: {
        [todoId]: {
          title: "Welcome to Your To-Do List",
          description:
            "This is your first to-do item! You can edit or delete this item and add new tasks to stay organized.",
          status: "pending",
          due: null,
          createdAt: getDate,
        },
      }

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
    <div className='main-container'>

      <div className='left-section'>
        <img src={setupHero} alt="" />
      </div>
      
      <div className='right-section'>

        <div className='header'>
          <h1 className='title-bold'>SET-UP</h1>
          <p className='subtitle-regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi commodi exercitationem</p>
        </div>

        <div className='profile-picture'>
          <img
              onClick={triggerUpload}
              className="setup-avatar"
              src={profilePreview || user?.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 20 80 Q 20 60 50 60 Q 80 60 80 80' fill='%239CA3AF'/%3E%3C/svg%3E"}
              alt="User Profile Picture"
            />
            <button onClick={triggerUpload} className="upload-btn" title="Upload Profile Picture">
              <i className="fa fa-camera"></i>
            </button>

            <input 
              onChange={(e)=>handleFile(e.target.files[0])} 
              id="inpProfilePicture" 
              style={{display: "none"}} 
              type="file"
              accept="image/*"
            />
        </div>

        <div className='forms'>
        
          <div className='input-container'>
            <label htmlFor='firstName' className='input-label'>First Name</label>
            <input 
              id='firstName'
              onChange={(e)=>checkFirstName(e)} 
              type="text" 
              placeholder='Enter your first name' 
              className={fNameError ? 'input-error' : ''}
            />
            {fNameError && <p className='txtError'>{fNameError}</p>}
          </div>
         
          
          <div className='input-container'>
            <label htmlFor='lastName' className='input-label'>Last Name</label>
            <input 
              id='lastName'
              onChange={(e)=>checkLastName(e)} 
              type="text" 
              placeholder='Enter your last name' 
              className={lNameError ? 'input-error': ''}
            />
            {lNameError && <p className='txtError'>{lNameError}</p>}
          </div>
          

          <div className='input-container'>
            <label htmlFor='contactNumber' className='input-label'>Contact Number</label>
            <input 
              id='contactNumber'
              onChange={(e)=>checkContact(e)} 
              type="text" 
              placeholder='09123456789' 
              className={contactError ? 'input-error' : ''}
            />
            {contactError && <p className='txtError'>{contactError}</p>}
          </div>
          

          <button className='auth-btn' onClick={saveData} disabled={!isFirstNameValid || !isLastNameValid || !isContactValid}>Get started</button>
          <p className='form-footer'>Not your account? <NavLink onClick={logOut} className="link-text">Sign-out</NavLink></p>
        
        </div>
      
      </div>
    
    </div>
  )
}

export default Setup
