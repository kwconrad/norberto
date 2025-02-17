import { Note } from "@/components";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-auto flex items-center justify-center">
      <main className="flex flex-col">
        <Note id={0} body={"hello **world**"} isActiveNote={true}></Note>
      </main>
    </div>
  );
}
