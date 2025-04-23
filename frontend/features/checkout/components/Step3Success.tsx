"use client";

import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const MAX_SIZE_MB = 30;

const requirementSchema = z.object({
  answer: z.string().min(1, "Answer is required.").max(1000, "Too long."),
  file: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.name.toLowerCase().endsWith(".zip");
      },
      {
        message: "Only .zip files are allowed.",
      },
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= MAX_SIZE_MB * 1024 * 1024;
      },
      {
        message: `File must be smaller than ${MAX_SIZE_MB}MB.`,
      },
    ),
});

export default function Step3Success() {
  const searchParams = useSearchParams();

  const [showConfetti, setShowConfetti] = useState(true);
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const orderId = searchParams.get("orderId");

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        router.push("/dashboard/buyer/orders");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [submitted, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected ?? null);
    setErrorMsg(null); // reset lỗi nếu có
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = requirementSchema.safeParse({ answer, file });

    if (!result.success) {
      const issue = result.error.errors[0];
      setErrorMsg(issue.message);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const answerformData = new FormData();
    answerformData.append("requirement", answer);

    if (result.data.file) {
      const newFileName = `order___${orderId}___${result.data.file.name.replaceAll(" ", "_")}`;
      const newFile = new File([result.data.file], newFileName, {
        type: result.data.file.type,
      });

      const formData = new FormData();
      formData.append("file", newFile);

      const { data, status } = await axiosInstanceV1.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (status === 201) {
        console.log("File uploaded successfully", data);
        answerformData.append("file", JSON.stringify(data));
      }
    }

    try {
      answerformData.append("orderId", orderId!);
      answerformData.append(
        "question",
        "Do you have an idea of what you want?",
      );
      answerformData.append("answer", answer);
      debugger;
      const { data, status } = await axiosInstanceV1.post(
        "/orders/questions-answers",
        answerformData,
      );

      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {showConfetti && <Confetti />}
      <h2 className="mb-2 text-center text-2xl font-bold text-green-600">
        🎉 Order Success!
      </h2>
      <p className="text-center text-gray-600">
        Thank you for your purchase. We'll be in touch soon.
      </p>

      {!submitted && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-2xl bg-white p-4 shadow-md"
        >
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Do you have an idea of what you want?
            </label>
            <textarea
              className="w-full rounded-xl border p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={5}
              placeholder="Describe your idea here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-lg font-semibold">
              Attach .zip file (optional, max {MAX_SIZE_MB}MB):
            </label>

            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>{file.name}</strong> (
                {(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            {errorMsg && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
      )}

      {submitted && (
        <div className="mt-6 text-center font-medium text-green-600">
          ✅ Submitted! Redirecting in {countdown} second
          {countdown >= 1 && "s"}...
        </div>
      )}
    </div>
  );
}
