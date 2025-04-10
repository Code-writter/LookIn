
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Camera, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type FaceDetectionProps = {
  onFaceDetected?: (faceData: any) => void;
  onFaceRecognized?: (personName: string) => void;
  mode: "detection" | "recognition" | "registration";
  personName?: string;
};

const FaceDetection = ({ onFaceDetected, onFaceRecognized, mode, personName }: FaceDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false);
  const detectionInterval = useRef<number | null>(null);
  const { toast } = useToast();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsModelLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        ]);
        setIsModelLoading(false);
        toast({
          title: "Models loaded successfully",
          description: "Face detection models are ready to use",
        });
      } catch (error) {
        console.error("Error loading face-api models:", error);
        toast({
          variant: "destructive",
          title: "Error loading models",
          description: "Please refresh the page and try again",
        });
      }
    };
    loadModels();

    // Create the models directory and fetch models in production
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, [toast]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          setIsLoading(false);
          setIsCameraActive(true);
          startDetection();
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to use face detection",
      });
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    }
  };

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    detectionInterval.current = window.setInterval(async () => {
      if (isModelLoading) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current!.width, height: videoRef.current!.height };
      
      if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
        faceapi.matchDimensions(canvas, displaySize);
      }
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      if (detections.length > 0) {
        const detection = detections[0];
        if (onFaceDetected && mode === "registration") {
          onFaceDetected(detection);
        }
        
        if (mode === "registration" && detections.length === 1) {
          // If we're in registration mode and a face is detected, capture it
          if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
          }
          captureFace(detection);
        }
      }
    }, 100);
  };

  const captureFace = async (faceDetection: any) => {
    if (!videoRef.current) return;
    
    try {
      // For registration, we'd save this descriptor
      const fullFaceDescription = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
        
      if (fullFaceDescription) {
        if (onFaceDetected) {
          onFaceDetected({
            descriptor: Array.from(fullFaceDescription.descriptor),
            name: personName
          });
        }
        
        setCaptureComplete(true);
        toast({
          title: "Face captured successfully",
          description: "The face data has been stored",
        });
        
        // Stop the camera after successful capture
        setTimeout(() => {
          stopCamera();
        }, 1000);
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      toast({
        variant: "destructive",
        title: "Error capturing face",
        description: "Please try again",
      });
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="flex flex-col items-center overflow-hidden p-4">
      <div className="relative mb-4 h-[300px] w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
          </div>
        )}

        {isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100/80 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-neutral-600" />
            <p className="mt-2 text-sm text-neutral-600">Loading face detection models...</p>
          </div>
        )}

        <video
          ref={videoRef}
          width="100%"
          height="300"
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover ${isLoading || !isCameraActive ? "invisible" : "visible"}`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10"
          width="100%"
          height="300"
        />

        {captureComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100/80 backdrop-blur-sm">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-4 text-lg font-medium text-neutral-800">
              {mode === "registration" 
                ? "Face registered successfully!" 
                : "Face recognized!"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex w-full max-w-md justify-center space-x-4">
        {!isCameraActive ? (
          <Button onClick={startCamera} disabled={isModelLoading} className="flex items-center">
            <Camera className="mr-2 h-4 w-4" /> 
            {mode === "registration" ? "Capture Face" : "Recognize Face"}
          </Button>
        ) : (
          <Button variant="outline" onClick={stopCamera} className="flex items-center">
            Stop Camera
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FaceDetection;
