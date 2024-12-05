import React from "react";
import Control from "./Control";
import "./Player.css";

const Player = ({url}) => {
  const videoRef = React.useRef(null);
  const seekRef = React.useRef(null);
  const defaultResolution = 480;

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