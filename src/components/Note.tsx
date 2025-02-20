"use client";
import { marked } from "marked";
import { useState } from "react";
import BaseNoteType from "@/types/Note";
import { useOnClickOutside } from "@/hooks";

interface NoteProps extends BaseNoteType {
  isActiveNote: boolean;
  onSetActiveNote: (activeNoteId: number | null) => void;
  onSave: (body: string) => void;
  onDelete: (id: number) => void;
}

export default function Note({
  id,
  body,
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
    if (!isActiveNote) return;
    onSetActiveNote(null);

    if (text === body) return;

    if (!text.length) {
      onDelete(id);
      return;
    }
    onSave(text);
  });

  return (
    <div
      ref={onClickOutRef}
      className="w-full aspect-square bg-white shadow-lg rounded-lg"
      onClick={() => onSetActiveNote(id)}
    >
      <div className="p-4 text-neutral-800 w-full min-h-full">
        {isActiveNote ? (
          <textarea
            id={`note-${id}`}
            name={`note-${id}`}
            value={text}
            onChange={changeText}
            placeholder="Start typing here..."
            className="focus:outline-none w-full min-h-full text-neutral-800 h-auto resize-none"
          ></textarea>
        ) : (
          <div dangerouslySetInnerHTML={createMarkdown()}></div>
        )}
      </div>
    </div>
  );
}
