import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiMeme } from '@/types/meme';

interface BattleQueueState {
  currentPair: ApiMeme[];
  queue: ApiMeme[][];
  isLoading: boolean;
  isSubmitting: boolean;
}

interface UseBattleQueueReturn extends BattleQueueState {
  submitBattle: (winnerId: number) => Promise<void>;
  loadMorePairs: () => Promise<void>;
}

const PRE_FETCH_COUNT = 5; // 预获取5组对战

export function useBattleQueue(initialPairs: ApiMeme[][] = []): UseBattleQueueReturn {
  const [state, setState] = useState<BattleQueueState>({
    currentPair: [],
    queue: initialPairs,
    isLoading: true,
    isSubmitting: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const resultQueueRef = useRef<Array<{ meme1_id: number; meme2_id: number; winner_id: number }>>([]);
  const isProcessingRef = useRef(false);

  // 预获取对战组合
  const fetchBattlePairs = useCallback(async (count: number = PRE_FETCH_COUNT): Promise<ApiMeme[][]> => {
    try {
      const pairs: ApiMeme[][] = [];
      
      for (let i = 0; i < count; i++) {
        const response = await fetch('/api/battle-pair');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.length === 2) {
          pairs.push(data);
        }
      }
      
      return pairs;
    } catch (error) {
      console.error('Failed to fetch battle pairs:', error);
      return [];
    }
  }, []);

  // 异步提交对战结果
  const processResultQueue = useCallback(async () => {
    if (isProcessingRef.current || resultQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    
    while (resultQueueRef.current.length > 0) {
      const result = resultQueueRef.current.shift();
      if (!result) continue;

      try {
        const response = await fetch('/api/battle-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });

        if (!response.ok) {
          console.error('Failed to submit battle result:', response.status);
          // 可以选择重试或记录失败
        }
      } catch (error) {
        console.error('Error submitting battle result:', error);
      }
    }
    
    isProcessingRef.current = false;
  }, []);

  // 提交对战（异步）
  const submitBattle = useCallback(async (winnerId: number) => {
    if (state.currentPair.length !== 2 || state.isSubmitting) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // 添加到结果队列
      resultQueueRef.current.push({
        meme1_id: state.currentPair[0].id,
        meme2_id: state.currentPair[1].id,
        winner_id: winnerId,
      });

      // 异步处理结果队列
      processResultQueue();

      // 立即切换到下一组（无需等待提交完成）
      if (state.queue.length > 0) {
        const nextPair = state.queue[0];
        const remainingQueue = state.queue.slice(1);
        
        setState(prev => ({
          ...prev,
          currentPair: nextPair,
          queue: remainingQueue,
          isSubmitting: false,
        }));

        // 如果队列快用完了，预获取更多
        if (remainingQueue.length < 2) {
          fetchBattlePairs(PRE_FETCH_COUNT).then(newPairs => {
            setState(prev => ({
              ...prev,
              queue: [...prev.queue, ...newPairs],
            }));
          });
        }
      } else {
        // 队列为空，重新加载
        setState(prev => ({ ...prev, isSubmitting: false }));
        loadMorePairs();
      }

      // 触发排行榜更新事件
      window.dispatchEvent(new CustomEvent('leaderboardUpdate'));
    } catch (error) {
      console.error('Error submitting battle:', error);
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.currentPair, state.queue, processResultQueue, fetchBattlePairs]);

  // 加载更多对战组合
  const loadMorePairs = useCallback(async () => {
    if (state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const newPairs = await fetchBattlePairs(PRE_FETCH_COUNT);
      
      setState(prev => {
        const newState = {
          ...prev,
          queue: [...prev.queue, ...newPairs],
          isLoading: false,
        };

        // 如果当前没有对战组合，使用第一个
        if (prev.currentPair.length === 0 && newPairs.length > 0) {
          return {
            ...newState,
            currentPair: newPairs[0],
            queue: newPairs.slice(1),
          };
        }

        return newState;
      });
    } catch (error) {
      console.error('Error loading more pairs:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, fetchBattlePairs]);

  // 初始化
  useEffect(() => {
    loadMorePairs();
  }, []);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    submitBattle,
    loadMorePairs,
  };
}