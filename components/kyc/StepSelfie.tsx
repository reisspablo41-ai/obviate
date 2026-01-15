'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Camera, RefreshCw, Check, AlertCircle, Upload } from 'lucide-react'
import { KYCFormData } from './StepBasicInfo'

interface StepProps {
    formData: KYCFormData
    updateFormData: (data: Partial<KYCFormData>) => void
    onSubmit: () => void
    onBack: () => void
}

export default function StepSelfie({ formData, updateFormData, onSubmit, onBack }: StepProps) {
    const [capturedImage, setCapturedImage] = useState<File | null>(formData.selfieImage)
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const startCamera = async () => {
        try {
            setCameraError(null)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setIsCameraOpen(true)
            setCapturedImage(null)
        } catch (err) {
            console.error("Camera Error:", err)
            setCameraError("Unable to access camera. Please allow camera permissions to verify your identity.")
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsCameraOpen(false)
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')

            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Convert to blob/file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
                        setCapturedImage(file)
                        updateFormData({ selfieImage: file })
                        stopCamera()
                    }
                }, 'image/jpeg', 0.8)
            }
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Liveness Check</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Take a live photo to verify you match your ID.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
                {cameraError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        {cameraError}
                    </div>
                )}

                <div className="relative w-64 h-64 rounded-full overflow-hidden bg-gray-100 border-4 border-emerald-500 shadow-xl">
                    {/* State 1: Camera Open */}
                    {isCameraOpen && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                        />
                    )}

                    {/* State 2: Image Captured */}
                    {!isCameraOpen && capturedImage && (
                        <div className="relative w-full h-full">
                            <img
                                src={URL.createObjectURL(capturedImage)}
                                alt="Selfie Preview"
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Check className="w-16 h-16 text-emerald-400 drop-shadow-md" />
                            </div>
                        </div>
                    )}

                    {/* State 3: Idle / Placeholder */}
                    {!isCameraOpen && !capturedImage && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <Camera className="w-16 h-16 mb-2" />
                            <span className="text-sm font-medium">Camera Off</span>
                        </div>
                    )}
                </div>

                {/* Hidden Canvas for Capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(input) => {
                        // We use a callback ref or just an ID if strictly needed, 
                        // but since we need to trigger it, let's add a ref to the component scope.
                        // Actually, let's add `fileInputRef` to the component top level first.
                        // Since I can't easily add the ref declaration in this chunk without replacing the whole file,
                        // I will use a simple ID "selfie-upload" and getElementById or just strictly replace the whole file for safety if needed.
                        // But wait, I can just use a label or a direct click handler on a hidden input if I could ref it.
                        // Let's modify the top of the file to add the ref, then this chunk.
                        // For now, I'll use a label hack or just add the input here and use document.getElementById in a pinch, 
                        // OR better, I'll rewrite the controls section to include the input and the handler.
                    }}
                    id="selfie-upload"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0]
                            setCapturedImage(file)
                            updateFormData({ selfieImage: file })
                            stopCamera()
                        }
                    }}
                />

                {/* Controls */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <div className="flex justify-center gap-3">
                        {!isCameraOpen && !capturedImage && (
                            <>
                                <button
                                    onClick={startCamera}
                                    className="py-2 px-6 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                                >
                                    <Camera className="w-4 h-4" /> Start Camera
                                </button>
                                <label
                                    htmlFor="selfie-upload"
                                    className="py-2 px-6 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                    <Upload className="w-4 h-4" /> Upload
                                </label>
                            </>
                        )}

                        {isCameraOpen && (
                            <button
                                onClick={capturePhoto}
                                className="py-2 px-6 bg-white text-emerald-600 border-2 border-emerald-600 rounded-full font-medium hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2"
                            >
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div> Capture
                            </button>
                        )}

                        {capturedImage && !isCameraOpen && (
                            <div className="flex gap-2">
                                <button
                                    onClick={startCamera}
                                    className="py-2 px-4 text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-2 transition-colors text-sm"
                                >
                                    <Camera className="w-4 h-4" /> Retake Camera
                                </button>
                                <label
                                    htmlFor="selfie-upload"
                                    className="py-2 px-4 text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-2 transition-colors text-sm cursor-pointer"
                                >
                                    <RefreshCw className="w-4 h-4" /> Re-upload
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
                <div className="shrink-0 pt-0.5">💡</div>
                <p>
                    Please ensure good lighting and look directly at the camera. No hats or sunglasses.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 px-4 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={!capturedImage}
                    className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Verification
                </button>
            </div>
        </div>
    )
}
