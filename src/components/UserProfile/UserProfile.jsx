import { onValue, ref, update } from "firebase/database";
import { auth, db, storage } from "../../firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, uploadBytes, ref as sref} from "firebase/storage";
import "./user-profile.css";


function UserProfile() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        onAuthStateChanged(auth, (u)=>{
            if(u){
                setUser(u);

                onValue(ref(db, `users/${u.uid}`),(snapshot)=>{
                    setUserData(snapshot.val());
                });
            }
        })
    }, [])

    {/* Trigger file upload for profile picture */}
    function triggerUpload(){
        document.getElementById('inpProfilePicture').click();
    }
    
    function handleFile(f){
        if (!f) return;
        
        uploadBytes(sref(storage, `/profile/${user.uid}`), f)
        .then(() => {    
            getDownloadURL(sref(storage, `/profile/${user.uid}`)).then((url) => {
                update(ref(db, `/users/${user.uid}`),{profileURL:url}).then(()=>{
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

    return(
        <>
            {user && userData && (
                <div>
                    <div>
                        <div>
                            <img src={userData.profileURL} />
                            <button onClick={triggerUpload} className="upload-btn" title="Upload Profile Picture"><i className="fa fa-camera"/></button>
                            <input onChange={(e)=>handleFile(e.target.files[0])} id="inpProfilePicture" style={{display: "none"}} type="file" accept="image/*"/>
                        </div>
                        <h3>{userData.firstName + " " + userData.lastName}</h3>
                        <p>{userData.contactNumber}</p>
                        <button>Edit Profile</button>
                        
                    </div>
                </div>
            )}
        </>
    )
}

export default UserProfile;