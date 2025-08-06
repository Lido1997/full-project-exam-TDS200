import React from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import ScreenWrapper from './ScreenWrapper';

const ImageItem = ({ item, onPress, onLoad }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.imageContainer}>
    <Text style={styles.caption}>{item.caption}</Text>
    <Text style={styles.likeText}>Likes: {item.likes?.length || 0}</Text>
    <Text style={styles.user}>{item.userEmail}</Text>
      {item.loading && (
        <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
      )}
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        onLoad={() => onLoad(item.id)}
      />
      
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 380,
    height: 380,
    borderRadius: 10,
  },
  caption: {
    marginTop:10,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  likeText: {
    marginTop: 5,
    fontSize: 14,
    color: 'blue',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
  user: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',

  },
});

export default ImageItem;
