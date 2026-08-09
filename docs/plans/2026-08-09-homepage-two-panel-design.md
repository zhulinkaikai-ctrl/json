# Homepage Two-Panel Design

## Goal

Make the JSONFmt homepage feel like a formatter first: users paste source JSON on the left, choose a command, and receive a read-only result on the right.

## Confirmed Decisions

- The homepage has two equally important panels: `JSON Input` and `Output`.
- The left input remains unchanged after `Format`, `Validate`, and `Minify`.
- The right panel is read-only.
- Results appear only after the user clicks an action; there is no automatic formatting preview while typing.
- `Format` and `Minify` write their result to the right panel.
- An invalid action clears the previous result and replaces it with the current error diagnostic.
- If the left input changes after an action, the right panel remains visible but shows a stale-result notice until the user reruns the relevant action.
- `Copy Output` and `Use output as input` are available only when the right panel contains formatted or minified JSON.
- Visual style should be pure white and clean, with teal-green as the primary accent color.
- Avoid black or near-black page backgrounds; use light gray borders and subtle shadows instead.

## Layout

The first viewport contains a compact headline, a single command bar, and a two-column workspace.

- Command bar: `Format JSON`, `Validate`, `Minify`, `Upload`, and `Clear`.
- Input panel: editable Monaco editor with upload and drag-and-drop support.
- Output panel: read-only code result or diagnostic state.
- Output header: result status, `Copy Output`, and `Use output as input`.

The existing privacy band, tool links, guides, FAQ, and footer remain below the workspace.

## Output States

| State | Right panel content |
| --- | --- |
| Empty | Short prompt to paste JSON and run an action. |
| Formatted or minified | Read-only JSON text with a result label. |
| Validation success | Valid JSON summary with root type and item count. |
| Invalid action | Error location, explanation, suggestion, and nearby context. |
| Stale result | Existing result plus a notice that input changed and the action should be rerun. |
