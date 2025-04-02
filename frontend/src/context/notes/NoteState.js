import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const [notes, setNotes] = useState([]);

  // ✅ Fetch All Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
    }
  };

  // ✅ Add a Note with Reminder & File Upload
  const addNote = async (title, description, tag, file, sendAt) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      if (file) formData.append("file", file);
      if (sendAt) {
        const parsedDate = new Date(sendAt);
        if (!isNaN(parsedDate.getTime())) {
          formData.append("sendAt", parsedDate.toISOString());
        }
      }

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add note");

      const note = await response.json();
      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error("❌ Error adding note:", error);
    }
  };

  // ✅ Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("❌ Error deleting note:", error);
    }
  };

  // ✅ Edit a Note (Including File & Reminder)
  const editNote = async (id, title, description, tag, sendAt, file) => {
    console.log("Editing Note ID:", id); // ✅ Log the ID before making the request

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tag", tag);

        if (sendAt) {
            const parsedDate = new Date(sendAt);
            if (!isNaN(parsedDate.getTime())) {
                formData.append("sendAt", parsedDate.toISOString());
            }
        }

        if (file) formData.append("file", file);

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: { "auth-token": localStorage.getItem("token") },
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to update note");

        const updatedNote = await response.json();
        setNotes(notes.map((note) => (note._id === id ? updatedNote.note : note)));
    } catch (error) {
        console.error("❌ Error updating note:", error);
    }
};

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
