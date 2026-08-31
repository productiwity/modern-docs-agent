# Visual evidence

Use this guidance when a document contains charts, metrics, dashboards, diagrams, or interactive figures. The goal is to make evidence easier to understand, not to make the page look more technical.

## Choose the form from the question

Decide what the reader needs to learn before choosing a chart.

- Use a large value or short table when the exact number matters more than a pattern.
- Use bars for category comparison, lines for change over time, and a scatter plot for relationships between two numeric variables.
- Use stacked bars only when both the total and its composition matter.
- Use a table when readers must compare many precise values.
- Use small multiples when many series would make one chart hard to read.
- Avoid dual axes. They make unrelated scales look connected.

Keep the number of visible series small. If every category needs a different color or a long legend, the form is probably too dense.

## Use color as data

- Keep a category's color stable across charts and interactions.
- Use one light-to-dark hue for low-to-high values.
- Use a diverging scale only when the midpoint has meaning, such as zero or a target.
- Keep status colors separate from category colors.
- Check text and essential mark contrast with a trusted contrast tool when one is available.
- Never rely on color alone. Add a label, pattern, position, or shape.

Do not recolor categories after filtering. A stable visual mapping helps readers compare views.

## Build complete charts

A chart should include the parts readers need to interpret it:

- A title that states the question or conclusion.
- Units on axes or near the value.
- Labels for important values and thresholds.
- A legend for two or more series, unless direct labels are clearer.
- A short source or method note when provenance affects trust.
- A text or table equivalent for important data.

Put axes and legends inside the chart container. Wrap only the chart when narrow screens need horizontal scrolling. Never make the whole document scroll sideways.

## Make interaction optional

Modern Docs JavaScript is local and sandboxed. It cannot fetch remote data, use persistent browser storage, import packages, or call the parent application.

- Keep the complete meaning visible before JavaScript runs.
- Use interaction to filter, reveal detail, switch tabs, or compare states already present in the source.
- Make the same details available to keyboard users.
- Use tooltips as an extra view, not the only place where a value exists.
- Insert untrusted labels with `textContent`, not `innerHTML`.
- Keep controls close to the figure they change and show the active state clearly.
- Expect interactive state to reset when the document reloads or rebuilds.

If an interaction fails, the reader should still see the title, explanation, and core evidence.

## Use diagrams for mechanisms

Add a diagram only when relationships, sequence, ownership, or flow are harder to explain in prose.

- Give each figure one main claim.
- Label nodes with concrete nouns and connectors with verbs.
- Keep the reading direction consistent.
- Group related nodes and use whitespace before adding boxes or color.
- Add a caption that explains what to notice.
- Add useful alt text or a nearby text description.

Modern Docs does not allow inline SVG in document HTML. Create the diagram as an SVG file, upload it with `document_asset`, and place the returned `asset:<asset-id>` reference in an `img` inside a semantic `figure`.

## Final evidence review

Before saving, confirm:

1. The visual answers a real question more clearly than prose or a small table.
2. Values, units, categories, source, and uncertainty are not hidden.
3. Colors keep the same meaning throughout the document.
4. The figure works at mobile width without document-level horizontal scroll.
5. Keyboard and non-color cues preserve the meaning.
6. Static content remains useful if JavaScript does not run.
