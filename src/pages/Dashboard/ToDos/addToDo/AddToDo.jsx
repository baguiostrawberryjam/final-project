import { useState } from 'react';
import { ref, push } from 'firebase/database';
import './add-to-do.css';
import { NavLink } from 'react-router';
import { auth, db } from '../../../../firebase-config';

function AddToDo() {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('pending');
    const [due, setDue] = useState('');

    function checkTitle(e){
        let title = e.target.value
        let eTitle = document.querySelector('#eTitle');
        eTitle.innerHTML = ""
        
        // update the state first
        setTitle(title);

        if(title.trim().length <= 0){
            eTitle.innerHTML = "Blankspaces are not allowed"
        }
    }

    function handleSubmit() {
        {/* Add New To-Do Items */}
        const user = auth.currentUser;
        
        if (!user) {
            alert('You must be logged in to add a task');
            return;
        }

        {/* Add to-do's information in the FRD */}
        push(ref(db, `users/${user.uid}/todos`), {
            title: title.trim(),
            status: status,
            due: due || null,
            createdAt: Date.now(),
            deletedAt: ''
        })
        .then(() => {
            {/* Alerting a Success Message & Remove past inputs */}
            alert('Task added successfully!');
            setTitle('');
            setStatus('pending');
            setDue('');
        })
        .catch((error) => {
            console.log('Error adding task: ' + error.message);
        });
    }

    return (
        <div className="add-todo-container">
            {/* User Interface where we collect Task Information */}
            <h2>Add New Task</h2>
            <label htmlFor="title">Task Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => checkTitle(e)} placeholder="Enter task title" />
                <p className='txtError' id='eTitle'></p>
            <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="complete">Complete</option>
                </select>
                <br /><br />
            <label>Due Date:</label>
                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
                <br /><br />
            <button type="submit" onClick={handleSubmit}>Add Task</button>
            <NavLink to="/dashboard"><button className="return-btn">Return to Dashboard</button></NavLink>
        </div>
    );
}

export default AddToDo;