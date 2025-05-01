"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Constrain TData to always have an _id property
interface Data {
  _id: string;
  amount: number;
  date: string; // Date as string
  description: string;
  category: "Food" | "Transport" | "Utilities" | "Entertainment" | "Other";
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];  // Adjusted for TData
  data: TData[];  // Data should match TData
}

export function DataTable<TData extends { _id: string }>({  // Constraining TData to include _id
  columns,
  data,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch("/api/delete-transaction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      if (!response.ok) {
        console.error("Delete failed:", response.status);
        return;
      }

      router.refresh(); // Ensure this is supported in your Next.js version
    } catch (error: any) {
      console.error("Error deleting transaction:", error.message);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="default" asChild>
                    <Link href={`/edit-transaction/${row.original._id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(row.original._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
