import { useEffect, useRef } from 'react';

export function useImpactDetect(onImpact, threshold = 45) {
  const callbackRef = useRef(onImpact);
  useEffect(() => { callbackRef.current = onImpact; }, [onImpact]);

  useEffect(() => {
    let cooldown = false;
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null) return;
      const total = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      if (total > threshold && !cooldown) {
        cooldown = true;
        callbackRef.current(total);
        setTimeout(() => { cooldown = false; }, 8000);
      }
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