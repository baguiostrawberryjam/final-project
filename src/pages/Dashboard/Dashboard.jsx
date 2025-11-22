import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { auth, db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { NavLink } from 'react-router';
import './dashboard.css';
import Notes from './Notes/Notes';
import Tasks from './ToDos/Tasks';
import Header from '../../components/Header/Header'
import Cards from './Cards/Cards'
import Projects from './Projects/project/Project';


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

                    {/* Main Dashboard Content */}
                    <div className="dashboard-content">
                        
                        {/* Row 1: Dashboard Header (Full Width) */}
                        <div className="header-wrapper">
                            <Header header = {userData?.firstName || user?.displayName || "User"}/>
                        </div>
                        
                        {/* Row 1: Dashboard Header (Full Width) */}
                        <div className="cards-wrapper">
                            <Cards/>
                        </div>
                        
                        {/* Row 2: Projects (Full Width) */}
                        <div className="projects-wrapper">
                            <Projects/>
                        </div>

                        {/* Row 2: Tasks & Notes (2 Columns) */}
                        <div className="bottom-row">

                            <div className='tasks-wrapper'>
                                <Tasks/>
                            </div>

                            <div className='notes-wrapper'>
                                <Notes/>
                            </div>
                            
                        </div>

                    </div>
                </>
            }
        </>
    )
}

export default Dashboard;