import { onValue, ref, update } from "firebase/database";
import { auth, db, storage } from "../../firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, uploadBytes, ref as sref } from "firebase/storage";
import "./user-profile.css";
import { NavLink } from "react-router";
import { Camera, Edit2, Hourglass, Loader2, CheckCircle2 } from "lucide-react";


function UserProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', contactNumber: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        onValue(ref(db, `users/${u.uid}`), (snapshot) => {
          setUserData(snapshot.val());
          setForm({
            firstName: snapshot.val()?.firstName || '',
            lastName: snapshot.val()?.lastName || '',
            contactNumber: snapshot.val()?.contactNumber || ''
          });
        });
      }
    });
  }, []);

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

  function handleEdit() {
    setEditMode(true);
  }

  function handleCancel() {
    setEditMode(false);
    setForm({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      contactNumber: userData?.contactNumber || ''
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    setSaving(true);
    update(ref(db, `/users/${user.uid}`), {
      firstName: form.firstName,
      lastName: form.lastName,
      contactNumber: form.contactNumber
    })
      .then(() => {
        setEditMode(false);
        setSaving(false);
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        setSaving(false);
        alert("Error updating profile: " + error.message);
      });
  }

  return (
    <>
      {user && userData && (
        <div className="profile-page-wrapper">
          <div className="profile-header-section">
            <div>
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">Manage your account information</p>
            </div>
          </div>

          <div className="profile-grid">
            {/* Profile Card */}
            <div className="profile-card">
              <img
                src={
                  userData.profileURL ||
                  `https://avatar.iran.liara.run/username?username=${userData.firstName}+${userData.lastName}&background=1F2937&color=F9FAFB`
                }
                alt="Profile"
                className="profile-image"
              />
              <h2 className="profile-name">{userData.firstName} {userData.lastName}</h2>
              <span className="profile-email">{user.email}</span>
              <button onClick={triggerUpload} className="btn-primary upload-photo-btn">
                <Camera size={16} style={{marginRight: 6}} /> Upload Photo
              </button>
              <input onChange={(e) => handleFile(e.target.files[0])} id="inpProfilePicture" style={{ display: "none" }} type="file" accept="image/*"/>
            </div>

            {/* Quick Stats */}
            <div className="profile-stats-card">
              <h3 className="stats-title">Quick Stats</h3>
              <div className="stats-grid">
                <div className="stats-item">
                  <Hourglass size={28} style={{color: '#a3a3a3', marginBottom: 8}} />
                  <span className="stats-label">Projects Not Started</span>
                  <span className="stats-value">1</span>
                </div>
                <div className="stats-item">
                  <Loader2 size={28} style={{color: '#6366f1', marginBottom: 8}} />
                  <span className="stats-label">Projects In Progress</span>
                  <span className="stats-value">1</span>
                </div>
                <div className="stats-item">
                  <CheckCircle2 size={28} style={{color: '#10b981', marginBottom: 8}} />
                  <span className="stats-label">Projects Completed</span>
                  <span className="stats-value">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="profile-info-card">
            <h3 className="info-title">Personal Information</h3>
            <div className="info-form-grid">
              <div className="info-form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>
              <div className="info-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>
              <div className="info-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={user.email || ""} disabled />
              </div>
              <div className="info-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="contactNumber"
                  value={form.contactNumber}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>
            </div>
            {!editMode ? (
              <div className="profile-edit-btn-group">
                <button className="btn-primary profile-edit-btn" onClick={handleEdit}>
                  <Edit2 size={16} style={{marginRight: 6}} /> Edit Info
                </button>
              </div>
            ) : (
              <div className="profile-edit-btn-group">
                <button className="btn-primary profile-edit-btn" onClick={handleSave} disabled={saving}>
                  Save
                </button>
                <button className="btn-secondary profile-edit-btn" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
