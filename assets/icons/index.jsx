import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../../constants/themes';
import Back from './Back';
import Email from './Email';
import Lock from './Lock';
import User from './User';
import Like from './Like';

const icons = {
  back: Back,
  email: Email,
  lock: Lock,
  user: User,
  like: Like,
}

const Icon = ({name, ...props}) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...props}
    />
  )
}

export default Icon
