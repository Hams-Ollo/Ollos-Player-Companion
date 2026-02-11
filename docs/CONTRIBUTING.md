# 🤝 Contributing to The Player's Companion

We welcome contributions from the community! Whether you're a developer, a designer, or a D&D enthusiast with a great idea, here is how you can help.

## Development Setup

1.  **Fork the Repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Set up Environment**:
    Create a `.env` file with the required keys:
    ```env
    GEMINI_API_KEY=your_google_ai_key
    VITE_FIREBASE_API_KEY=your_firebase_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
5.  **Upload Reference PDFs** *(optional)*:
    Place D&D 5e PDFs in `reference-docs/` and run `npm run upload-pdfs`. This adds `VITE_GEMINI_FILE_URI_*` vars to `.env`.
6.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

## Code Guidelines

*   **TypeScript**: Define interfaces for new data structures in `types.ts`. The project uses `skipLibCheck: true` but aims for type safety in app code.
*   **Tailwind CSS**: Use utility classes for styling (loaded via CDN). Avoid custom CSS files.
*   **Components**:
    *   `components/details/` — Card Stack detail views (Vitals, Combat, Skills, etc.).
    *   `components/` root — Shared modals and UI elements.
*   **AI Integration**: All text-based AI calls should go through `lib/gemini.ts` (`generateWithContext` / `createChatWithContext`). Do not create new `GoogleGenAI` instances in components. Image generation is the exception since caching is not supported for image models.
*   **Rate Limiting**: Always call `checkRateLimit()` from `utils.ts` before any API call. Do not bypass or weaken the rate limiter.
*   **Accessibility**: All icon-only buttons must have an `aria-label`. Form inputs without visible labels need `aria-label` attributes.
*   **Security**: Never commit `.env` or `reference-docs/`. Both are gitignored.
*   **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `feat:`, `fix:`, `docs:`).

## Project Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the tech stack, component map, AI caching system, and data model.

## Roadmap & Ideas 💡

*   **Spellbook Stack**: A dedicated UI card for managing known/prepared spells with slot tracking.
*   **Export/Import**: Export character JSON to file and import for backup/sharing.
*   **Firestore Sync**: Move character data from localStorage to Firestore for cross-device access.
*   **Error Boundaries**: Add React error boundaries around AI-powered components.
*   **Tailwind Build Pipeline**: Migrate from CDN to proper PostCSS/Tailwind build.
*   **Backend Proxy**: Move API key server-side to eliminate client-side key exposure.
*   **More Class Logic**: Expand `utils.ts` derived stat calculations for Monks, Barbarians, and spellcasters.

## Submitting a Pull Request

1.  Create a new branch: `git checkout -b feature/my-new-feature`.
2.  Commit your changes using Conventional Commits format.
3.  Push to your fork.
4.  Open a Pull Request describing your changes and linking any relevant issues.

Thank you for helping us build the ultimate character sheet! 🎲
