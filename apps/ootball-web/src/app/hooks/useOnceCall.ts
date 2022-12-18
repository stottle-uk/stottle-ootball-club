import { useEffect, useRef } from 'react';

export const useOnceCall = (
  cb: () => unknown | Promise<unknown>,
  condition = true
) => {
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (condition && !isCalledRef.current) {
      isCalledRef.current = true;
      (async () => await cb())();
    }
  }, [cb, condition]);
};
