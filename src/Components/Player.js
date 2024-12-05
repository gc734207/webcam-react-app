import React from "react";
import Control from "./Control";
import "./Player.css";

const Player = ({url}) => {
  const videoRef = React.useRef(null);
  const seekRef = React.useRef(null);
  const defaultResolution = 480;

  // Handler for the video whenever the time changes
  // Converts to a value on the seek bar, which bas a hard-coded value of 100
  function handleOnTimeUpdate() {
    if (seekRef) {
      const value = (100 / videoRef.current.duration) * videoRef.current.currentTime;
      seekRef.current.value = value;
    }
  }

  return (
    <div className="player-container">
      {url && 
        <>
          <h2>Video Preview</h2>
          <video
            src={url}
            ref={videoRef}
            width="auto"
            height={defaultResolution}
            onTimeUpdate={() => {handleOnTimeUpdate()}}
            className="player-video"/>
          {videoRef && 
            <Control
              videoRef={videoRef}
              defaultResolution={defaultResolution}
              seekRef={seekRef}/>}
        </>
      }
    </div>
  );
};

export default Player;