"use client"

import { ColumnDef } from "@tanstack/react-table"


export type Payment = {
    id: string
    amount: number
    date: Date
    description: String
    category: "Food" | "Transport" | "Utilities" | "Entertainment" | "Other"
    action: () => {}
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    // {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         const rowData = row.original

    //         const handleDelete = async () => {
    //             try {
    //                 const res = await fetch(`/api/delete-transaction/${rowData._id}`, {
    //                     method: "DELETE",
    //                 })
    //                 if (!res.ok) throw new Error("Failed to delete")
    //                 // Optionally refresh table data after delete
    //                 alert("Deleted successfully")
    //             } catch (err) {
    //                 console.error("Delete error:", err)
    //                 alert("Error deleting item")
    //             }
    //         }
    //     }
    // }
]
