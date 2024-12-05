import React from "react";
import "./Control.css";

const Control = ({videoRef, defaultResolution, seekRef}) => {
  const playPauseRef = React.useRef(null);
  const [resolution, setResolution] = React.useState(defaultResolution);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleEnded = React.useCallback(() => {
    playPauseRef.current.classList.remove("control-pause");
    playPauseRef.current.classList.add("control-play");
  }, [videoRef])

  const handlePlayPause = React.useCallback(() => {
    if (videoRef) {
      if ((videoRef.current.paused) || (videoRef.current.stopped)) {
        videoRef.current.onended = handleEnded;
        videoRef.current.play();
        playPauseRef.current.classList.add("control-pause");
        playPauseRef.current.classList.remove("control-play");
        setIsPlaying(true);
      }
      else {
        videoRef.current.pause();
        playPauseRef.current.classList.remove("control-pause");
        playPauseRef.current.classList.add("control-play");
        setIsPlaying(false);
      }
    }
  }, [setIsPlaying, videoRef]);

  function handleStop() {
    if (videoRef) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      playPauseRef.current.classList.remove("control-pause");
      playPauseRef.current.classList.add("control-play");
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
              <button ref={playPauseRef} className="control-play"></button>
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
