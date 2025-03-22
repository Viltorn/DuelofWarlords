import useSound from 'use-sound';
import SoundEffects from '@assets/battlefield/SoundEffects.mp3';

const useSoundEffects = () => {
  const [play] = useSound(SoundEffects, {
    volume: 0.4,
    sprite: {
      drum: [0, 1300],
      bow: [2400, 500],
      sword: [2800, 400],
      heal: [3500, 1200],
      light: [6700, 1000],
      air: [11500, 1200],
      water: [13400, 900],
      fire: [14300, 700],
      arcane: [15000, 1000],
    },
  });

  return { play };
};

export default useSoundEffects;
