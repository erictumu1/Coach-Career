'use client';

import animationData from "@/components/data/hi.json";
import { Player } from '@lottiefiles/react-lottie-player';

export default function CarAnimation() {
  return (
<Player
  autoplay
  loop
  src={animationData}
  style={{ height: '550px', width: '550px' }}
  onEvent={(event) => {
    if (event === 'error') {
      console.error('Failed to load animation');
    }
  }}
/>

  );
}
