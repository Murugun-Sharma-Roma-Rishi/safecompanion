import { useEffect, useRef } from 'react';

export function useShake(onShake, threshold = 18) {
  const callbackRef = useRef(onShake);
  useEffect(() => { callbackRef.current = onShake; }, [onShake]);

  useEffect(() => {
    let lastX = null, lastY = null, lastZ = null;
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null) return;
      const { x, y, z } = acc;
      if (lastX === null) { lastX = x; lastY = y; lastZ = z; return; }
      const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      if (delta > threshold) callbackRef.current();
      lastX = x; lastY = y; lastZ = z;
    };
    const register = () => window.addEventListener('devicemotion', handleMotion);
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(s => { if (s === 'granted') register(); }).catch(() => {});
    } else {
      register();
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [threshold]);
}