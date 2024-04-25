import React, {useEffect, useRef, useState} from 'react';
import Webcam from "react-webcam";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import '@tensorflow/tfjs-backend-webgl';
import './LiveDetection.css'

let interval;
function LiveDetection() {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStartDetect, setIsStartDetect] = useState(false)
    const [result, setResult] = useState('');

    const videoConstraints = {
        width: 220,
        height: 200,
        facingMode: "user"
    };

    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);


    const runFacemesh = async () => {
        const model = facemesh.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
            runtime: "tfjs",
        };
        const detector = await facemesh.createDetector(
            model,
            detectorConfig
        );
        interval =  setInterval(() => {
            detect(detector);
        }, 5000);
    };

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const estimationConfig = {flipHorizontal: false};
            const face = await net.estimateFaces(video, estimationConfig);

            if (face.length > 0) {
                const imageSrc = webcamRef.current.getScreenshot();
                await getPredict(imageSrc);
            }
        }
    };

    function startDetect() {
        setIsStartDetect(true);
        runFacemesh();
    }
    function stopDetect() {
        setIsStartDetect(false);
        setResult('');
        clearInterval(interval);

    }

    async function getPredict(dataURL) {
        try {
            const byteCharacters = atob(dataURL.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('image', blob, 'imag.jpg');
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.prediction) {
                setResult(data.prediction);
                console.log('Image uploaded successfully.',data.prediction);
            } else {
                console.error('Image upload failed.');
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Fetch aborted: User clicked stop button");
            } else {
                console.error("Error uploading image:", error);
            }
        }
    }
    return (
        <div>
            <div className="App-body">

                {isStartDetect && (<Webcam className="Cam"
                                           ref={webcamRef}
                                           audio={false}
                                           screenshotFormat="image/jpeg"
                                           videoConstraints={videoConstraints}
                />)}

                {isStartDetect && (<canvas className="Cam"
                                           ref={canvasRef}/>
                )}

            </div>
            <div className="result-container">
                {result && (
                    <div className="result">Result is {result}</div>
                )}
            </div>

            <div className="App-footer">
                <div className="button-container">
                    <button onClick={startDetect}>Start</button>
                    <button onClick={stopDetect}>Stop</button>
                </div>
            </div>
        </div>
    );
}

export default LiveDetection;
