import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

export default function WebLink({ href, children, style, onPress }) {
  if (Platform.OS === 'web') {
    return (
      <Text
        style={style}
        onPress={onPress}
        accessibilityRole="link"
        // Only use href when there is no custom handler (avoids full-page reload).
        {...(!onPress && href ? { href } : {})}
      >
        {children}
      </Text>
    );
  }
  
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  );
}
