'use client';

import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from 'react';

export default function CarAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/cardriving.json')
      .then(res => res.json())
      .then(data => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: '300px', width: '300px' }}
    />
  );
}
