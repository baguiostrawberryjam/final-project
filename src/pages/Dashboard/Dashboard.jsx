import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { auth, db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { NavLink } from 'react-router';
import './dashboard.css';
import Notes from './Notes/Notes';
import Tasks from './ToDos/Tasks';

function Dashboard() {
    const [user, setUser] = useState();
    const [userData, setUserData] = useState();
    const [projects, setProjects] = useState(null);
    const today = new Date().toISOString().split("T")[0];

    useEffect(()=>{
        onAuthStateChanged(auth, (u)=>{
            if(u){
                setUser(u);

                {/* Gets the user info from database */}
                onValue(ref(db,`users/${u.uid}`),(snapshot)=>{
                    setUserData(snapshot.val());
                })

                {/* Gets the projects info from database */}
                onValue(ref(db,`users/${u.uid}/projects`),(snapshot)=>{
                    setProjects(snapshot.val());
                })
            } 
        })
    },[])

    {/* Log users out */}
    function logOut(){
        auth.signOut();
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
                            <NavLink to="/profile" className="nav-user-info">
                                <div className="nav-profile-wrapper">
                                    <img className="nav-avatar" src={userData.profileURL || `https://avatar.iran.liara.run/username?username=${userData.firstName}+${userData.lastName}&background=1F2937&color=F9FAFB`} alt={`${userData.firstName} ${userData.lastName}`}/>
                                </div>
                                <div className="nav-user">
                                    <div className="nav-user-name">{userData.firstName} {userData.lastName}</div>
                                    {/*<div className="nav-user-email">{user.email}</div>*/}
                                </div>
                            </NavLink>
                            {/* <NavLink to="/edit-profile" className="nav-link"> <button className="nav-btn">Edit Profile</button></NavLink> */}
                            <button onClick={logOut} className="nav-btn nav-logout">Sign Out</button>
                        </div>
                    </header>

                    {/* Main Dashboard Content */}
                    <div className="dashboard-content">
                        
                        {/* Projects Section */}
                        <div className='project-section'>
                            <div className='project-container'>
                                <div className='project-header'>
                                    <h2>Projects</h2>
                                    <NavLink to={`/view-project`}>
                                        <button className="view-all-btn">View All Projects</button>
                                    </NavLink>
                                </div>

                                <div className='project-grid'>
                                    {projects ? Object.keys(projects)
                                    .filter(key => projects[key].status !== 'completed')
                                    .map((key) => (
                                        <div key={key} className='project-card'>
                                            <div className="project-card-header">
                                                <i
                                                    className="fa fa-folder"
                                                    style={{ color: projects[key].folderColor || '#3b82f6', fontSize: '2rem' }}
                                                />
                                                <h3>{projects[key].title} {projects[key].targetDate < today && (<span className="overdue-text">(Overdue)</span>)}</h3>
                                            </div>
                                            <p className="project-description">{projects[key].description}</p>
                                            <p className="project-date">Created: {projects[key].createdAt}</p>
                                        </div>
                                    )) : <p className="empty-state">No projects found. Add a new project!</p>}
                                </div>
                            </div>
                        </div>

                        {/* Display the To-Do List */}
                        <Tasks />

                        {/* Display the Notes Section */}
                        <Notes />
                    </div>
                </>
            }
        </>
    )
}

export default Dashboard;