import { useState, useEffect } from 'react';

interface LeadPreferences {
  location?: string;
  budget?: number;
  urgency?: string;
}

interface LeadScore {
  score: number;
  tag: 'hot' | 'warm' | 'cold';
  reasons: string[];
}

interface UseLeadScoringResult extends LeadScore {
  isHot: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useLeadScoring(
  chatHistory: string,
  preferences: LeadPreferences
): UseLeadScoringResult {
  const [score, setScore] = useState<number>(0);
  const [tag, setTag] = useState<'hot' | 'warm' | 'cold'>('cold');
  const [reasons, setReasons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scoreLead = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/score-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_history: chatHistory,
            preferences,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to score lead');
        }

        const data: LeadScore = await response.json();
        setScore(data.score);
        setTag(data.tag);
        setReasons(data.reasons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Only score if we have chat history
    if (chatHistory.trim()) {
      scoreLead();
    }
  }, [chatHistory, preferences]);

  return {
    score,
    tag,
    reasons,
    isHot: tag === 'hot',
    isLoading,
    error,
  };
} 