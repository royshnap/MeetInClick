// src/hooks/useMatchSections.js
import { useMemo } from 'react';
import { useConversationTopicMatches } from '../context/ConversationContext';

export const useMatchSections = (filteredMatches) => {
  const { isApproved } = useConversationTopicMatches();

  const { newMatches, ongoingConversations } = useMemo(() => {
    const newMatches = filteredMatches.filter((user) => !isApproved(user.id));
    const ongoingConversations = filteredMatches.filter((user) =>
      isApproved(user.id)
    );

    return { newMatches, ongoingConversations };
  }, [filteredMatches, isApproved]);

  return { newMatches, ongoingConversations };
};
