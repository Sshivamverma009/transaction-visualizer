import EditTransaction from '@/components/EditTransaction';

type Params = Promise<{ id: string }>;

export default async function EditTransactionPage({ params }: {params : Params}) {

  const {id} = await params;
  return <EditTransaction id={id} />;
}
