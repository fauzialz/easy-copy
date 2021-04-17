import React, { useEffect, useRef, useState } from 'react'
import { useUserMedia } from '../../services/serviceMediaStream'
import { useOffsets } from '../../services/serviceOffset';
import './styles.scss'

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environtment" },
};

const Camera = ({onCapture, onClear}) => {
    const wrapperRef = useRef()
    const videoRef = useRef()
    const canvasRef = useRef()

    const [container, setContainer] = useState({ width: 0, height: 0 })
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true)
    const [isFlashing, setIsFlashing] = useState(false)

    const mediaStream = useUserMedia(CAPTURE_OPTIONS)
    // const offsets = useOffsets(
    //     videoRef.current && videoRef.current.videoWidth,
    //     videoRef.current && videoRef.current.videoHeight,
    //     container.width,
    //     container.height
    //   )
    
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    const handleCanPlay = () => {
        videoRef.current.play();
        setIsVideoPlaying(true);
        handleResize()
    }

    const handleCapture = () => {
        const context = canvasRef.current.getContext("2d")
        context.drawImage(
            videoRef.current,
            0,
            0,
            container.width,
            container.height,
        )
        
        canvasRef.current.toBlob(blob => onCapture(blob), "image/jpeg", 1);
        setIsCanvasEmpty(false);
        setIsFlashing(true);
    }

    const handleClear = () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCanvasEmpty(true);
        onClear();
    }

    const handleResize = () => {
        const { videoWidth, videoHeight } = videoRef.current
        const containerHeight = wrapperRef.current.offsetHeight
        const ratio = (containerHeight / videoHeight)
        setContainer({
            width: videoWidth * ratio,
            height: containerHeight ?? 0,
        })
    }

    useEffect(() => {
        handleResize()
    }, [])

    return (
        <div
            ref={wrapperRef}
            className='camera-wrapper'
        >
            <div className='camera-container'>
                <video
                    ref={videoRef}
                    onCanPlay={handleCanPlay}
                    autoPlay
                    playsInline
                    muted
                    style={{left: 0, top: 0, height: '100%'}}
                        
                    // style={{
                    //     top: `-${offsets.y}px`,
                    //     left: `-${offsets.x}px`
                    // }}
                    hidden={!isVideoPlaying}
                />
            </div>

            <div className='camera-container'>
                <canvas
                    ref={canvasRef}
                    width={container.width}
                    height={container.height}
                    style={{
                        height: '100%',
                    }}
                />
            </div>

            <div className='camera-container-btn'>
                <button
                    className='camera-btn'
                    onClick={isCanvasEmpty ? handleCapture : handleClear}
                />
            </div>
        </div>
    )
}

export default Camera