import React, { useEffect, useState } from "react";
import "./notes.css";
import { onValue, ref, remove } from "firebase/database";
import { auth, db } from "../../../firebase-config";
import { useNavigate } from "react-router";

function NotesPreview() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      onValue(ref(db, `users/${user.uid}/notes`), (snapshot) => {
        setNotes(snapshot.val());
      });
    }
  }, []);

  function handleDelete(noteId) {
    if (window.confirm("Are you sure you want to delete this note?")) {
      remove(ref(db, `users/${auth.currentUser.uid}/notes/${noteId}`))
        .then(() => {
          alert("Note deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
          alert("Failed to delete note. Please try again.");
        });
    }
  }

  const previewNotes = notes
    ? Object.keys(notes).slice(0, 5) // Show only 5 notes in preview
    : [];

  return (
    <div className="notes-preview">
      <div className="preview-header">
        <h2>Notes List</h2>
        <button onClick={() => navigate("/notes")} className="view-all-btn">
          View All Notes
        </button>
      </div>
      <div className="notes-grid">
        {previewNotes.length > 0 ? (
          previewNotes.map((noteKey) => (
            <div key={noteKey} className="note-card">
              <div className="card-header">
                <h3>{notes[noteKey].title}</h3>
                <div className="card-actions">
                  <button
                    onClick={() => handleDelete(noteKey)}
                    className="delete-btn"
                    title="Delete note"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
              <p className="note-description">{notes[noteKey].description}</p>
              <p className="note-date">Created: {notes[noteKey].dateCreated}</p>
            </div>
          ))
        ) : (
          <p className="empty-state">No notes yet.</p>
        )}
      </div>
    </div>
  );
}

export default NotesPreview;
