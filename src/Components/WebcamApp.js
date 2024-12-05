import React from 'react';
import Webcam from 'react-webcam';
import './WebcamApp.css';
import Player from './Player';

const WebcamApp = () => {
  // Other Refs
  const mediaRecorderRef = React.useRef(null);

  // DOM Elements
  const webcamRef = React.useRef(null);
  const webcamAppContainerRef = React.useRef(null);
  const downloadRef = React.useRef(null);
  const selectRef = React.useRef(null);
  const webcamAppAreaErrorRef = React.useRef(null);

  // State
  const [resolution, setResolution] = React.useState({height:720});
  const [capturing, setCapturing] = React.useState(false);
  const [webcamReady, setWebcamReady] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [videoUrl, setVideoUrl] = React.useState(null);


  // Event listener for when receiving chunks from the webcam
  // Concatenates chunk to the array of existing chunks.
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  // Handler when starting video capture from webcam
  const handleStartCaptureClick = React.useCallback(() => {
    // Disable the resolution selection while capturing video as
    // changing the resolution updates the Webcam component,
    // which would cancel the recording.
    selectRef.current.disabled=true;

    // Reset recorded chunks to an empty array to record a new video
    // everytime this handler is invoked
    setRecordedChunks([]);

    // Set the capturing flag to true
    // This is used to determine if the start/stop button appears in the DOM
    setCapturing(true);

    // Record video stream
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    // Assign handler function whenever data is available for the media recorder
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  // Handler when stopping a video from recording
  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();

    // Set capturing flag to false to show a button to allow the user to start a new recording
    setCapturing(false);

    // Re-enable the ability to select resolution now that recording is stopped
    selectRef.current.disabled=false;
  }, [mediaRecorderRef, setCapturing]);
 
  // Detects if recordedChunks has values in it
  // and makes controls for download and showing a video of the recorded chunks
  // available
  React.useEffect(() => {
    if (recordedChunks.length > 0) {
      if (webcamAppContainerRef.current) {
        // Remove the current HTML that contains the video and download button
        // for any existing videos
        webcamAppContainerRef.current.innerHTML = '';
      }

      // Create a new blob to download/show in a video player
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);

      // Create an invisible link that gets clicked whenever the download button
      // is pressed
      const a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";

      // The download button at the top of the page can now be clicked
      // and will download the video recorded from the webcam
      downloadRef.current.onclick = function() {
        a.click();
      }
      downloadRef.current.disabled = false;

      // Add the link and video to the DOM
      webcamAppContainerRef.current.appendChild(a);
    }
  }, [recordedChunks]);

  // Handler for when the webcam is unavailable or an error has occurred trying to use it
  const handleUserMediaError = React.useCallback(() => {
    webcamAppAreaErrorRef.current.innerHTML = "Error loading webcam.";
  }, [webcamAppAreaErrorRef]);

  // Handler for when the webcam is ready to record and start sending data
  const handleUserMedia = React.useCallback(() => {
    setWebcamReady(true);
  }, [setWebcamReady]);

  // Handler for when a resolution is selecetd
  const handleResolutionSelection = React.useCallback((selected_resolution) => {
    // The Webcam component needs to reload, so it is set as not-ready until its
    // onUserMedia function is called
    setWebcamReady(false);

    // Setting the resolution will update the Webcam component, making it reload
    // with the selected resolution
    setResolution({ height: selected_resolution })
  }, [setWebcamReady, setResolution]);

  return (
    <div className="webcam-app-container">
      <h2>Webcam App</h2>
      <div className="webcam-app-global-controls">
        {capturing 
          ? <button onClick={handleStopCaptureClick}>Stop Capture</button>
          : 
          <>
            {webcamReady
              ? <button onClick={handleStartCaptureClick}>New Capture</button>
              : <button onClick={handleStartCaptureClick} disabled={true}>New Capture</button>
            }
          </>
        }
        <button ref={downloadRef} disabled={true}>Download</button>
        <select ref={selectRef} value={resolution.height} name="resolution" onChange={e => handleResolutionSelection(e.target.value)}>
          <option value="480">480P</option>
          <option value="720">720P</option>
          <option value="1080">1080P</option>
        </select>
      </div>
      <div className="webcam-app-area">
          <div ref={webcamAppAreaErrorRef}/>
          <Webcam
            videoConstraints={resolution}
            audio={false}
            ref={webcamRef}
            onUserMediaError={handleUserMediaError}
            onUserMedia={handleUserMedia}
            />
          <Player url={videoUrl}/>
          <div className="webcam-app-area-item" ref={webcamAppContainerRef}/>
      </div>
    </div>
   
  );
};

export default WebcamApp;