// src/hooks/useMatchSections.js

import { useMemo } from 'react';
import { useConversationTopicMatches } from '../context/ConversationContext';

export const useMatchSections = (filteredMatches) => {
  const { isApproved } = useConversationTopicMatches();

  const newMatches = useMemo(() => {
    return filteredMatches.filter((otherUser) => !isApproved(otherUser.id));
  }, [filteredMatches]);

  const ongoingConversations = useMemo(() => {
    return filteredMatches.filter((otherUser) => isApproved(otherUser.id));
  }, [filteredMatches]);

  return { newMatches, ongoingConversations };
};
