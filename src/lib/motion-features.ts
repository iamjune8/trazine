/**
 * A standalone module boundary for LazyMotion's async `features` loading.
 * This has to live in its own file, not be inlined where it's used — a
 * dynamic import() of a module that's also imported synchronously
 * elsewhere (e.g. `motion/react` for `m`/`AnimatePresence`) gets deduped
 * into the same chunk as the synchronous import, defeating the point.
 * A dedicated file with nothing else in it becomes its own real chunk.
 */
export { domAnimation as default } from "framer-motion";
