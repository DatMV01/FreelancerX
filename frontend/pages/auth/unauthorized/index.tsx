import React from "react";
import clsx from "clsx";
const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-2 text-lg text-gray-700">
        You do not have permission to access this page.  
      </p>
      <a
        href="/auth/signin"
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Go To Signin Page
      </a>

   
    </div>
  );
};

export default UnauthorizedPage;
