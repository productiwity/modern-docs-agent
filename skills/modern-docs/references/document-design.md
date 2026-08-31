# Design beautiful documents

Treat document design as communication, not decoration. A strong Modern Docs document feels specific to its subject, makes the reading order obvious, and remains clear on desktop and mobile.

When editing an existing document, preserve its visual system and reading model unless the user asks for a redesign. Make the requested change feel native to the document instead of importing a new style.

## Begin with a short design brief

Before writing source, decide:

- Purpose: the decision, understanding, or action this document should produce.
- Audience: who will read it and what they already know.
- Tone: editorial, technical, warm, formal, playful, or another clear direction.
- Hierarchy: the three to five sections a reader must understand in order.
- Signature: one memorable visual idea tied to the subject, such as a strong title treatment, data strip, pull quote, timeline, or image composition.

Do not use a generic dashboard layout for every topic. Let the subject shape the document.

## Choose the reading mode

- Use a narrative flow for reports, proposals, guides, and other documents meant to be read in order.
- Use an operational layout for dashboards, comparisons, and tools where readers need to scan, filter, or act.
- Combine them only when the reader genuinely needs both. Keep the transition obvious.

## Build a small visual system

Use a restrained system and repeat it consistently:

- Color: choose one primary, one accent, two or three neutrals, and semantic success or warning colors only when needed. Check text contrast. Do not use many unrelated colors.
- Type: use one display role and one reading role. A single family with deliberate weight and size changes is enough. Keep body text comfortable and line length near 55 to 75 characters.
- Spacing: choose a small rhythm such as 8, 12, 20, 32, and 48 pixels. Related items sit close together. New sections receive clear separation.
- Shape: use one corner language and one border language. Avoid turning every paragraph into a rounded card.
- Layout: give the main reading column a clear maximum width. Use grids only when the content has a real comparison or sequence. Lay out related siblings with grid or flex and a consistent `gap` instead of positioning them by hand.

One strong signature element is better than many competing effects. Keep the rest quiet enough to support it.

## Write semantic source

- Use `main`, `header`, `section`, `nav`, `article`, `aside`, `figure`, `blockquote`, lists, tables, and headings for their real meaning.
- Keep one `h1`, then follow heading levels in order.
- Put a stable uppercase ULID in `data-md-id` on every element. Preserve an existing ID when its meaning remains the same.
- Use classes for repeated styles. Keep selectors simple and local to the document.
- Use real, specific copy. Prefer short sentences, active voice, sentence case, and labels that describe the action.
- Use numbers, sequence labels, progress, and status only when the source supports them. Decorative structure must not imply false data.
- Upload real images and fonts through `document_asset`. Never depend on a remote script, stylesheet, font, or image.

## Create hierarchy through contrast

Use size, weight, spacing, alignment, and color in that order. A reader should understand the page from a quick scan:

1. The title states the document's job.
2. The opening gives context or a useful summary, not filler.
3. Section headings describe the conclusion or topic clearly.
4. Supporting detail is easy to skim through short paragraphs, lists, figures, or tables.
5. The final action or conclusion is visually clear.

Avoid eyebrow labels, pills, gradients, decorative icons, and card grids unless they express real structure. Remove one decorative element during the final pass.

## Responsive and accessible behavior

- Start with a single readable mobile column, then add wider layouts with media queries.
- Prevent fixed widths from causing horizontal scrolling.
- Give links and controls visible keyboard focus.
- Use descriptive link text and image alt text.
- Do not communicate meaning through color alone.
- Keep the document useful without motion. Use finite motion only to clarify a state change. The current document CSS grammar does not accept `prefers-reduced-motion`, so do not emit that media query.
- Make tables scroll within their own wrapper on narrow screens.
- Keep horizontal overflow inside the element that needs it. The document body itself must not scroll sideways.

Modern Docs documents use the visual theme defined in their own source. They do not inherit the application theme. Choose a deliberate fixed palette and test its contrast.

## Useful composition patterns

Choose a pattern that matches the content:

- Brief: strong title, concise summary, key facts, recommendation, next steps.
- Narrative report: editorial opening, section rhythm, pull quote, supporting figures, conclusion.
- Technical guide: clear prerequisites, ordered steps, code or data blocks, warnings close to the relevant step.
- Comparison: short framing, consistent comparison dimensions, real table or aligned columns, decision summary.
- Proposal: problem, evidence, approach, scope, risks, timeline, decision request.

Do not mix patterns unless the content requires it.

## Final visual review

Before saving:

1. Read the document at desktop, tablet, and mobile widths.
2. Check the title, first screen, longest heading, longest paragraph, lists, tables, images, and empty states.
3. Confirm there is no clipped text, accidental overflow, low contrast, or tiny body copy.
4. Confirm every section earns its space and the signature element fits the subject.
5. Remove filler copy and one unnecessary decorative choice.
6. Read the saved document again after `document_update` and fix any validation or composition problem.
