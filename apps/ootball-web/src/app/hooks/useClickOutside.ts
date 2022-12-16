import React, { useEffect } from 'react';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  outsideClicked: (e: Event) => void
) => {
  useEffect(() => {
    const destroy$ = new Subject();

    merge(
      fromEvent<MouseEvent>(document, 'mousedown').pipe(
        filter(
          (e) =>
            !!(ref.current && !ref.current.contains(e.target as HTMLElement))
        )
      ),
      fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        filter((e) => e.code === 'Escape')
      )
    )
      .pipe(
        tap((e) => outsideClicked(e)),
        takeUntil(destroy$)
      )
      .subscribe();

    return () => {
      destroy$.next(null);
      destroy$.complete();
    };
  }, [ref, outsideClicked]);
};
