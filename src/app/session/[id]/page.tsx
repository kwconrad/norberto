"use client";
import useSWR from "swr";
import { useEffect, useState, use, useMemo } from "react";
import { Note } from "@/components";
import { BaseNoteType } from "@/types/Note";
import Modal from "@/components/Modal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const NOTES_URL = `${process.env.NEXT_PUBLIC_API_URL}/${id}/notes`;

  const {
    data: notes,
    error,
    mutate,
  } = useSWR<BaseNoteType[]>(NOTES_URL, fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const initialTempNote = useMemo(() => ({ id: -1, body: "" }), []);
  const [activeNote, setActiveNote] = useState<BaseNoteType>(initialTempNote);

  const startEditing = (note: BaseNoteType) => {
    setActiveNote(note);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (activeNote.id === -1) {
      setActiveNote(initialTempNote);
    }
  }, [initialTempNote, activeNote.id]);

  const renderLogo = () => (
    <span className="font-instrument-serif text-4xl text-neutral-900">
      Norberto <span className="-ml-1 font-geist-sans font-normal">™</span>
    </span>
  );

  if (error)
    return (
      <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          {renderLogo()}
          <span className="font-instrument-serif text-2xl text-neutral-500">
            Failed to load notes...let&apos;s try that again
          </span>
        </div>
      </div>
    );
  if (!notes)
    return (
      <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          {renderLogo()}
          <span className="animate-pulse font-instrument-serif text-4xl text-neutral-500">
            Loading...
          </span>
        </div>
      </div>
    );

  const saveNote = async (id: number, body: string) => {
    const note = notes.find((note) => note.id === id);
    if (note && note.body === body) {
      console.log("Note content is the same, skipping save.");
      setActiveNote(initialTempNote);
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
      mutate();
      setActiveNote(initialTempNote);
      setIsModalOpen(false);
    } else {
      console.error("Failed to save note");
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
      console.log("Note created successfully");
      mutate();
      setActiveNote(initialTempNote);
      setIsModalOpen(false);
    } else {
      console.error("Failed to create note");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <div className="fixed flex h-16 w-full flex-shrink-0 items-center bg-neutral-300/10 px-4 backdrop-blur-sm">
        {renderLogo()}
      </div>
      <main className="h-full w-full overflow-x-hidden overflow-y-scroll pt-16">
        <section className="grid grid-cols-3 gap-4 p-4">
          <Note
            key={initialTempNote.id}
            id={initialTempNote.id}
            body={initialTempNote.body}
            isNewNote
            isEditing={activeNote.id === initialTempNote.id}
            onSelectNote={() => startEditing(initialTempNote)}
            onSave={(body) => createNote(body)}
            context="griditem"
          />
          {notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              body={note.body}
              isEditing={note.id === activeNote.id}
              onSelectNote={() => startEditing(note)}
              onSave={(body) => saveNote(note.id, body)}
              context="griditem"
            />
          ))}
        </section>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Note
          key={activeNote.id}
          id={activeNote.id}
          body={activeNote.body}
          isEditing={true}
          onSelectNote={() => console.info("Note selected")}
          onSave={(body) =>
            activeNote.id === -1
              ? createNote(body)
              : saveNote(activeNote.id, body)
          }
          context="modal"
        />
      </Modal>
    </div>
  );
}
