const express = require("express");
const upload = require("./upload")
const multer = require("multer");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const path = require("path");
const { body, validationResult } = require("express-validator");
const fs = require("fs");


// ✅ ROUTE 1: Fetch All Notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching notes:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ ROUTE 2: Add a New Note with File Upload
router.post(
    "/addnote",
    fetchuser,
    upload.single("file"),
    [
        body("title", "Title must be at least 3 characters").isLength({ min: 3 }),
        body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        try {
            const { title, description, tag, sendAt, email } = req.body;

            // 🛑 Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            console.log(req.file)
            // ✅ Create and Save Note
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id,
                file: req.file ? req.file.path : null,
                sendAt: sendAt && !isNaN(new Date(sendAt)) ? new Date(sendAt) : null,
                email: sendAt ? email : null,
            });

            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error("❌ Error adding note:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ✅ ROUTE 3: Update an Existing Note
router.put("/updatenote/:id", fetchuser, upload.single("file"), async (req, res) => {
    console.log("🔄 Update request received for Note ID:", req.params.id);

    const { title, description, tag, sendAt, email } = req.body;
    
    try {
        let note = await Note.findById(req.params.id);
        
        if (!note) {
            console.log("❌ Note not found in the database:", req.params.id);
            return res.status(404).send("Note Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            console.log("❌ Unauthorized user:", req.user.id);
            return res.status(401).send("Not Allowed");
        }

        let updatedData = {
            title: title || note.title,
            description: description || note.description,
            tag: tag || note.tag,
            sendAt: sendAt ? new Date(sendAt) : note.sendAt,
            email: email || note.email,
        };

        if (req.file) {
            if (note.file) {
                const oldFilePath = path.join(__dirname, "../..", note.file);
                if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            }
            updatedData.file = `/uploads/${req.file.filename}`;
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });

        console.log("✅ Note updated successfully:", note);
        res.json({ note });
    } catch (error) {
        console.error("❌ Error updating note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ✅ ROUTE 4: Delete a Note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Note Not Found");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // 🗑️ Delete file (if any)
        if (note.file) {
            const filePath = path.join(__dirname, "..", "uploads", path.basename(note.file));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ Success: "Note has been deleted", note });
    } catch (error) {
        console.error("❌ Error deleting note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
