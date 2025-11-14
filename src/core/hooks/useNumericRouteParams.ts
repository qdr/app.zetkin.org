'use client';

import { useParams } from 'next/navigation';

export default function useNumericRouteParams(): Record<string, number> {
  const params = useParams();
  const output: Record<string, number> = {};

  if (!params) return output;

  Object.keys(params).forEach((key: string) => {
    const paramValue = params[key];
    const value = parseInt(Array.isArray(paramValue) ? paramValue[0] : paramValue);
    if (!isNaN(value)) {
      output[key] = value;
    }
  });

  return output;
}
