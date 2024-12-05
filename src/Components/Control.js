import React from "react";
import "./Control.css";

const Control = ({videoRef, defaultResolution, seekRef}) => {
  
  const playPauseRef = React.useRef(null);
  const stopRef = React.useRef(null);
  const [resolution, setResolution] = React.useState(defaultResolution);
  const [isPlaying, setIsPlaying] = React.useState(false);


  const handlePlayPause = React.useCallback(() => {
    if (videoRef) {
      if ((videoRef.current.paused) || (videoRef.current.stopped)) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [setIsPlaying, videoRef]);

  function handleStop() {
    if (videoRef) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  const handleSeekInput = React.useCallback(() => {

    const seekTime = (videoRef.current.duration / 100) * seekRef.current.value;
    videoRef.current.currentTime = seekTime;

  }, [videoRef, seekRef]);

  const handleSeekMouseUp = React.useCallback(() => {
    if (isPlaying) {
      videoRef.current.play();
    }
  }, [videoRef, isPlaying]);

  const handleSeekMouseDown = React.useCallback(() => {
    videoRef.current.pause();
  }, [videoRef]);

  function handleResolutionSelection(resolution_value) {
    if (videoRef) {
      videoRef.current.height = resolution_value;
      setResolution(resolution_value);
    }
  }

  return (
    <div className="control">
      {videoRef && 
        <>
          <div className="control-buttons">
            <button ref={playPauseRef} onClick={handlePlayPause}>Play</button>
            <button ref={stopRef} onClick={handleStop}>Stop</button>
            <input
              ref={seekRef}
              type="range"
              className="control-seekbar"
              max="100"
              onChange={handleSeekInput}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}/>

            <select value={resolution} name="resolution" onChange={e => handleResolutionSelection(e.target.value)}>
              <option value="480">480P</option>
              <option value="720">720P</option>
              <option value="1080">1080P</option>
            </select>
          </div>
        </>
      }
    </div>

  );
};

export default Control;
