import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseVirtualListOptions = {
  count: number;
  estimateHeight: number;
  overscan?: number;
};

export type VirtualItem = {
  index: number;
  start: number;
};

type UseVirtualListResult = {
  containerRef: (node: HTMLDivElement | null) => void;
  virtualItems: VirtualItem[];
  totalHeight: number;
  measureElement: (node: HTMLElement | null) => void;
};

export const useVirtualList = ({
  count,
  estimateHeight,
  overscan = 4,
}: UseVirtualListOptions): UseVirtualListResult => {
  const containerElRef = useRef<HTMLDivElement | null>(null);

  const [heights, setHeights] = useState<Record<number, number>>({});

  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    containerTop: 0,
  });

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    containerElRef.current = node;
    if (node) {
      const rect = node.getBoundingClientRect();
      setScrollState((s) => ({
        ...s,
        containerTop: rect.top + window.scrollY,
      }));
    }
  }, []);

  useEffect(() => {
    const onScrollOrResize = () => {
      const node = containerElRef.current;
      const containerTop = node ? node.getBoundingClientRect().top + window.scrollY : 0;
      setScrollState({
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        containerTop,
      });
    };

    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const { offsets, totalHeight } = useMemo(() => {
    const result = new Array<number>(count + 1);
    result[0] = 0;
    for (let i = 0; i < count; i++) {
      result[i + 1] = result[i] + (heights[i] ?? estimateHeight);
    }
    return { offsets: result, totalHeight: result[count] ?? 0 };
  }, [count, heights, estimateHeight]);

  const virtualItems = useMemo(() => {
    if (count === 0) {
      return [] as VirtualItem[];
    }

    const viewportTop = scrollState.scrollY - scrollState.containerTop;
    const viewportBottom = viewportTop + scrollState.viewportHeight;

    let lo = 0;
    let hi = count - 1;
    let first = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid + 1] >= viewportTop) {
        first = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }

    const startIndex = Math.max(0, first - overscan);
    let endIndex = startIndex;
    while (endIndex < count - 1 && offsets[endIndex] < viewportBottom) {
      endIndex++;
    }
    endIndex = Math.min(count - 1, endIndex + overscan);

    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, start: offsets[i] });
    }
    return items;
  }, [count, offsets, overscan, scrollState]);

  const measureElement = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return;
    }
    const indexAttr = node.getAttribute('data-index');
    if (indexAttr === null) {
      return;
    }
    const index = Number(indexAttr);
    const height = node.getBoundingClientRect().height;
    if (height > 0) {
      setHeights((prev) => (prev[index] === height ? prev : { ...prev, [index]: height }));
    }
  }, []);

  return { containerRef, virtualItems, totalHeight, measureElement };
};
