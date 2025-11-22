import { useState } from "react";
import "./cards.css";

function Cards() {
    return (
        <>
            <div className="cards-section">

                <div className="card">
                    <div className="card-icon"></div>
                    <div className="card-header">Total Projects</div>
                    <div className="card-info">3</div>
                    <div className="card-subtitle">from yesterday</div>
                </div>

                <div className="card">
                    <div className="card-icon"></div>
                    <div className="card-header">Total Projects</div>
                    <div className="card-info">3</div>
                    <div className="card-subtitle">from yesterday</div>
                </div>

                <div className="card">
                    <div className="card-icon"></div>
                    <div className="card-header">Total Projects</div>
                    <div className="card-info">3</div>
                    <div className="card-subtitle">from yesterday</div>
                </div>

                <div className="card">
                    <div className="card-icon"></div>
                    <div className="card-header">Total Projects</div>
                    <div className="card-info">3</div>
                    <div className="card-subtitle">from yesterday</div>
                </div>
            </div>
        </>
    );
}

export default Cards;