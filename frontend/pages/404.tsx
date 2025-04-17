export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-gray-950">
      <h1 className="text-6xl font-bold text-green-900 dark:text-white">404</h1>
      <p className="mt-2 text-xl text-green-600 dark:text-gray-300">
        Oops! Page not found.
      </p>
      <p className="mt-1 max-w-md text-green-500 dark:text-gray-400">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 rounded-xl bg-green-500 px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        Go back to homepage
      </a>
    </div>
  );
}
