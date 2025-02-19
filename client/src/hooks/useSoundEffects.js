import useSound from 'use-sound';
import SoundEffects from '@assets/battlefield/SoundEffects.mp3';

const useSoundEffects = () => {
  const [play] = useSound(SoundEffects, {
    volume: 1,
    sprite: {
      drum: [0, 2000],
      bow: [2400, 600],
      sword: [2800, 400],
      heal: [9800, 1000],
      light: [5900, 1000],
      air: [12000, 1200],
      water: [13800, 900],
      fire: [14700, 700],
      arcane: [15800, 1200],
    },
  });

  const playSound = play;

  return { playSound };
};

export default useSoundEffects;
