import { cn } from '@/lib/utils';

export default function ProductPrice({ value, className }: { value: number; className?: string; }) {
  // Ensure two decimal
  const stringValue = value.toFixed(2);
  // Get int/float
  const [intValue, floatValue] = stringValue.split('.');

  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}