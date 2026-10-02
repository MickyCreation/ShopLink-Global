import React from 'react';

interface NigerianCurrencyProps {
  amount: number;
  className?: string;
  showSign?: boolean;
}

export const NigerianCurrency: React.FC<NigerianCurrencyProps> = ({
  amount,
  className = '',
  showSign = true
}) => {
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0
  }).format(Math.round(amount));

  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {showSign ? '₦' : ''}{formatted}
    </span>
  );
};
