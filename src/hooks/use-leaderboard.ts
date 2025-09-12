import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiMeme } from '@/types/meme';

interface UseLeaderboardReturn {
  memes: ApiMeme[];
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

const REFRESH_DEBOUNCE_MS = 1000; // 1秒内多次刷新只执行一次
const AUTO_REFRESH_INTERVAL = 30000; // 30秒自动刷新

export function useLeaderboard(initialMemes: ApiMeme[] = []): UseLeaderboardReturn {
  const [memes, setMemes] = useState<ApiMeme[]>(initialMemes);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoRefreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 获取排行榜数据
  const fetchLeaderboard = useCallback(async (signal?: AbortSignal): Promise<ApiMeme[]> => {
    const response = await fetch('/api/leaderboard', { signal });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }, []);

  // 刷新排行榜（带防抖）
  const refresh = useCallback(async () => {
    // 清除之前的定时器
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // 设置新的定时器实现防抖
    return new Promise<void>(resolve => {
      refreshTimeoutRef.current = setTimeout(async () => {
        // 如果已经在刷新，跳过
        if (isRefreshing) {
          resolve();
          return;
        }

        // 取消之前的请求
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // 创建新的 AbortController
        abortControllerRef.current = new AbortController();

        try {
          setIsRefreshing(true);
          const data = await fetchLeaderboard(abortControllerRef.current.signal);

          setMemes(data);
          setLastUpdated(new Date());
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Failed to refresh leaderboard:', error);
          }
        } finally {
          setIsRefreshing(false);
          setIsLoading(false);
          resolve();
        }
      }, REFRESH_DEBOUNCE_MS);
    });
  }, [isRefreshing, fetchLeaderboard]);

  // 初始化加载
  useEffect(() => {
    refresh();
  }, []);

  // 监听排行榜更新事件
  useEffect(() => {
    const handleLeaderboardUpdate = () => {
      refresh();
    };

    window.addEventListener('leaderboardUpdate', handleLeaderboardUpdate);

    return () => {
      window.removeEventListener('leaderboardUpdate', handleLeaderboardUpdate);
    };
  }, [refresh]);

  // 自动刷新
  useEffect(() => {
    autoRefreshIntervalRef.current = setInterval(() => {
      refresh();
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [refresh]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  return {
    memes,
    isLoading,
    isRefreshing,
    refresh,
    lastUpdated,
  };
}
