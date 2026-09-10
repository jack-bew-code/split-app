import pkg from "../package.json";

// Prefer the actual package.json version as the source of truth. An optional
// `NEXT_PUBLIC_APP_VERSION` may be set by the deploy pipeline, but it should
// only override when package.json is not available.
export const APP_VERSION = pkg.version ?? process.env.NEXT_PUBLIC_APP_VERSION;
