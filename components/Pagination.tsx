import Link from "next/link";
import { PaginationProps } from "@/types";

function Pagination({ currentPage, totalPages, path }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`${path}?page=${currentPage - 1}`}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </Link>
      )}

      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`${path}?page=${currentPage + 1}`}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </div>
  );
}

export default Pagination;
