import { onValue, ref, update } from "firebase/database";
import { auth, db, storage } from "../../firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, uploadBytes, ref as sref } from "firebase/storage";
import "./user-profile.css";
import { NavLink } from "react-router";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);

        onValue(ref(db, `users/${u.uid}`), (snapshot) => {
          setUserData(snapshot.val());
        });
      }
    });
  }, []);

  {
    /* Trigger file upload for profile picture */
  }
  function triggerUpload() {
    document.getElementById("inpProfilePicture").click();
  }

  function handleFile(f) {
    if (!f) return;

    uploadBytes(sref(storage, `/profile/${user.uid}`), f)
      .then(() => {
        getDownloadURL(sref(storage, `/profile/${user.uid}`)).then((url) => {
          update(ref(db, `/users/${user.uid}`), { profileURL: url })
            .then(() => {
              alert("Profile Picture Updated Successfully!");
            })
            .catch((error) => {
              console.log("Update error:", error);
              alert("Error updating profile picture");
            });
        });
      })
      .catch((error) => {
        console.log("Upload error:", error);
        alert("Error uploading profile picture");
      });
  }

  return (
    <>
      {user && userData && (
        <div className="user-profile-container">
          <div className="profile-header">
            <img
              src={
                userData.profileURL ||
                `https://avatar.iran.liara.run/username?username=${userData.firstName}+${userData.lastName}&background=1F2937&color=F9FAFB`
              }
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="profile-body">
            <div className="profile-info">
              <div className="info-group">
                <span className="info-label">First Name</span>
                <span className="info-value">{userData.firstName}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Last Name</span>
                <span className="info-value">{userData.lastName}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Phone</span>
                <span className="info-value">{userData.contactNumber}</span>
              </div>
            </div>
            <div className="button-group">
              <button onClick={triggerUpload} className="btn-primary"> <i className="fa fa-camera"></i> Upload Photo </button>
              <NavLink to="/dashboard"> <button className="btn-secondary"> <i className="fa fa-chevron-left"></i> Back to Dashboard </button> </NavLink>
            </div>
            <div className="button-group">
                <NavLink to="/edit-profile"> <button className="btn-primary"> <i className="fa fa-edit"></i> Edit Profile </button> </NavLink>
            </div>
            <input onChange={(e) => handleFile(e.target.files[0])} id="inpProfilePicture" style={{ display: "none" }} type="file" accept="image/*"/>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
