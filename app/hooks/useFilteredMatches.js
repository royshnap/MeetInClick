// src/hooks/useFilteredMatches.js
import { useMemo } from 'react';

export const useFilteredMatches = (conversationTopicResults, user, filters) => {
  const { ageRange = [18, 120], genderPreference = 'Both' } = filters;

  const filteredMatches = useMemo(() => {
    if (!user || !user.mainCategory || !user.conversationTopics) {
      return [];
    }

    return conversationTopicResults.filter((otherUser) => {
      if (
        !otherUser.mainCategory ||
        !otherUser.conversationTopics ||
        !otherUser.age ||
        !otherUser.gender
      ) {
        return false;
      }

      const sameMainCategory = user.mainCategory === otherUser.mainCategory;
      const commonTopics = user.conversationTopics.some((topic) =>
        otherUser.conversationTopics.includes(topic)
      );

      const withinAgeRange =
        otherUser.age >= ageRange[0] && otherUser.age <= ageRange[1];
      const genderMatch =
        genderPreference === 'Both' || otherUser.gender === genderPreference;

      return sameMainCategory && commonTopics && withinAgeRange && genderMatch;
    });
  }, [conversationTopicResults, filters, user]);

  return filteredMatches;
};
