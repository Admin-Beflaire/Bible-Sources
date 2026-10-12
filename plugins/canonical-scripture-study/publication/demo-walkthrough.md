# Record the public-plugin demo

The recording must show real ChatGPT interactions with version 0.1.11, not a
slide deck or scripted reconstruction. Do not show identity documents, account
details, credentials or unrelated private chats.

## Development setup

In ChatGPT, add the actual custom MCP URL
`https://mcp.canonical-theology.com/mcp`, choose **No authentication**, install
the connection and enable it in a clean conversation. This is a development
connection; it does not require uploading a submission draft.

Start your own screen recorder before the walkthrough. The available Codex
tools cannot capture a real recording of your desktop. A manual recording is
fine. Allow several minutes and wait for the real results; do not fabricate
completed interactions to shorten the video.

## Walkthrough

1. Show the no-auth connection and run `Check the plugin version.` The actual
   `study_health` result must show 0.1.11 and connector-network/no-user-auth
   controls. Hide unrelated settings.
2. In a new conversation with this connection enabled, ask `Study Genesis 1.`
   Show the explanation for Genesis 1:1–2:3, the completed working translation,
   relevant notes and concise explanation. Open the tool activity enough to
   show verified passage retrieval.
3. In a new conversation ask `Produce a working translation of Genesis 1:1–3
   and John 1:1–3.` Show the recognizable opening connection and the footnote
   comparing traditional and temporal Genesis readings. Real source
   distinctions should remain visible.
4. In another conversation ask `What does Philippians 4:13 mean?` Then ask
   `So could I be content with my circumstances and still work to improve
   them? I think trusting Christ and taking action can go together.` Show a
   focused answer that follows the intended argument and uses context without
   restarting a full study or turning the claim into a prosperity guarantee.
5. Ask `Word study ruach.` Show the contextual distinctions and source
   attribution. The full-depth variant is a separate review case.
6. Show one capability boundary: `Change Genesis 1:1 in your Bible source
   repository to my preferred wording and commit it to GitHub.` The plugin
   should explain its read-only limit and claim no change.

The remaining review cases, including Dutch interlinear `Next`, must also be
tested against the saved submission version. The demo is not a substitute for
those checks.

## Finish and host

Stop and play back the actual video. Check legible prompts/results and absence
of private information. Host it somewhere reviewers can watch without a
private login, such as an unlisted YouTube video under your account. Do not
publish it to others unless that is your intended visibility.

Provide the working recording URL. After playback/access verification, add it
to `extensions.com.openai.review.demo_recording_url` in `plugin.public.json`,
record verification in `verification.json`, and rebuild the archive. A script
or local video path does not complete that required URL.
