import React from 'react';
import { View, Image, Text, Animated, StyleSheet, ScrollView } from 'react-native';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import Header from './Header';

const ImageModal = ({
  selectedImage,
  slideAnim,
  closeModal,
  handleLike,
  handleAddComment,
  handleDeleteComment,
  newComment,
  setNewComment,
  user,
}) => {
  return (
    <Animated.View style={[styles.fullScreenModal, { transform: [{ translateX: slideAnim }] }]}>
      <Header title={`${selectedImage.userEmail}'s post`} onBackPress={closeModal} />

      <View style={styles.modalContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.url }} style={styles.modalImage} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.captionLikeRow}>
            <Text style={styles.captionText}>{selectedImage.caption}</Text>
            <View style={styles.likeButtonContainer}>
              <LikeButton likes={selectedImage.likes} user={user} handleLike={handleLike} />
            </View>
          </View>
          <Text style={styles.modalText}>{selectedImage.description}</Text>

          {/* Hashtags and Comments */}
          <View style={styles.interactions}>
            <ScrollView 
              style={styles.hashtagsContainer} 
              contentContainerStyle={{ flexGrow: 1 }}
              nestedScrollEnabled
            >
              <Text style={styles.modalText}>{selectedImage.hashtags}</Text>
            </ScrollView>
            <Text style={styles.label}>Comments: {(selectedImage.comments || []).length}</Text>
          </View>
        </View>

        {/* Send selectedImage as a prop */}
        <CommentSection
          comments={selectedImage.comments || []}
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
          selectedImage={selectedImage}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalImage: {
    width: 270,
    height: 270,
    borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  captionLikeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeButtonContainer: {
    marginLeft: 10,
  },
  interactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  hashtagsContainer: {
    maxHeight: 60, 
    flex: 1,
    marginRight: 10,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
  captionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ImageModal;
