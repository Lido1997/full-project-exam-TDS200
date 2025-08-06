import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LikeButton = ({ likes = [], user, handleLike }) => {
  const liked = likes.includes(user.uid);

  return (
    <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons
        name={liked ? "thumbs-up" : "thumbs-up-outline"}
        size={24}
        color="#2196F3"
      />
      <Text style={{ marginLeft: 5 }}>{likes.length}</Text>
    </TouchableOpacity>
  );
};

export default LikeButton;

