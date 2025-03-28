/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import Music from '@assets/battlefield/MusicBundle3.mp3';
import PlayIcon from '@assets/PlayIcon.png';
import PauseIcon from '@assets/PauseIcon.png';
import styles from './MusicButton.module.css';

const MusicButton = () => {
  const musicRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!musicRef.current) return;
    if (!isPlaying) {
      musicRef.current.play();
    }
    if (isPlaying) {
      console.log('pause');
      musicRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    musicRef.current.volume = 0.3;
  }, []);

  return (
    <button className={styles.button} type="button" onClick={handlePlayPause}>
      {isPlaying ? <img src={PauseIcon} alt="menu" /> : <img src={PlayIcon} alt="menu" />}
      <audio ref={musicRef} loop preload="true">
        <source src={Music} type="audio/mpeg" />
      </audio>
    </button>
  );
};

export default MusicButton;
