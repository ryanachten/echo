import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "@tensorflow/tfjs-backend-webgl";
import {
  BodyPix,
  drawBokehEffect,
  drawMask,
  load,
  SemanticPersonSegmentation,
  toMask,
} from "@tensorflow-models/body-pix";
import { VideoBackgroundMode } from "../constants/interfaces";
import {
  getBackgroundBlurAmount,
  getBackgroundMode,
  getEdgeBlurAmount,
  getMaskOpacity,
  getMaskBlurAmount,
} from "../selectors/backgroundSelector";
import styled from "styled-components";
import { SignalContext } from "../services/SignalService";
import {
  BackgroundState,
  initialBackgroundState,
} from "../reducers/backgroundSlice";
import { getVideoMuted } from "../selectors/callSelector";
import { CallState, initialCallState } from "../reducers/callSlice";

const FlippedCanvas = styled.canvas`
  transform: scaleX(-1);
`;

const VideoCanvas = () => {
  const signalContext = useContext(SignalContext);
  const [bodyPixNet, setBodyPixNet] = useState<BodyPix>();
  const audioTracksRef = useRef<Array<MediaStreamTrack>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>();
  const callStateRef = useRef<CallState>(initialCallState);
  const mutedVideo = useSelector(getVideoMuted);

  const backgroundMode = useSelector(getBackgroundMode);
  const backgroundStateRef = useRef<BackgroundState>(initialBackgroundState);
  const animationFrame = useRef<number>();
  const backgroundBlurAmount = useSelector(getBackgroundBlurAmount);
  const edgeBlurAmount = useSelector(getEdgeBlurAmount);
  const maskOpacity = useSelector(getMaskOpacity);
  const maskBlurAmount = useSelector(getMaskBlurAmount);

  useEffect(() => {
    init();
  }, []);

  // Trigger animation once body pix model has loaded
  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [bodyPixNet]);

  useEffect(() => {
    const video = videoRef.current;
    if (mutedVideo) {
      video?.pause();
    } else {
      video?.play();
    }
    callStateRef.current = {
      ...callStateRef.current,
      videoMuted: mutedVideo,
    };
  }, [mutedVideo]);

  // Apply call reducer state to ref to prevent stale state issues
  useEffect(() => {
    backgroundStateRef.current = {
      backgroundMode,
      backgroundBlurAmount,
      edgeBlurAmount,
      maskOpacity,
      maskBlurAmount,
    };
  }, [
    backgroundMode,
    backgroundBlurAmount,
    edgeBlurAmount,
    maskOpacity,
    maskBlurAmount,
  ]);

  async function init() {
    await requestUserMedia();

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    // Set canvas as stream source and initate peer connection
    const maxFrameRate = 25;
    const stream = canvasElement.captureStream(maxFrameRate);

    // Assign microphone audio output to stream
    audioTracksRef.current.forEach((track) => stream.addTrack(track));

    signalContext.stream = stream;
    signalContext.sendConnection();

    // Trigger loading of model once video metadata has loaded
    videoElement.onloadedmetadata = () => {
      // Not sure why, but the bokeh effect seems to set the video element height and width to 0
      // causing a canvas error - hence we cache these values to video dimensions on component mount
      videoElement.height = videoElement.videoHeight;
      videoElement.width = videoElement.videoWidth;

      // Set canvas dimensions to be the same as video (prevents having to scale as part of render method)
      if (canvasElement) {
        canvasElement.height = videoElement.videoHeight;
        canvasElement.width = videoElement.videoWidth;
      }
      loadModel();
    };
  }

  async function requestUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const tracks = stream.getAudioTracks();
    audioTracksRef.current = tracks;

    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.play();

    videoRef.current = video;
  }

  async function loadModel() {
    const net = await load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.5,
      quantBytes: 2,
    });

    setBodyPixNet(net);
  }

  async function animate() {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;

    // Does not receive updates from Redux store
    if (!canvas || !videoElement || !bodyPixNet) return;

    const backgroundMode = backgroundStateRef.current.backgroundMode;

    if (callStateRef.current.videoMuted) {
      clearFrame();
      animationFrame.current = requestAnimationFrame(animate);
      return;
    }

    // Return early if no effect selected to avoid awaiting segmentation
    if (backgroundMode === VideoBackgroundMode.None) {
      drawVideo();
      animationFrame.current = requestAnimationFrame(animate);
      return;
    }

    const segmentation = await bodyPixNet.segmentPerson(videoElement);

    switch (backgroundMode) {
      case VideoBackgroundMode.Mask:
        maskBackground(segmentation);
        break;

      case VideoBackgroundMode.Blur:
        blurBackground(segmentation);
        break;

      default:
      // Do nothing - shouldn't render canvas if no background effect selected
    }

    animationFrame.current = requestAnimationFrame(animate);
  }

  function clearFrame() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawVideo() {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && videoElement) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }
  }

  function blurBackground(segmentation: SemanticPersonSegmentation) {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    drawBokehEffect(
      canvas,
      videoElement,
      segmentation,
      backgroundStateRef.current.backgroundBlurAmount,
      backgroundStateRef.current.edgeBlurAmount
    );
  }

  function maskBackground(segmentation: SemanticPersonSegmentation) {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    const coloredPartImage = toMask(segmentation);

    drawMask(
      canvas,
      videoElement,
      coloredPartImage,
      backgroundStateRef.current.maskOpacity,
      backgroundStateRef.current.maskBlurAmount
    );
  }
  return <FlippedCanvas ref={canvasRef} />;
};

export default VideoCanvas;
