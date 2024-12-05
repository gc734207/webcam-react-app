import React from 'react';
import Webcam from 'react-webcam';
import './WebcamApp.css';

const WebcamApp = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const webcamAppContainerRef = React.useRef(null);
  const downloadRef = React.useRef(null);
  const selectRef = React.useRef(null);
  const [resolution, setResolution] = React.useState({width:720});
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
    selectRef.current.disabled=true;
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
    selectRef.current.disabled=false;
  }, [mediaRecorderRef, setCapturing]);
 
  React.useEffect(() => {
    if (recordedChunks.length > 0) {
      if (webcamAppContainerRef.current) {
        webcamAppContainerRef.current.innerHTML = '';
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

      downloadRef.current.onclick = function() {
        a.click();
      }
      downloadRef.current.disabled = false;

      const video = document.createElement("video");
      const source = document.createElement("source");
      video.setAttribute("controls","controls");
      source.src = url;
      video.appendChild(source);
      video.appendChild(source);

      webcamAppContainerRef.current.appendChild(div);
      div.appendChild(a);
      div.appendChild(video);
    }
  }, [recordedChunks]);

  return (
    <div>
      <div className="webcam-app-global-controls">
        {capturing 
          ? <button onClick={handleStopCaptureClick}>Stop Capture</button>
          : <button onClick={handleStartCaptureClick}>New Capture</button>
        }
        <button ref={downloadRef} disabled={true}>Download</button>
        <select ref={selectRef} value={resolution.width} name="resolution" onChange={e => setResolution({ width: e.target.value })}>
          <option value="480">480P</option>
          <option value="720">720P</option>
          <option value="1080">1080P</option>
        </select>
      </div>
      <div className="webcam-app-area">
          <Webcam videoConstraints={resolution} audio={false} ref={webcamRef} />
        <div className="webcam-app-area-item" ref={webcamAppContainerRef}/>
      </div>
    </div>
   
  );
};

export default WebcamApp;