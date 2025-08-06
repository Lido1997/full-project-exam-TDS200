import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, TextInput, Animated, Dimensions } from 'react-native';
import { db, auth } from '../../FirebaseConfig';
import { collection, doc, orderBy, query, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import ScreenWrapper from '../../components/ScreenWrapper';
import ImageItem from '../../components/ImageItem';
import ImageModal from '../../components/ImageModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Discover = () => {

  // State variables for images, filtered images, search input, selected image, modal visibility, and new comments
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const user = auth.currentUser;

  // Fetch and listen for image updates from Firestore
  useEffect(() => {
    const imagesQuery = query(collection(db, 'images'), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(imagesQuery, (querySnapshot) => {
      const imageList = querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
        loading: true,
      }));
      setImages(imageList);
      setFilteredImages(imageList); 
    });

    return () => unsubscribe();
  }, []);

  // Filter images based on the search query (hashtags)
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredImages(images); // Show all images if the search query is empty
    } else {
      const filtered = images.filter((image) =>
        image.hashtags?.toLowerCase().includes(text.toLowerCase()) 
      );
      setFilteredImages(filtered);
    }
  };

  // Update image state when an image finishes loading
  const handleImageLoad = (id) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, loading: false } : img
      )
    );
  };

  // Open modal to display image details (comments, likes, etc.)
  const openModal = (image) => {
    setSelectedImage({ ...image, loading: true });
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal 
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedImage(null);
      setNewComment('');
    });
  };

  // Handle likes on images
  const handleLike = async () => {
    const liked = (selectedImage.likes || []).includes(user.uid);
    const updatedLikes = liked
      ? (selectedImage.likes || []).filter(uid => uid !== user.uid) 
      : [...(selectedImage.likes || []), user.uid]; 

    setSelectedImage(prev => ({
      ...prev,
      likes: updatedLikes
    }));

    try {
      const imageRef = doc(db, 'images', selectedImage.id);
      await updateDoc(imageRef, {
        likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      console.error("Failed to update like:", error);
      
      // Revert state if the update fails
      setSelectedImage(prev => ({
        ...prev,
        likes: liked ? [...(prev.likes || []), user.uid] : (prev.likes || []).filter(uid => uid !== user.uid)
      }));
    }
  };

  // Add a new comment to the selected image
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const comment = {
      text: newComment,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    setSelectedImage(prev => ({
      ...prev,
      comments: [...(prev.comments || []), comment]
    }));
    setNewComment('');

    try {
      const imageRef = doc(db, 'images', selectedImage.id);
      await updateDoc(imageRef, {
        comments: arrayUnion(comment),
      });
    } catch (error) {
      console.error("Failed to add comment:", error);

      // Revert state if the update fails
      setSelectedImage(prev => ({
        ...prev,
        comments: prev.comments ? prev.comments.filter(c => c !== comment) : []
      }));
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };

  // Delete a comment from the selected image
  const handleDeleteComment = async (comment) => {
    if (comment.userId === user.uid || selectedImage.userId === user.uid) {
      setSelectedImage(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c !== comment)
      }));

      try {
        const imageRef = doc(db, 'images', selectedImage.id);
        await updateDoc(imageRef, {
          comments: arrayRemove(comment),
        });
      } catch (error) {
        console.error("Failed to delete comment:", error);

        // Revert state if the update fails
        setSelectedImage(prev => ({
          ...prev,
          comments: [...prev.comments, comment]
        }));
        Alert.alert("Error", "Failed to delete comment. Please try again.");
      }
    } else {
      Alert.alert("Error", "You can't delete this comment.");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Discover</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by hashtag..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredImages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ImageItem
              item={item}
              onPress={openModal}
              onLoad={handleImageLoad}
            />
          )}
        />
        {modalVisible && selectedImage && (
          <ImageModal
            selectedImage={selectedImage}
            slideAnim={slideAnim}
            closeModal={closeModal}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            newComment={newComment}
            setNewComment={setNewComment}
            user={user}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default Discover;
