"use client";
import { marked } from "marked";
import { useState } from "react";
import BaseNoteType from "@/types/Note";
import { useOnClickOutside } from "@/hooks";

interface NoteProps extends BaseNoteType {
  isNewNote?: boolean;
  isActiveNote: boolean;
  onSetActiveNote: (activeNoteId: number | null) => void;
  onSave: (body: string) => void;
  onDelete: (id: number) => void;
}

export default function Note({
  id,
  body,
  isNewNote = false,
  isActiveNote,
  onSetActiveNote,
  onSave,
  onDelete,
}: NoteProps) {
  const [text, setText] = useState(body);
  const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const createMarkdown = () => {
    return { __html: marked(text) };
  };

  const onClickOutRef = useOnClickOutside(() => {
    if (!isActiveNote && !isNewNote) return;
    onSetActiveNote(null);

    if (text === body) return;

    if (!text.length) {
      onDelete(id);
      return;
    }
    onSave(text);
  });

  const textClasses = "text-lg text-neutral-800";

  return (
    <div
      role="button"
      ref={onClickOutRef}
      className="aspect-square w-full rounded-lg border border-neutral-100 bg-white shadow-md"
      onClick={() => onSetActiveNote(id)}
    >
      <div className="min-h-full w-full p-4 text-neutral-800">
        <div className="flex h-12 w-full items-center">
          <span className="font-instrument-serif text-2xl">
            {id === -1 ? "New Note" : `Note ${id}`}
          </span>
        </div>
        {isActiveNote ? (
          <textarea
            id={`note-${id}`}
            name={`note-${id}`}
            value={text}
            onChange={changeText}
            placeholder="Start typing here..."
            className={`h-auto min-h-full w-full resize-none placeholder:text-neutral-800 focus:outline-none ${textClasses}`}
          ></textarea>
        ) : (
          <div
            className={textClasses}
            dangerouslySetInnerHTML={createMarkdown()}
          ></div>
        )}
      </div>
    </div>
  );
}
