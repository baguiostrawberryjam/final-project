import React, { useEffect, useState } from 'react'
import './notes.css'
import { onValue, push, ref, update, remove } from 'firebase/database'
import { auth, db } from '../../../firebase-config'

function Notes() {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    useEffect(()=>{
        const user = auth.currentUser;
        
        onValue(ref(db, `users/${user.uid}/notes`), (snapshot) => {
            setNotes(snapshot.val())
        })

    },[])

    function handleSubmit(){
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        push(ref(db, `users/${auth.currentUser.uid}/notes`), {
            title: title.trim(),
            description: description.trim(),
            dateCreated: today
        })
        .then(() => {
            alert("Note added successfully!");
            setTitle('');
            setDescription('');
            setShowModal(false);
        })
        .catch((error) => {
            console.log("Error adding note: " + error.message);
            alert('Failed to add note. Please try again.');
        });
    }

    function handleEdit(noteKey) {
        const note = notes[noteKey];
        setEditingNoteId(noteKey);
        setTitle(note.title);
        setDescription(note.description || "");
        setShowEditModal(true);
    }

    function handleUpdate() {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        update(ref(db, `users/${auth.currentUser.uid}/notes/${editingNoteId}`), {
            title: title.trim(),
            description: description.trim(),
        })
        .then(() => {
            alert("Note updated successfully!");
            setTitle('');
            setDescription('');
            setEditingNoteId(null);
            setShowEditModal(false);
        })
        .catch((error) => {
            console.log("Error updating note: " + error.message);
            alert('Failed to update note. Please try again.');
        });
    }

    function handleDelete(noteId) {
        if (window.confirm('Are you sure you want to delete this note?')) {
            remove(ref(db, `users/${auth.currentUser.uid}/notes/${noteId}`))
            .then(() => {
                alert('Note deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting note:', error);
                alert('Failed to delete note. Please try again.');
            });
        }
    }

    function handleCancel(){
        setTitle('');
        setDescription('');
        setShowModal(false);
    }

    function handleEditCancel(){
        setTitle('');
        setDescription('');
        setEditingNoteId(null);
        setShowEditModal(false);
    }

    return (
        <div className="notes-page">
        <div className="notes-container">
            <div className="notes-header">
                <h2>Notes List</h2>
                <button onClick={() => setShowModal(true)} className="add-note-btn">
                    <i className='fa fa-plus'></i>Add Note
                </button>
            </div>  
            <div className="notes-grid">
            {notes ? (
                Object.keys(notes).map(noteKey => (
                    <div key={noteKey} className="note-card">
                        <div className="card-header">
                            <h3>{notes[noteKey].title}</h3>
                            <div className="card-actions">
                                <button onClick={() => handleEdit(noteKey)} className="edit-btn" title="Edit note">
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(noteKey)} className="delete-btn" title="Delete note">
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p className="note-description">{notes[noteKey].description}</p>
                        <p className="note-date">Created: {notes[noteKey].dateCreated}</p>
                    </div>
                ))
            ) : (
                <p className="empty-state">No notes yet. Click the + button to add one!</p>
            )}
            </div>
        </div>

        {/* Add Note Modal */}
        {showModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Create New Note</h3>
                    <div className="form-container">
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)} 
                                placeholder="Enter Note Title" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={description}
                                onChange={(e)=>setDescription(e.target.value)} 
                                rows="4" 
                                placeholder="Enter Note Description" 
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                            <button onClick={handleSubmit} className="save-btn">Save Note</button>
                        </div>  
                    </div>
                </div>
            </div>
        )}

        {/* Edit Note Modal */}
        {showEditModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Edit Note</h3>
                    <div className="form-container">
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)} 
                                placeholder="Enter Note Title" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={description}
                                onChange={(e)=>setDescription(e.target.value)} 
                                rows="4" 
                                placeholder="Enter Note Description" 
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleEditCancel} className="cancel-btn">Cancel</button>
                            <button onClick={handleUpdate} className="save-btn">Update Note</button>
                        </div>  
                    </div>
                </div>
            </div>
        )}
        
        </div>
    )
}

export default Notes