import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const CustomScrollView = ({ children, contentContainerStyle, ...props }) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, contentContainerStyle]}
      keyboardShouldPersistTaps='handled'
      keyboardDismissMode='on-drag'
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2CC',
    paddingVertical: 20,
  },
});

export default CustomScrollView;
