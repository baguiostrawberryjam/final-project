import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import "./header.css";

function Header({ header }) {
    const navigate = useNavigate();

    const handleAddProject = () => {
        navigate("/add-project");
    };

    return (
        <>
            <div className="header-section">
                <span>Hello, {header}</span>
                <button className="add-project-btn" onClick={handleAddProject}>
                    <Plus size={20} />
                    Add Project
                </button>
            </div>
        </>
    );
}

export default Header;