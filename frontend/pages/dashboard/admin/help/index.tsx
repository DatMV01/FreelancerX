"use client";

import { ReactElement, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type SupportTicket = {
  id: string;
  question: string;
  user: string;
  createdAt: string;
  answered: boolean;
  answer?: string;
};

const mockTickets: SupportTicket[] = [
  {
    id: "1",
    question: "Làm sao để đổi avatar?",
    user: "Nguyễn Văn A",
    createdAt: "2025-04-11",
    answered: false,
  },
  {
    id: "2",
    question: "Tôi bị trừ tiền mà chưa nhận được dịch vụ?",
    user: "Trần Thị B",
    createdAt: "2025-04-10",
    answered: false,
  },
  {
    id: "3",
    question: "Bao lâu thì nhận được thanh toán?",
    user: "Lê Văn C",
    createdAt: "2025-04-09",
    answered: true,
    answer: "Bạn sẽ nhận thanh toán trong 1-3 ngày sau khi đơn hoàn tất.",
  },
];

export default function AdminSupportReply() {
  const [selectedId, setSelectedId] = useState<string | null>(
    mockTickets[0].id,
  );
  const [reply, setReply] = useState("");

  const selectedTicket = mockTickets.find((t) => t.id === selectedId);

  const handleSend = () => {
    if (!reply.trim()) return;
    alert(`Gửi phản hồi cho ${selectedTicket?.user}: ${reply}`);
    setReply("");
  };

  return (
    <div className="grid gap-2 md:grid-cols-4">
      {/* Danh sách câu hỏi */}
      <Card className="h-[500px] md:col-span-1">
        <CardContent className="p-2">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-1">
              {mockTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setSelectedId(ticket.id);
                    setReply(ticket.answer || "");
                  }}
                  className={`hover:bg-accent w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    ticket.id === selectedId ? "bg-muted" : ""
                  }`}
                >
                  <div className="line-clamp-1 font-medium">
                    {ticket.question}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {ticket.user} - {ticket.createdAt}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Nội dung chi tiết */}
      <Card className="md:col-span-3">
        <CardContent className="space-y-4 p-6">
          {selectedTicket ? (
            <>
              <h2 className="text-lg font-semibold">
                {selectedTicket.question}
              </h2>
              <p className="text-muted-foreground text-sm">
                Gửi bởi <b>{selectedTicket.user}</b> -{" "}
                {selectedTicket.createdAt}
              </p>
              <Separator />
              <div className="space-y-2">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Nhập câu trả lời tại đây..."
                  rows={5}
                />
                <Button onClick={handleSend}>Gửi phản hồi</Button>
              </div>
            </>
          ) : (
            <p>Chọn một câu hỏi để trả lời</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

AdminSupportReply.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
