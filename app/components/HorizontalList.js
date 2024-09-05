import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';

const HorizontalList = ({ data, renderItem, headerTitle, emptyMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>{headerTitle}</Text>
      {data.length > 0 ? (
        <>
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
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
    marginBottom: 5,
    color: 'black',
  },
  horizontalMatches: {
    paddingHorizontal: 2,
  },
  noMatchesOrChatsText: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: 'red',
  },
});

export default HorizontalList;
