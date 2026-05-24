import { useEffect, useId } from 'react';
import { Platform } from 'react-native';

/**
 * Inject CSS into document.head on web. Returns null so nothing is mounted
 * inside <View> (avoids "Unexpected text node: ." from CSS class selectors).
 */
export default function WebStyle({ css }) {
  const reactId = useId();
  const styleId = `web-style-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    if (Platform.OS !== 'web' || !css || typeof document === 'undefined') {
      return undefined;
    }

    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = css;

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [css, styleId]);

  return null;
}
