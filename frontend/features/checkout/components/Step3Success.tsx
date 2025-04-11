import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Step3Success() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [requirement, setRequirement] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const router = useRouter();

  useEffect(() => {
    // Tắt confetti sau vài giây để tránh gây khó chịu
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        router.push("/order/manage");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [submitted, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gửi dữ liệu nếu cần
    console.log("Requirement:", requirement);
    console.log("Files:", files);
    setSubmitted(true);
  };

  return (
    <div className="p-4 text-center">
      {showConfetti && <Confetti />}
      <h2 className="mb-2 text-2xl font-bold text-green-600">
        🎉 Order Success!
      </h2>
      <p className="text-gray-600">
        Thank you for your purchase. We'll be in touch soon.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-6 rounded-2xl bg-white p-4 shadow-md"
      >
        <div>
          <label className="mb-2 block text-lg font-semibold">
            Do you have an idea of what you want? or should I surprise you?
          </label>
          <textarea
            className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={5}
            placeholder="Describe your idea here..."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-lg font-semibold">
            You can attach the files you want me to do.
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="w-full rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Requirements
        </button>
      </form>

      {submitted && (
        <p className="mt-4 text-center font-medium text-green-600">
          Submitted! Redirecting in {countdown} second{countdown !== 1 && "s"}
          ...
        </p>
      )}
    </div>
  );
}
