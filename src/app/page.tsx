"use client";
import { Note } from "@/components";
import BaseNoteType from "@/types/Note";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [notes, setNotes] = useState<BaseNoteType[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      const data = await fetch(
        "https://challenge.surfe.com/63a50722-ef85-4ab8-8672-60e3bae2c9a1/notes"
      );
      const notes = await data.json();
      setNotes(notes);
    };

    getNotes();
  }, []);

  return (
    <div className="h-screen w-screen overflow-auto flex p-4">
      <main className="grid gap-4 grid-cols-3">
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            body={note.body}
            isActiveNote={note.id === activeNoteId}
            onSetActiveNote={() => setActiveNoteId(note.id)}
          />
        ))}
      </main>
    </div>
  );
}
