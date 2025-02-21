"use client";
import { marked } from "marked";
import { useRef, useState } from "react";
import { BaseNoteType } from "@/types/Note";
import { useDebounce } from "@/hooks";
import clsx from "clsx";

interface NoteProps extends BaseNoteType {
  isNewNote?: boolean;
  isEditing: boolean;
  onSelectNote: () => void;
  onSave: (body: string) => void;
  context: "griditem" | "modal";
}

const NOTE_TEXT_CLASSES = "text-lg text-neutral-800";

export default function Note({
  id,
  body,
  isNewNote = false,
  isEditing,
  onSelectNote,
  onSave,
  context = "griditem",
}: NoteProps) {
  const [text, setText] = useState(body);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mentionIndex, setMentionIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    const cursorPosition = e.target.selectionStart;
    const lastAtIndex = value.lastIndexOf("@", cursorPosition - 1);

    if (
      lastAtIndex !== -1 &&
      (cursorPosition === lastAtIndex + 1 || value[lastAtIndex + 1] === " ")
    ) {
      setMentionIndex(lastAtIndex);
      setShowSuggestions(true);
      fetchUserSuggestions();
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchUserSuggestions = async () => {
    const response = await fetch("https://challenge.surfe.com/users");
    const users = await response.json();
    const userNames = users.map(
      ({ first_name, last_name }: { first_name: string; last_name: string }) =>
        `${first_name} ${last_name}`,
    );
    setSuggestions(userNames);
  };

  const insertUser = (user: string) => {
    if (mentionIndex !== null && textareaRef.current) {
      const beforeMention = text.slice(0, mentionIndex);
      const afterMention = text.slice(mentionIndex + 1);
      const firstName = user.split(" ")[0];
      const newText = `${beforeMention}@${firstName} ${afterMention}`;
      setText(newText);
      setShowSuggestions(false);
      setMentionIndex(null);
      textareaRef.current.focus();
    }
  };

  const createMarkdown = () => {
    const withAtMentions = text.replace(/@(\w+)/g, "`@$1`");

    return { __html: marked(withAtMentions) };
  };

  useDebounce(
    () => {
      if (text !== body && isEditing && !isNewNote) {
        onSave(text);
      }
    },
    3000,
    [text],
  );

  return (
    <div
      onClick={onSelectNote}
      className={clsx("group bg-white", {
        "aspect-square w-full rounded-lg border border-neutral-100 shadow-md":
          context === "griditem",
        "h-full w-full rounded-2xl p-4": context === "modal",
      })}
    >
      <div className="flex min-h-full w-full flex-col p-4 text-neutral-800">
        <div className="flex h-12 w-full items-center justify-between">
          <span className="font-instrument-serif text-2xl">
            {id === -1 ? "New Note" : `Note ${id + 1}`}
          </span>
          {!isEditing && (
            <button className="flex h-8 w-8 -translate-y-4 scale-90 transform items-center justify-center rounded-full bg-neutral-100 opacity-0 shadow-sm transition-all duration-200 ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 text-neutral-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="h-full w-full flex-grow rounded-md">
          {isEditing ? (
            <>
              <textarea
                ref={textareaRef}
                id={`note-${id}`}
                name={`note-${id}`}
                value={text}
                onChange={changeText}
                placeholder="Start typing here..."
                className={`h-auto min-h-full w-full resize-none placeholder:text-neutral-800 focus:outline-none ${NOTE_TEXT_CLASSES}`}
              ></textarea>
              {showSuggestions && (
                <div className="z-10 mt-2 flex max-h-36 w-60 flex-col items-start overflow-x-hidden overflow-y-scroll border border-neutral-200 bg-white shadow-md">
                  {suggestions.map((user) => (
                    <button
                      key={user}
                      role="button"
                      type="button"
                      className="flex w-full cursor-pointer justify-start p-2 hover:bg-neutral-100"
                      onClick={() => insertUser(user)}
                    >
                      <span>{user}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              className={NOTE_TEXT_CLASSES}
              dangerouslySetInnerHTML={createMarkdown()}
            ></div>
          )}
        </div>
        <div className="flex items-center justify-end bg-white/90">
          {isEditing && text.length > 0 && (
            <button
              onClick={() => onSave(text)}
              className="flex items-center justify-center rounded-full bg-neutral-100 px-2 py-0.5 shadow-sm hover:bg-neutral-200 hover:text-neutral-900"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
