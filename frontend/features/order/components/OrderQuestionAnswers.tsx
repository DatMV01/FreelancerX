import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type OrderQA = {
  id: string;
  question: string;
  answer?: string;
  file?: {
    id: string;
    url: string;
    mimeType: string;
  };
};

type Props = {
  items: OrderQA[];
  isBuyer?: boolean;
  onSubmitAnswer?: (id: string, answer: string, file?: File) => void;
  onAddQuestion?: (question: string, file?: File | null) => void;
};

const MAX_SIZE_MB = 30;

const questionSchema = z.object({
  question: z.string().min(1, "Question is required.").max(1000, "Too long."),
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

const answerSchema = z.object({
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

export const OrderQuestionAnswers = ({
  items,
  isBuyer = false,
  onSubmitAnswer,
  onAddQuestion,
}: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerFiles, setAnswerFiles] = useState<Record<string, File | null>>(
    {},
  );
  const [errorAnswerMsg, setErrorAnswerMsg] = useState<
    Record<string, string | null>
  >({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [questionFile, setQuestionFile] = useState<File | null>(null);

  const sorted = [...items].sort(
    (a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnswerFileChange = (id: string, file: File | null) => {
    setAnswerFiles((prev) => ({ ...prev, [id]: file }));
    setErrorAnswerMsg((prev) => ({ ...prev, [id]: null }));
  };

  const handleQuestionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setQuestionFile(selected ?? null);
    setErrorMsg(null);
  };

  const handleSubmitAnswer = async (id: string) => {
    const answer = answers[id]?.trim();
    const file = answerFiles[id];
    if (onSubmitAnswer && answer) {
      const result = answerSchema.safeParse({ answer, file });
      if (!result.success) {
        const issue = result.error.errors[0];
        setErrorAnswerMsg((prev) => ({ ...prev, [id]: issue.message }));
        return;
      }

      try {
        setSubmitting(true);
        setErrorAnswerMsg((prev) => ({ ...prev, [id]: null }));

        onSubmitAnswer(id, answer, file || undefined);

        setSubmitted((prev) => ({ ...prev, [id]: true }));
      } catch (err) {
        console.error("Submit failed", err);
        setErrorAnswerMsg((prev) => ({
          ...prev,
          [id]: "Something went wrong. Please try again.",
        }));
      } finally {
        setSubmitting(false);
        setAnswers((prev) => ({ ...prev, [id]: "" }));
        setAnswerFiles((prev) => ({ ...prev, [id]: null }));
      }
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    // Validate
    const result = questionSchema.safeParse({ question, file: questionFile });

    if (!result.success) {
      const issue = result.error.errors[0];
      setErrorMsg(issue.message);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      onAddQuestion && onAddQuestion(question, questionFile);
    } catch (err) {
      console.error("Submit failed", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setQuestionFile(null);
      setQuestion("");
    }
  };
  const defaultOpenItems = sorted.map((item) => item.id);

  return (
    <div className="flex h-full flex-col">
      <p className="text-lg font-semibold">Questions & Answers</p>
      {!isBuyer && false && (
        <div className="bg-muted/40 space-y-3 rounded-lg border p-4">
          <Textarea
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* <div className="j flex items-center gap-2">
            <label
              htmlFor="new-file"
              className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm"
            >
              <Paperclip className="h-4 w-4" />
              {questionFile?.name ||
                `Attach your .zip file (optional, max ${MAX_SIZE_MB}MB)`}
            </label>
            <Input
              id="new-file"
              type="file"
              accept=".zip"
              onChange={handleQuestionFileChange}
              className="hidden"
            />
            {questionFile && (
              <span className="text-muted-foreground text-xs">
                {(questionFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            )}
            {errorMsg && (
              <p className="text-sm font-medium text-red-500">{errorMsg}</p>
            )}
          </div> */}

          <Button
            disabled={submitting}
            variant="outline"
            onClick={handleSubmitQuestion}
          >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "Submitting..." : "Ask Question"}
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-x-hidden overflow-y-scroll">
        <Accordion
          type="multiple"
          defaultValue={defaultOpenItems}
          className="space-y-2"
        >
          {sorted.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {item.answer ? (
                    <div>
                      <p className="text-base">{item.answer}</p>
                    </div>
                  ) : isBuyer ? (
                    <div className="space-y-2">
                      {!submitted[item.id] && (
                        <>
                          <Textarea
                            placeholder="Write your answer..."
                            value={answers[item.id] || ""}
                            onChange={(e) =>
                              handleAnswerChange(item.id, e.target.value)
                            }
                          />
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`file-${item.id}`}
                              className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm"
                            >
                              <Paperclip className="h-4 w-4" />
                              {answerFiles[item.id]?.name ||
                                `Attach your .zip file (optional, max ${MAX_SIZE_MB}MB)`}
                            </label>
                            <Input
                              id={`file-${item.id}`}
                              type="file"
                              accept=".zip"
                              className="hidden"
                              onChange={(e) =>
                                handleAnswerFileChange(
                                  item.id,
                                  e.target.files?.[0] || null,
                                )
                              }
                            />
                            {answerFiles[item.id] && (
                              <span className="text-muted-foreground text-xs">
                                (
                                {answerFiles[item.id] &&
                                  (
                                    answerFiles[item.id]!.size /
                                    (1024 * 1024)
                                  ).toFixed(2)}
                                MB)
                              </span>
                            )}
                            {errorAnswerMsg[item.id] && (
                              <p className="text-sm font-medium text-red-500">
                                {errorAnswerMsg[item.id]}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSubmitAnswer(item.id)}
                            disabled={submitting || !answers[item.id]?.trim()}
                          >
                            <Send className="mr-2 h-4 w-4" />

                            {submitting ? "Submitting..." : "Submit Answer"}
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      (No answer yet)
                    </p>
                  )}

                  {item.file?.url && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => window.open(item.file?.url, "_blank")}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download attachment
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
