import Link from "next/link"

export function V0Badge() {
  return (
    <Link
      href="https://v0.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-full bg-black border border-gray-800 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-gray-900 transition-colors"
    >
      <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L2 19.5H22L12 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Made with v0
    </Link>
  )
}
