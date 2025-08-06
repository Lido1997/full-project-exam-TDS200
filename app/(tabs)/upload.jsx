import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from '../../FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ScreenWrapper from '../../components/ScreenWrapper';

const Upload = ({ navigation }) => {

  // State variables for image upload form
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  // Format hashtags to a comma-separated string
  const formatHashtags = (input) => {
    return input
      .split(/[ ,]+/) // Del opp input basert på mellomrom eller komma
      .filter((tag) => tag.trim() !== '') // Fjern tomme tags
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)) // Legg til # hvis det mangler
      .join(','); // Sett sammen til en kommaseparert streng
  };

  // Reset form fields
  const resetForm = () => {
    setImage(null);
    setCaption('');
    setDescription('');
    setHashtags('');
  };

  // Select image from device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
    }
  };

  // Upload image to Firebase Storage and Firestore
  const uploadImage = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload images!');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'No image selected!');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Error', 'Caption is required!');
      return;
    }

    if (!hashtags.trim()) {
      Alert.alert('Error', 'Hashtags cannot be empty!');
      return;
    }

    const formattedHashtags = formatHashtags(hashtags); 

    if (loading) {
      return; // Prevent multiple uploads at once
    }

    setLoading(true);

    // Convert image URI to blob (Binary Large Object)
    try {
      if (!image.startsWith('file://')) {
        throw new Error('Invalid image URI!');
      }

      let blob;
      try {
        const response = await fetch(image);
        blob = await response.blob();
      } catch (error) {
        console.error('Error converting image to blob:', error);
        Alert.alert('Error', 'Failed to process image. Please try again.');
        setLoading(false);
        return;
      }

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);

      try {
        await uploadBytes(storageRef, blob);
      } catch (error) {
        console.error('Error uploading to Firebase Storage:', error);
        Alert.alert('Error', 'Failed to upload to Firebase. Please try again.');
        setLoading(false);
        return;
      }

      let downloadURL;
      try {
        downloadURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error fetching download URL:', error);
        Alert.alert('Error', 'Failed to get image URL. Please try again.');
        setLoading(false);
        return;
      }

      // Save image data to Firestore
      await addDoc(collection(db, 'images'), {
        url: downloadURL,
        userId: user.uid,
        userEmail: user.email,
        caption,
        description,
        hashtags: formattedHashtags,
        createdAt: serverTimestamp(),
      });

      resetForm(); // Reset form fields
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Error during upload:', error);
      Alert.alert('Error', 'Upload failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Upload an Image</Text>
        <Button title="Pick an image" onPress={pickImage} />
        {image && (
          <>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TextInput
              placeholder="Enter caption"
              value={caption}
              onChangeText={setCaption}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter hashtags (e.g., nature travel adventure)"
              value={hashtags}
              onChangeText={setHashtags}
              style={styles.input}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
            ) : (
              <>
                <Button title="Upload Image" onPress={uploadImage} style={styles.uploadButton} />
                <Button title="Cancel" onPress={resetForm} style={styles.cancelButton} color="red" />
              </>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '80%',
  },
  uploadButton: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default Upload;
