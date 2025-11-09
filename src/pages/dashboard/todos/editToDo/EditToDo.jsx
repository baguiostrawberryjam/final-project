import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import './edit-to-do.css';
import { NavLink, useParams } from 'react-router';
import { auth, db } from '../../../../firebase-config';

function EditToDo() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('pending');
  const [due, setDue] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const user = auth.currentUser;

    get(ref(db, `users/${user.uid}/todos/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
            const todo = snapshot.val();
            setTitle(todo.title || '');
            setStatus(todo.status || 'pending');
            setDue(todo.due || '');
        }
      })
      .catch((error) => {
        console.log('Error retrieving task: ' + error.message);
      });
  }, [id]);

  function updateToDo() {
    if (!title.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    const user = auth.currentUser;

    update(ref(db, `users/${user.uid}/todos/${id}`), {
        title: title.trim(),
        status: status,
        due: due || null,
    })
    .then(() => {
        alert('Task updated successfully!');
        window.location.href = '/dashboard';
    })
    .catch((error) => {
        console.log('Error updating task: ' + error.message);
    });
  }

  return (
    <div className="add-todo-container">
        <h2>Edit Task</h2>

        <label htmlFor="title">Task Title:</label>
            <input type="text"  id="title" value={title} onChange={(e) => setTitle(e.target.value)}  placeholder="Enter task title" />
        <br /><br />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
        </select>
        <br /><br />

        <label>Due Date:</label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <br /><br />

        <button onClick={updateToDo}>Update Task</button>
        <NavLink to="/dashboard"><button className="return-btn">Return to Dashboard</button></NavLink>
    </div>
  );
}

export default EditToDo;
