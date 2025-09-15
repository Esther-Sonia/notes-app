import { NextResponse } from "next/server";

type Note = {
  id: number;
  text: string;
};

let notes: Note[] = []; // in-memory store

// GET all notes
export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  const newNote: Note = { id: Date.now(), text };
  notes.push(newNote);
  return NextResponse.json(newNote, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  notes = notes.filter((note) => note.id !== Number(id));
  return NextResponse.json({ message: "Note deleted" });
}
