import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentSection = ({
  // State variables for comments and user
  comments = [],
  user,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
  selectedImage, 
}) => {
  const confirmDelete = (comment) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteComment(comment) },
      ],
      { cancelable: true }
    );
  };

  // Render comments
  const renderItem = ({ item: comment }) => {
    const commentDate = new Date(comment.createdAt).toLocaleDateString();

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentDate}>{commentDate}</Text>
          <Text style={styles.commentUserEmail}>{comment.userEmail}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        {(comment.userId === user.uid || selectedImage.userId === user.uid) && (
          <TouchableOpacity onPress={() => confirmDelete(comment)} style={styles.deleteButton}>
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.commentSection}>
      {/* List of comments */}
      <FlatList
        data={[...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.commentList}
        contentContainerStyle={styles.commentListContent}
      />

      {/* Input-field at bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
        />
        {/* Post-comment button */}
        <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
          <Ionicons name="send" size={24} color="#2196F3" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  commentSection: {
    flex: 1,
    width: '100%',
  },
  commentList: {
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  commentListContent: {
    paddingBottom: 37,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  commentHeader: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#777',
  },
  commentUserEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addCommentButton: {
    padding: 5,
  },
});

export default CommentSection;
