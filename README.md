# Norberto (note-taking app)

A simple note-taking app for jotting down ideas, thoughts, and @mentioning people you've collaborated with along the way.

Features include:

- `@mentions` - mention your friends in your notes, collaboriate, do all that fun stuff.
- `auto-saving` (it kinda works)
- `markdown support` -- format your notes with markdown formatting (\*\*, \_\_, etc.) in the note-taking workspace (the modal) and when you save your note, markdown is applied to your note in the note list

Built with:

- `TailwindCSS` (styling)
- `marked` (markdown)
- `Next.js` with App Router
- `SWR` fetching and frontend caching

### Getting started

---

Get up and going with npm by running `npm install` then `npm run dev`

Navigate to the root path on whatever port you are using (ie https://localhost:3000/)

This will auto-generate a new note-taking session using a uuid (http://localhost:3000/session/d8d03faf-cf26-4b72-ac64-7d0e932b1b41)

Now, to return to your session, just re-use that same url.

### Next steps:

If I had more time, I would:

- Improve the auto-save UX
- Organize my CRUD operations better for notes
- Improve redirects and middleware logic
