import React from "react";
import "./Control.css";

const Control = ({videoRef, defaultResolution, seekRef}) => {
  
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
            <div onClick={handlePlayPause} className="control-button control-square">
              <button className="control-play"></button>
              <span/>
            </div>
            <div onClick={handleStop} className="control-button control-square">
              <button className="control-stop"></button>
              <span/>
            </div>
            <div className="control-seekbar-container">
              <input
                ref={seekRef}
                type="range"
                className="control-seekbar"
                max="100"
                onChange={handleSeekInput}
                onMouseDown={handleSeekMouseDown}
                onMouseUp={handleSeekMouseUp}/>
            </div>
            <div>
              <select className="control-select" value={resolution} name="resolution" onChange={e => handleResolutionSelection(e.target.value)}>
                <option value="480">480P</option>
                <option value="720">720P</option>
                <option value="1080">1080P</option>
              </select>
            </div>
          </div>
        </>
      }
    </div>

  );
};

export default Control;
