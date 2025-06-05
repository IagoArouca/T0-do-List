
import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward } from 'react-icons/fa'; 
import './MusicPlayer.css';

const tracks = [
  { id: 1, title: 'MadrugadaFria', artist: 'Blues,', src: '/music/madrugadafria.mp3' },
  { id: 2, title: 'Sol  de sábado', artist: 'Study Waves', src: '/music/track1.mp3' },
];

const MusicPlayer = () => {
  const audioRef = useRef(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [volume, setVolume] = useState(0.5); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); 
  const [isMuted, setIsMuted] = useState(false); 

  const currentTrack = tracks[currentTrackIndex]; 

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Erro ao tocar áudio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };


  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0); 
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setIsPlaying(true); 
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    setIsPlaying(true); 
  };

  const handleTrackEnded = () => {
    handleNextTrack();
  };

  return (
    <div className="music-player-bar">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleTrackEnded} 
      />

      <div className="track-info">
        <span>{currentTrack.title}</span> - <span>{currentTrack.artist}</span>
      </div>

      <div className="controls">
        <button onClick={handlePrevTrack} className="player-button">
          <FaStepBackward /> 
        </button>
        <button onClick={handlePlayPause} className="player-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNextTrack} className="player-button">
          <FaStepForward /> 
        </button>
        <button onClick={handleMuteToggle} className="player-button">
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />} 
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;