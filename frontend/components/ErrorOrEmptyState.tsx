import React from "react";
import { AlertTriangle, FileQuestion, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorOrEmptyStateProps {
  isError?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  retry?: () => void;
}

export const ErrorOrEmptyState: React.FC<ErrorOrEmptyStateProps> = ({
  isError,
  isLoading,
  isEmpty,
  errorMessage = "An error occurred while loading data.",
  emptyMessage = "No data available to display.",
  retry,
}) => {
  if (isLoading) return null;

  if (isError) {
    return (
      <div className="m-auto flex flex-col items-center justify-center py-10 text-center text-red-600">
        <AlertTriangle className="mb-2 h-10 w-10" />
        <p className="mb-2 font-medium">{errorMessage}</p>
        {retry && (
          <Button variant="outline" onClick={retry}>
            <RefreshCcw />
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="m-auto flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <FileQuestion className="mb-2 h-10 w-10" />
        <p className="font-medium">{emptyMessage}</p>
        {retry && (
          <Button variant="outline" onClick={retry}>
            <RefreshCcw />
          </Button>
        )}
      </div>
    );
  }

  return null;
};
