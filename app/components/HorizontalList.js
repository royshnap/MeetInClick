import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';

const HorizontalList = ({ data, renderItem, headerTitle, emptyMessage }) => {
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <>
          <Text style={styles.sectionHeader}>{headerTitle}</Text>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalMatches}
            contentContainerStyle={{ alignItems: 'flex-start' }}
          />
        </>
      ) : (
        <Text style={styles.noMatchesOrChatsText}>{emptyMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
    marginLeft: 2,
    color: '#2e2934',
  },
  horizontalMatches: {
    paddingHorizontal: 2,
  },
  noMatchesOrChatsText: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: '#F44336',
  },
});

export default HorizontalList;
