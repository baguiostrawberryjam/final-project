import { useEffect, useState } from "react";
import { FolderOpen, PlayCircle, CheckCircle, Circle } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../../firebase-config";
import "./cards.css";

function Cards() {
    const [projects, setProjects] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        inProgress: 0,
        completed: 0,
        notStarted: 0,
    });

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                onValue(ref(db, `users/${user.uid}/projects`), (snapshot) => {
                    const projectsData = snapshot.val();
                    setProjects(projectsData);

                    if (projectsData) {
                        const projectEntries = Object.values(projectsData);
                        const total = projectEntries.length;
                        const inProgress = projectEntries.filter(
                            (p) => p.status === "ongoing"
                        ).length;
                        const completed = projectEntries.filter(
                            (p) => p.status === "completed"
                        ).length;
                        const notStarted = projectEntries.filter(
                            (p) => p.status === "pending" || !p.status
                        ).length;

                        setStats({
                            total,
                            inProgress,
                            completed,
                            notStarted,
                        });
                    } else {
                        setStats({
                            total: 0,
                            inProgress: 0,
                            completed: 0,
                            notStarted: 0,
                        });
                    }
                });
            }
        });
    }, []);

    return (
        <>
            <div className="cards-section">
                <div className="cards-container">
                    <div className="card">
                        <div className="card-icon">
                            <FolderOpen size={24} color="var(--primary)" />
                        </div>
                        <div className="card-header">Total Projects</div>
                        <div className="card-info">{stats.total}</div>
                        <div className="card-subtitle">All projects</div>
                    </div>

                    <div className="card">
                        <div className="card-icon">
                            <PlayCircle size={24} color="var(--primary)" />
                        </div>
                        <div className="card-header">In Progress</div>
                        <div className="card-info">{stats.inProgress}</div>
                        <div className="card-subtitle">Active projects</div>
                    </div>

                    <div className="card">
                        <div className="card-icon">
                            <CheckCircle size={24} color="var(--primary)" />
                        </div>
                        <div className="card-header">Completed</div>
                        <div className="card-info">{stats.completed}</div>
                        <div className="card-subtitle">Finished projects</div>
                    </div>

                    <div className="card">
                        <div className="card-icon">
                            <Circle size={24} color="var(--primary)" />
                        </div>
                        <div className="card-header">Not Started</div>
                        <div className="card-info">{stats.notStarted}</div>
                        <div className="card-subtitle">Pending projects</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cards;