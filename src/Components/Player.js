import React from "react";
import Control from "./Control";

const Player = ({url}) => {
  const videoRef = React.useRef(null);
  const defaultResolution = 480;

  return (
    <div>
        {url && 
            <>
                <video src={url} ref={videoRef} width="auto" height={defaultResolution}/>
                {videoRef && <Control videoRef={videoRef} defaultResolution={defaultResolution}/>}
            </>
        }
    </div>
  );
};

export default Player;