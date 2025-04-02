import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import { Link, useNavigate } from 'react-router-dom';
import Image1 from './Leonardo_Phoenix_Clean_White_edit.jpg';
import Image2 from './Noteify_darker_brown_logo.jpg';
//hello

const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        } else {
            navigate("/login");
        }
    }, []);

    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "", efile: null });
    const fileInputRef = useRef(null);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag, efile: currentNote.file });
    };

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag, note.efile);
        refClose.current.click();
        props.showAlert("Updated Successfully", "success");
    };

    const onChange = (e) => {
        if (e.target.name === 'file') {
            setNote({ ...note, file: e.target.files[0] });
        } else {
            setNote({ ...note, [e.target.name]: e.target.value });
        }
    };

    return (
        <>
            <div style={{ display: "flex", height: "60vh", gap: "20px", padding: "20px", alignItems: "center" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <img src={Image2} style={{ width: "100%", maxWidth: "450px", borderRadius: "10px" }} alt="Noteify Logo" />
                    <h4 style={{ marginTop: "15px", fontWeight: "bold", fontSize: "1.5rem" }}>Simplify Your Notes, Amplify Your Productivity</h4>
                    <hr />
                    <p style={{ fontSize: "1.2rem", color: "#333" }}>
                        An online web platform where you can create, edit, upload, and delete your notes securely.
                        For more info, check out our <Link to="/about" style={{ color: "#5e3f2d", fontWeight: "bold" }}>About Page</Link>.
                    </p>
                    <Link to="/addnote">
                        <button className='btn-btn' style={{ width: "180px", height: "40px", color: "white", backgroundColor: "rgb(94, 63, 45)", borderRadius: "20px", fontSize: "1.2rem", marginTop: "10px" }}>Create New Note</button>
                    </Link>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <img src={Image1} style={{ width: "100%", maxWidth: "650px", height: "auto", borderRadius: "10px" }} alt="Phoenix" />
                </div>
            </div>
            
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Notes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="file" className="form-label">File</label>
                                    <input type="file" className="form-control" id="file" name="file" ref={fileInputRef} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h1 style={{ fontWeight: "bold", textAlign: "left", fontSize: "2rem", fontFamily: "Courier New, monospace" }}>Your Notes:</h1>
                <div className="container text-center">
                    {notes.length === 0 && <p style={{ fontSize: "1.2rem" }}>No notes to display</p>}
                </div>
                {notes.map((note) => (
                    <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                ))}
            </div>
        </>
    );
};

export default Notes;
