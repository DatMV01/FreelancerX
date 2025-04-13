import Link from "next/link";
import { ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <ShieldAlert className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">
        You do not have permission to access
      </h1>
      <p className="mb-6 text-gray-600">
        You do not have permission to access this page. Please return to the
        main page or contact the administrator if there is any confusion.
      </p>
      <div className="flex space-x-2">
        <Link
          href="/"
          className="inline-flex w-[200px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back Home
        </Link>

        <Link
          href="/auth/login"
          className="inline-flex w-[200px] items-center justify-end gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
        >
          Go To Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
