import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { auth, db, storage } from '../../firebase-config';
import { onValue, ref, update } from 'firebase/database';
import { NavLink } from 'react-router';
import './dashboard.css';
import { getDownloadURL, uploadBytes, ref as sref } from 'firebase/storage';

// Test: Dashboard folder still exists

function Dashboard() {

    {/* Shows when user is logged in */}

    const [user, setUser] = useState();
    const [userData, setUserData] = useState();
    const [todos, setTodos] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(()=>{
        onAuthStateChanged(auth, (u)=>{
            if(u){
                setUser(u);

                {/* Gets the user info from database */}
                onValue(ref(db,`users/${u.uid}`),(snapshot)=>{
                    setUserData( snapshot.val());
                })
                
                {/* Gets the todo info from database */}
                onValue(ref(db,`users/${u.uid}/todos`),(snapshot)=>{
                    const data = snapshot.val();
                    setTodos(data);
                })
            } 
        })
    },[])

    {/* Log users out */}
    function logOut(){
        auth.signOut();
    }

    {/* Trigger file upload for profile picture */}
    function triggerUpload(){
        document.getElementById('inpProfilePicture').click();
    }
    
    function handleFile(f){
        uploadBytes(sref(storage, `/profile/${user.uid}`), f)
        .then(() => {    
            getDownloadURL(sref(storage, `/profile/${user.uid}`)).then((url) => {
                update(ref(db, `/users/${user.uid}`),{profileURL:url}).then(()=>{
                    alert("Profile Picture Updated Successfully!");
                })
            });
        });
    }

    {/* Delete a ToDo List by their ID */}
    function handleDelete(todoId) {
        if (window.confirm('Are you sure you want to delete this task?')) {
            update(ref(db, `users/${user.uid}/todos/${todoId}`), {
                status: 'deleted',
                deletedAt: new Date().toISOString()
            })
            .then(() => {
                alert('Task item deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            });
        }
    }


  return (
    <>
        {user && userData &&
            <>
                {/* Top navigation bar with user info */}
                <header className="dashboard-nav">
                    <div className="nav-left">
                        <h2>Dashboard</h2>
                    </div>
                    <div className="nav-right">
                        <img
                            className="nav-avatar"
                            src={userData.profileURL || `https://avatar.iran.liara.run/username?username=${userData.firstName}+${userData.lastName}&background=1F2937&color=F9FAFB`}
                            alt={`${userData.firstName} ${userData.lastName}`}
                        />
                        <div className="nav-user">
                            <div className="nav-user-name">{userData.firstName} {userData.lastName}</div>
                            <div className="nav-user-email">{user.email}</div>
                        </div>
                        <NavLink to="/edit-profile" className="nav-link"><button className="nav-btn">Edit</button></NavLink>
                        <button onClick={logOut} className="nav-btn nav-logout">Sign Out</button>
                    </div>
                </header>

                {/* Main profile card shown below the nav */}
                <div className="profile-card"> 
                    <div className="profile-details">
                        <h1>User Profile</h1>

                        <img src={userData.profileURL || `https://avatar.iran.liara.run/username?username=${userData.firstName}+${userData.lastName}&background=000000&color=FFFFFF`} 
                        alt={`${userData.firstName} ${userData.lastName}`}/>
                        <button onClick={triggerUpload}><i className="fa fa-upload"/></button>
                        <input onChange={(e)=>handleFile(e.target.files[0])} id="inpProfilePicture" style={{display: "none"}} type="file"/>
                        
                        <h1>{userData.firstName} {userData.lastName}</h1>
                        <h3>{userData.contactNumber}</h3>
                        <h4>{user.email}</h4>
                        <NavLink to="/edit-profile"><button>Edit</button></NavLink>
                        <button onClick={logOut}>Sign Out</button>
                    </div>
                </div>

                {/* Display the To-Do List */}
                <div className='to-do-container'>

                    <div className='to-do-table'>

                        <div className='to-do-header'>
                            <h1>Your To-Do List</h1>
                            <NavLink to='/add-todo'><button><i className="fa fa-plus"/></button></NavLink>
                        </div>

                        <div className='to-do-card'>
                            {/* Filter by Status */}
                            <select onChange={(e)=>setStatusFilter(e.target.value)}>
                                <option value="all">All</option>
                                <option value="complete">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="ongoing">Ongoing</option>
                            </select>

                            {/* Display the To-Do List */}
                            {todos ? Object.keys(todos)
                            .filter(key => todos[key].status !== 'deleted') // Filter out deleted todos
                            .filter(key => statusFilter === 'all' || todos[key].status === statusFilter)
                            .map((key) => (
                                <div key={key} className='to-do-item'>
                                    <div className='to-do-item-header'>
                                        <h3>{todos[key].title}</h3>
                                        <div className='action-buttons'>
                                            <NavLink to={`/edit-todo/${key}`}><button><i className="fa fa-edit"/></button></NavLink>
                                            <NavLink onClick={()=>handleDelete(key)}><button><i className="fa fa-trash"/></button></NavLink>
                                        </div>
                                    </div>
                                    <p>Status: <span className={`status-${todos[key].status}`}> {todos[key].status.charAt(0).toUpperCase() + todos[key].status.slice(1)}</span></p>
                                    <p>Due: {todos[key].due ? todos[key].due : 'No due date'}</p>
                                </div>
                            )) : <p>No tasks found. Add a new task!</p>}

                        </div>

                    </div>

                </div>
            </>
        }
    </>
  )
}

export default Dashboard;