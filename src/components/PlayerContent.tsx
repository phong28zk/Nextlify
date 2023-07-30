"use client"

import { Song } from '../types'
import React, { useEffect, useRef, useState } from 'react'

import usePlayer from '@/hooks/usePlayer';
import { Howl } from 'howler';

import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';

import Slider from '@mui/material/Slider';
import LikeButton from './LikeButton';
import MediaItem from './MediaItem';



interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  
    const player = usePlayer();
    const [volume, setVolume] = useState(70);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [pausedTime, setPausedTime] = useState<number>(0);
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;

  
    const onPlayNext = () => {
        if(player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if(!nextSong) { 
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if(player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if(!previousSong) { 
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    }

    const sound = useRef<Howl | null>(null);
    useEffect(() => {
        if(sound.current) {
            sound.current.stop();
        }
    
        sound.current = new Howl({
            src: [songUrl],
            html5: true,
            format: ['mp3', 'wav', 'aac', 'ogg'],
            volume: volume / 100,
            autoplay: true,
            onpause: () => {
                setIsPlaying(false);
                setPausedTime(sound.current?.seek() || 0);
            },
            onplay: () => {
                setIsPlaying(true);
            },
            onload: () => {
                setDuration(sound.current?.duration() || 0);
            },
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            }
        });
    
        sound.current.once('load', () => {
            sound.current?.play();
        });
    
        return () => {
            sound.current?.unload();
        };
    }, [songUrl]);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setCurrentTime(Math.ceil(sound.current?.seek() || 0));
        }, 1000);

        return () => {
            clearInterval(intervalID);
        }
    }, [sound.current]);

    const handlePlay = () => {
        if(!isPlaying) {
            sound.current?.play();
            if(pausedTime) {
                sound.current?.seek(pausedTime);
                setCurrentTime(pausedTime);
                setPausedTime(0);
            }
        } else {
            sound.current?.pause();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if(volume === 0) 
        {
            setVolume(70);            
        }
        else setVolume(0);
    }

    const minutesDuration = Math.floor(duration / 60).toString().padStart(2, '0');
    const secondsDuration = Math.ceil(duration % 60).toString().padStart(2, '0');
    const DurationTime = `${minutesDuration}:${secondsDuration}`;
    const minutesCurrentTime = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const secondsCurrentTime = Math.ceil(currentTime % 60).toString().padStart(2, '0');
    const CurrentTime = `${minutesCurrentTime}:${secondsCurrentTime}`;
    return (
    <div className='grid grid-cols-2 md:grid-cols-3 h-full'>
        <div className='flex w-full justify-start'>
            <div className='flex items-center gap-x-4'>
                <MediaItem data={song} />
                <LikeButton songId={song.id} />
            </div>
        </div>
        
        <div className='flex md:hidden col-auto w-full justify-end items-center'>
            <div
                onClick={handlePlay} 
                className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'>
                <Icon size={30} className='text-black'/>
            </div>
        </div>
        <div className='flex flex-col'>
            <div className='hidden h-full md:flex justify-center items-center w-full max-w-[720px] gap-x-6'>
                <AiFillStepBackward onClick={onPlayPrevious} size={30} className='text-neutral-400 cursor-pointer hover:text-white transition'/>
                <div
                    onClick={handlePlay}
                    className='flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer'
                >
                    <Icon size={30} className='text-black'/>
                </div>
                <AiFillStepForward onClick={onPlayNext} size={30} className='text-neutral-400 cursor-pointer hover:text-white transition'/>
            </div>
            <div className='flex flex-row'>
                <div className='px-4'>
                    <span className='text-white'>
                        {CurrentTime}
                    </span>  
                </div>
                
                <Slider
                    value={currentTime}
                    max={duration}
                    aria-label="Time"
                    valueLabelDisplay="off"
                    sx={{
                        color: 'white',
                        '& .MuiSlider-valueLabel': {
                            color: 'white',
                        },
                        '& .MuiSlider-track': {
                            color: 'white',
                        },
                    }}
                />
                <div className='px-4'>
                    <span className='text-white'>
                        {DurationTime}
                    </span>  
                </div>
            </div>
            
        </div>
        <div className='hidden md:flex w-full justify-end pr-2'>
            <div className='flex items-center gap-x-2 w-[120px]'>
                <div
                    onClick={toggleMute}
                    className='cursor-pointer pr-2'
                >
                    {volume === 0 ? <HiSpeakerXMark size={30}/> : <HiSpeakerWave size={30}/> }
                </div>

                <Slider
                    value={volume}
                    defaultValue={70}
                    aria-label="Volume"
                    valueLabelDisplay="off"
                    onChange={(_event, value) => setVolume(value as number)}
                    sx={{
                        color: 'white',
                        '& .MuiSlider-valueLabel': {
                            color: 'white',
                        },
                        '& .MuiSlider-track': {
                            color: 'white',
                        },
                    }}
                />

            </div>
        </div>
        
    </div>
  )
}

export default PlayerContent;