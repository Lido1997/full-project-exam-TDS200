import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../../FirebaseConfig';
import { router } from 'expo-router';
import { collection, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function Profile() {

  // State variables for user images and loading status
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});
  const user = auth.currentUser;
  const [unsubscribe, setUnsubscribe] = useState(null);

  // Handle user authentication and fetch user images
  useEffect(() => {
    if (!user) {
      // Redirect to login screen if user sign out
      router.replace('/');
      return;
    }
    const unsubscribeListener = fetchUserImages();
  
    return () => {
      if (unsubscribeListener) unsubscribeListener();
    };
  }, [user]);
  
  // Fetch user images from Firestore
  const fetchUserImages = () => {
    if (!user) return; 
    try {
      const q = query(collection(db, 'images'), where('userId', '==', user.uid));
      const unsubscribeListener = onSnapshot(q, (querySnapshot) => {
        // Update images state with user images
        const userImages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(userImages);
      });
      return unsubscribeListener;
    } catch (error) {
      console.error("Error fetching user images: ", error);
    }
  };

  // Handle image load event
  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  // Delete image from Firestore and Storage
  const handleDeleteImage = async (imageId, imageUrl) => {
    if (!user) return; 
    try {
      await deleteDoc(doc(db, 'images', imageId));
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      setImages(prevImages => prevImages.filter(image => image.id !== imageId));
      Alert.alert('Deleted', 'Image has been deleted successfully!');
    } catch (error) {
      console.error("Error deleting image: ", error);
      Alert.alert('Error', 'Failed to delete image.');
    }
  };

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      if (unsubscribe) unsubscribe(); 
      await auth.signOut();
      router.replace('/'); 
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Sign Out Error", "There was an issue signing out. Please try again.");
    }
  };
  

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {user && <Text style={styles.userMail}>{user.email}</Text>}
      </View>
      <View style={styles.container}>
        <Text style={styles.gallery}>Your art:</Text>
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              {loadingImages[item.id] !== false && (
                <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
              )}
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                onLoad={() => handleImageLoad(item.id)}
                onLoadStart={() => setLoadingImages(prev => ({ ...prev, [item.id]: true }))}
              />
              <Text style={styles.caption}>{item.caption}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(item.id, item.url)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
  
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 5,
  },
  userMail: {
    fontSize: 16,
    color: '#1A237E',
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  gallery: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  caption: {
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF3D00',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
});
