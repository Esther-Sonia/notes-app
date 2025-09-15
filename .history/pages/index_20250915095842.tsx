import { useEffect, useState } from 'react';

type Note = {
  id: number;
  text: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');

  // Fetch notes
  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  // Add new note
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });

    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setInput('');
  };

  // Delete note
  const deleteNote = async (id: number) => {
    await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>📝 Notes App</h1>

      <form onSubmit={addNote}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a note..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.text}{' '}
            <button onClick={() => deleteNote(note.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
