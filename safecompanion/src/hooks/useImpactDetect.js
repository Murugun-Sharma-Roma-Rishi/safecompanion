import { useEffect, useRef } from 'react';

// Detects a sudden large impact (drop, fall, hit)
// threshold ~40 = hard drop, 60 = very hard impact
export function useImpactDetect(onImpact, threshold = 45) {
  const cooldown = useRef(false);

  useEffect(() => {
    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (!x && !y && !z) return;
      const total = Math.sqrt(x*x + y*y + z*z);

      if (total > threshold && !cooldown.current) {
        cooldown.current = true;
        onImpact(total);
        setTimeout(() => { cooldown.current = false; }, 8000); // 8s cooldown
      }
    };

    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('devicemotion', handleMotion);
      });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onImpact, threshold]);
}