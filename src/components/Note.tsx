"use client";
import { marked } from "marked";
import { useState } from "react";

type NoteProps = {
  id: number;
  body: string;
  isActiveNote: boolean;
};

export default function Note({ id, body, isActiveNote }: NoteProps) {
  const [text, setText] = useState(body);
  const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const createMarkdown = () => {
    return { __html: marked(text) };
  };

  return (
    <div className="w-80 aspect-square bg-white shadow-lg rounded-lg">
      <div className="p-4 text-neutral-800 w-full min-h-full">
        {isActiveNote ? (
          <textarea
            id={`note-${id}`}
            name={`note-${id}`}
            value={text}
            onChange={changeText}
            className="focus:outline-none w-full min-h-full text-neutral-800 h-auto resize-none"
          ></textarea>
        ) : (
          <div dangerouslySetInnerHTML={createMarkdown()}></div>
        )}
      </div>
    </div>
  );
}
