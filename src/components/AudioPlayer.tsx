"use client"

import { useState } from 'react';
import { Howl } from 'howler';
import { Slider } from '@mui/material';

type AudioPlayerProps = {
  url: string;
};

const AudioPlayer = ({ url }: AudioPlayerProps) => {
  const [sound, setSound] = useState(new Howl({ src: [url] }));
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    setCurrentTime(sound.seek());
  };

  const handleSeek = (event: any, newTime: number | number[]) => {
    sound.seek(newTime as number);
    setCurrentTime(newTime as number);
  };

  return (
    <div>
      <Slider
        value={currentTime}
        max={sound.duration()}
        onChange={handleSeek}
        aria-label="Audio progress"
      />
    </div>
  );
};

export default AudioPlayer;