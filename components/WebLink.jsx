import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

export default function WebLink({ href, children, style, onPress }) {
  if (Platform.OS === 'web') {
    // For web, render as an anchor tag using dangerouslySetInnerHTML
    // or use a web-specific component
    return (
      <Text
        style={style}
        onPress={() => {
          if (onPress) {
            onPress();
          } else if (typeof window !== 'undefined') {
            window.location.href = href;
          }
        }}
        accessibilityRole="link"
        // @ts-ignore - href is supported by react-native-web
        href={href}
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
