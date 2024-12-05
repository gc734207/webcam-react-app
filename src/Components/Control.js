import React from "react";
import "./Control.css";

const Control = ({videoRef, defaultResolution}) => {
  
  const playPauseRef = React.useRef(null);
  const stopRef = React.useRef(null);
  const seekRef = React.useRef(null);
  const [resolution, setResolution] = React.useState(defaultResolution);

  function handlePlayPause() {
    if (videoRef) {
      if ((videoRef.current.paused) || (videoRef.current.stopped)) {
        videoRef.current.play();
      }
      else {
        videoRef.current.pause();
      }
    }
  }

  function handleStop() {
    if (videoRef) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  React.useEffect(() => {
    if (videoRef) {
      videoRef.current.addEventListener('timeupdate', () => {
        const value = (100 / videoRef.current.duration) * videoRef.current.currentTime;
        seekRef.current.value = value;
      });
    }
  }, [videoRef])

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
            <input ref={seekRef} type="range" id="seekBar" value="0" max="100"/>

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
