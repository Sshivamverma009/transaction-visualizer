"use client"
import { useEffect, useState } from 'react'; // import necessary hooks
import { Payment, columns } from '@/components/Columns';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState<Payment[]>([]); // useState to hold fetched data
  const [loading, setLoading] = useState<boolean>(true); // Optional: handle loading state

  useEffect(() => {
    // Fetch data inside useEffect
    async function getData() : Promise<Payment[]> {
      const response = await fetch('/api/get-transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log(result.transactions);
      setData(result.transactions); // Set the fetched data to state
      setLoading(false); // Update loading state
      return result;
    }

    getData(); // Call the async function
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <div className='text-center text-2xl'>Loading...</div>; // Display a loading state if data is still being fetched
  }

  return (
    <main className="min-h-screen grid place-items-center p-8 sm:p-20 font-sans">
      <div className="container mx-auto py-10">
        <Button variant={'secondary'} className='bg-violet-400 my-1.5' >
          <Link href={'/pages/add-transaction'} >Add Transaction</Link>
        </Button>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
