export function Facebook({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 21v-8h3l.5-4H14V7c0-1 .3-1.5 1.6-1.5H18V2.2c-.7-.1-1.8-.2-3-.2-3 0-5 1.8-5 5v2H7v4h3v8h4Z" />
    </svg>
  );
}
export function Instagram({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
    </svg>
  );
}
export function Linkedin({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 9h4v12H4V9Zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm5 6h4v1.7c.8-1.1 1.9-2 3.6-2C22 8.7 22 11 22 14v7h-4v-6.2c0-1.5-.1-2.8-1.5-2.8S15 13.3 15 14.7V21h-4V9Z" />
    </svg>
  );
}
