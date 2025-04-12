import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Send,
  CircleArrowUp,
  MessageSquare,
  Ban,
  Tag,
  Star,
} from "lucide-react";

export function OrderActions({
  onView,
  onDeliver,
  onCancel,
  onMessage,
  onTag,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDeliver}>
          <CircleArrowUp className="mr-2 h-4 w-4" /> Deliver Work
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onMessage}>
          <MessageSquare className="mr-2 h-4 w-4" /> Send Message
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onTag}>
          <Tag className="mr-2 h-4 w-4" /> Tag / Label
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onCancel}>
          <Ban className="mr-2 h-4 w-4 text-red-500" /> Cancel Order
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert("Marked as priority")}>
          <Star className="mr-2 h-4 w-4 text-yellow-500" /> Mark as Priority
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
