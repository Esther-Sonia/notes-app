import { NextResponse } from "next/server";

type Note = {
  id: number;
  text: string;
};

let notes: Note[] = []; 

// GET all notes
export async function GET() {
  return NextResponse.json(notes);
}

// POST new note
export async function POST(req: Request) {
  const { text } = await req.json();
  const newNote: Note = { id: Date.now(), text };
  notes.push(newNote);
  return NextResponse.json(newNote, { status: 201 });
}

// (edit note)
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { text } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
  }

  const noteIndex = notes.findIndex((note) => note.id === Number(id));
  if (noteIndex === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  notes[noteIndex].text = text;
  return NextResponse.json(notes[noteIndex]);
}

// DELETE a note
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
  }

  notes = notes.filter((note) => note.id !== Number(id));
  return NextResponse.json({ message: "Note deleted" });
}
