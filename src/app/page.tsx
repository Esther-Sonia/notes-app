"use client";
import { useState, useEffect } from "react";

type Note = {
  id: number;
  text: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null); // Track note being edited here
  const [editText, setEditText] = useState("");

  // Fetch notes
  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // Add note
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setText("");
  };

  // Delete note
  const deleteNote = async (id: number) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Start editing
  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  // Save edited note
  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;

    const res = await fetch(`/api/notes?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });
    const updatedNote = await res.json();

    setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
    setEditingId(null);
    setEditText("");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          ✨ Notes App
        </h1>

        {/* Add Note Form */}
        <form onSubmit={addNote} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </form>

        {/* Notes List */}
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              {editingId === note.id ? (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => saveEdit(note.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-800">{note.text}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {notes.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No notes yet...</p>
        )}
      </div>
    </main>
  );
}
