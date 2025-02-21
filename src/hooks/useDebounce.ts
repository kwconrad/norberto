import { DependencyList, useEffect, useRef } from "react";

export default function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: DependencyList,
) {
  const handler = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (handler.current) {
      clearTimeout(handler.current);
    }

    handler.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [callback, delay, ...dependencies]);
}
