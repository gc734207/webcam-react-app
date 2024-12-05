import React from "react";
import Control from "./Control";

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
    <div>
      {url && 
        <>
          <video src={url} ref={videoRef} width="auto" height={defaultResolution} onTimeUpdate={() => {handleOnTimeUpdate()}}/>
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