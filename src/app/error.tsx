"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container section empty-state">
      <h1>Unable to load this page.</h1>
      <p>Please try again in a moment.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
      <a href="/">Return home</a>
    </main>
  );
}
