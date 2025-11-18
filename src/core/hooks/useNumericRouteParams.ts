'use client';

import { useParams } from 'next/navigation';

export default function useNumericRouteParams(): Record<string, number> {
  const params = useParams();
  const output: Record<string, number> = {};
  Object.keys(params).forEach((key: string) => {
    const value = parseInt(params[key] as string);
    if (!isNaN(value)) {
      output[key] = value;
    }
  });

  return output;
}
