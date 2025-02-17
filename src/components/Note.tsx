"use client";
import { useState } from "react";

type NoteProps = {
  id: number;
  body: string;
};

export default function Note({ id, body }: NoteProps) {
  const [text, setText] = useState(body);
  const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="w-80 aspect-square bg-white shadow-lg rounded-lg">
      <div className="p-4 text-neutral-800 w-full min-h-full">
        <textarea
          id={`note-${id}`}
          name={`note-${id}`}
          value={text}
          onChange={changeText}
          className="focus:outline-none w-full min-h-full text-neutral-800 h-auto resize-none"
        ></textarea>
      </div>
    </div>
  );
}
