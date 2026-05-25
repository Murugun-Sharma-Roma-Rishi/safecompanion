import { useEffect } from 'react';

export function useShake(onShake, threshold = 18) {
  useEffect(() => {
    let lastX = null, lastY = null, lastZ = null;

    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (lastX === null) { lastX = x; lastY = y; lastZ = z; return; }

      const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      if (delta > threshold) onShake();

      lastX = x; lastY = y; lastZ = z;
    };

    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('devicemotion', handleMotion);
      });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onShake, threshold]);
}