'use client';

import animationData from "@/components/data/cardriving.json";
import { Player } from '@lottiefiles/react-lottie-player';

export default function CarAnimation() {
  return (
<Player
  autoplay
  loop
  src={animationData}
  style={{ height: '300px', width: '300px' }}
  onEvent={(event) => {
    if (event === 'error') {
      console.error('Failed to load animation');
    }
  }}
/>

  );
}
