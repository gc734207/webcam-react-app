import React from 'react';
import Webcam from 'react-webcam';
import './WebcamApp.css';

const WebcamApp = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const videoToolsArea = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);


  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setRecordedChunks([]);
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  React.useEffect(() => {
    if (recordedChunks.length > 0) {
      if (videoToolsArea.current) {
        videoToolsArea.current.innerHTML = '';
        videoToolsArea.current.remove();
      }

      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const div = document.createElement("div");

      const a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";

      const button = document.createElement("button");
      button.onclick = function() {
        a.click();
      }
      button.textContent = "Download";

      const video = document.createElement("video");
      const source = document.createElement("source");
      video.setAttribute("controls","controls");
      source.src = url;
      video.appendChild(source);
      video.appendChild(source);

      document.body.appendChild(div);
      div.appendChild(a);
      div.appendChild(button);
      div.appendChild(video);
      videoToolsArea.current = div;
    }
  }, [recordedChunks]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} />
      {capturing 
        ? <button onClick={handleStopCaptureClick}>Stop Capture</button>
        : <button onClick={handleStartCaptureClick}>New Capture</button>
      }
    </>
  );
};

export default WebcamApp;