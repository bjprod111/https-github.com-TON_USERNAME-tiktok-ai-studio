# ClipFlow AI

ClipFlow AI is a privacy-first short-form content planning workspace. Give it a topic, audience, goal, and tone and it creates an editable content brief with a hook, outline, caption, and call to action.

## What it is today

The current MVP runs entirely in the browser and uses a deterministic template engine. **It does not currently call an AI model.** No account, API key, backend, or social-platform connection is required.

## Run locally

Open `index.html` in a modern browser.

To run the automated tests:

```powershell
npm test
```

## Product roadmap

The project is structured to grow from a free privacy-first planner into a creator toolkit:

- **Free:** local content briefs, copy, and `.txt` export.
- **Creator:** secure AI generation, saved history, content calendars, richer exports.
- **Pro:** multiple brands, batch generation, analytics, and team workflows.
- **Integrations:** official platform APIs only, with appropriate consent, privacy, branding, and approval requirements.

AI provider credentials must stay server-side when real model integrations are added; they must never be embedded in browser JavaScript.

## Security

Generated user text is rendered with DOM APIs rather than injected as HTML. Browser storage is used only for local brief history. Do not treat localStorage as a secure store for secrets or sensitive data.

## Licensing and attribution

Apache-2.0 applies to this repository. Historical upstream attribution records are retained in `legal/`. ClipFlow AI is an independent project and does not imply affiliation with upstream projects or social platforms.

## Support

If ClipFlow helps your work, you can support development through the links below:

- [GitHub Sponsors](https://github.com/sponsors/bjprod111)
- [Buy Me a Coffee](https://buymeacoffee.com/bjprod111)
- [PayPal](https://paypal.me/bjprod)

## Contributing

Issues and pull requests are welcome. Keep the product privacy-first, avoid platform-policy shortcuts, and use official APIs for future integrations.
