# Performance Adjustments

Changes applied:

1. Added `netlify.toml` to bypass failing build plugins for static deploys.
2. Implemented route-level code splitting with `React.lazy` + `Suspense` in `App.jsx`.
3. Enhanced Vite chunk strategy in `vite.config.js` to split large vendor libs (react, router, framer-motion, gsap, others).
4. Raised `chunkSizeWarningLimit` to 900 kB (still watch bundle sizes, aim to optimize images next).

Next optimization ideas:

- Compress and resize large JPG images in `src/assets` (some are multi-MB). Use 1600px max width and WebP/AVIF.
- Add route-based prefetching only for most visited dashboard pages.
- Enable `sourcemap: true` only for staging builds.
- Consider dynamic import for animation-heavy sections if not above the fold.
- Implement a service worker (e.g. Workbox) for caching static assets if PWA desired.

Rollback: Revert lazy imports by replacing `lazy(() => import(...))` with direct imports if any runtime issues appear.
