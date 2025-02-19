import { SalesDataType } from '@/types';

export default function Charts(
  { data: salesData }: { data: { salesData: SalesDataType[] }}
) {
  console.log(salesData);
  return (
    <>Chart</>
  );
}