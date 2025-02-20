"use client";
import useSWR from "swr";
import { useState } from "react";

import { Note } from "@/components";
import { BaseNoteType, EnrichedNoteType } from "@/types/Note";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const NOTES_URL =
    "https://challenge.surfe.com/63a50722-ef85-4ab8-8672-60e3bae2c9a1/notes";

  const {
    data: notes,
    error,
    mutate,
  } = useSWR<BaseNoteType[]>(NOTES_URL, fetcher);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [tempNote, setTempNote] = useState<EnrichedNoteType>({
    id: -1,
    body: "",
    isActiveNote: true,
  });

  if (error) return <div>Failed to load notes</div>;
  if (!notes) return <div>Loading...</div>;

  const saveNote = async (id: number, body: string) => {
    const note = notes.find((note) => note.id === id);
    if (note && note.body === body) {
      console.log("Note content is the same, skipping save.");
      return;
    }

    const response = await fetch(`${NOTES_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, body }),
    });

    if (response.ok) {
      console.log("Note saved successfully");
      mutate(); // Re-fetch the notes
    } else {
      console.error("Failed to save note");
    }
  };

  const deleteNote = async (id: number) => {
    const response = await fetch(`${NOTES_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Note deleted successfully");
      mutate(); // Re-fetch the notes
    } else {
      console.error("Failed to delete note");
    }
  };

  const createNote = async (body: string) => {
    const response = await fetch(NOTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });

    if (response.ok) {
      const note = await response.json();
      console.log("Note created successfully");
      mutate(); // Re-fetch the notes
      setActiveNoteId(note.id);
    } else {
      console.error("Failed to create note");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <div className="flex h-16 w-full flex-shrink-0 items-center bg-transparent px-4 backdrop-blur-md">
        <span className="font-instrument-serif text-4xl text-neutral-700">
          Notable <span className="-ml-1 font-geist-sans font-normal">™</span>
        </span>
      </div>
      <main className="h-full w-full overflow-x-hidden overflow-y-scroll">
        <section className="grid grid-cols-3 gap-4 p-4">
          <Note
            key={tempNote.id}
            id={tempNote.id}
            body={tempNote.body}
            isActiveNote={tempNote.isActiveNote}
            onSetActiveNote={(noteId) => setActiveNoteId(noteId)}
            onSave={(body) => createNote(body)}
            onDelete={() =>
              setTempNote({ id: -1, body: "", isActiveNote: true })
            }
          />
          {notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              body={note.body}
              isActiveNote={note.id === activeNoteId}
              onSetActiveNote={(noteId) => setActiveNoteId(noteId)}
              onSave={(body) => saveNote(note.id, body)}
              onDelete={(id) => deleteNote(id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
