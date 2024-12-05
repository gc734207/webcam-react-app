import React from "react";
import "./Control.css";

const Control = ({videoRef, defaultResolution, seekRef}) => {
  const playPauseRef = React.useRef(null);
  const [resolution, setResolution] = React.useState(defaultResolution);
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Handler for when the video ends.
  // Used to guarantee the play/pause button is a play button.
  const handleEnded = React.useCallback(() => {
    playPauseRef.current.classList.remove("control-pause");
    playPauseRef.current.classList.add("control-play");
  }, [videoRef])

  // Handler for the play/pause button
  // Changes the play/pause button corresponding to if the video is paused/playing
  // Sets state for playing to true/false to determine if the video should continue
  // playing when using the seek bar.
  const handlePlayPause = React.useCallback(() => {
    if (videoRef) {
      if ((videoRef.current.paused) || (videoRef.current.stopped)) {
        // Assign the handler for ended whenever play is pressed
        videoRef.current.onended = handleEnded;

        // Play the video
        videoRef.current.play();

        // Change the play/pause button to pause
        playPauseRef.current.classList.add("control-pause");
        playPauseRef.current.classList.remove("control-play");

        // Sets state to true to use when seeking
        // Video will continue to play after seeking is finished.
        setIsPlaying(true);
      }
      else {
        // Pause the video
        videoRef.current.pause();

        // Change the play/pause button to play
        playPauseRef.current.classList.remove("control-pause");
        playPauseRef.current.classList.add("control-play");

        // Sets state to false to use when seeking. Video will not continue
        // playing after seeking is finished.
        setIsPlaying(false);
      }
    }
  }, [setIsPlaying, videoRef]);

  // Handler for the stop button. Sets the video back to the beginning and pauses.
  // Ensures the play button is displayed instead of the pause button.
  function handleStop() {
    if (videoRef) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      playPauseRef.current.classList.remove("control-pause");
      playPauseRef.current.classList.add("control-play");
    }
  }

  // Handler for seeking
  // Converts the area on the bar to an actual time based on the video's duration
  const handleSeekInput = React.useCallback(() => {
    const seekTime = (videoRef.current.duration / 100) * seekRef.current.value;
    videoRef.current.currentTime = seekTime;

  }, [videoRef, seekRef]);

  // Handler for mouse release on the seek bar
  // Resumes playing if the video was playing before
  // interaction with the seek bar
  const handleSeekMouseUp = React.useCallback(() => {
    if (isPlaying) {
      videoRef.current.play();
    }
  }, [videoRef, isPlaying]);

  // Handler for mouse down on the seek bar
  // Pauses the video during the seek
  const handleSeekMouseDown = React.useCallback(() => {
    videoRef.current.pause();
  }, [videoRef]);

  // Handler for selecting the resolution
  // The height is changed, and the width is auto, so the aspect ratio is preserved
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
