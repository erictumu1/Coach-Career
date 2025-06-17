'use client';

import { Player } from '@lottiefiles/react-lottie-player';

export default function CarAnimation() {
  return (
    <Player
      autoplay
      loop
      src="/cardriving.json"
      style={{ height: '300px', width: '300px' }}
    />
  );
}
