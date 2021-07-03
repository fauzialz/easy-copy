import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router';
import { useUserMedia } from '../../services/serviceMediaStream'
// import { useOffsets } from '../../services/serviceOffset';
import './styles.scss'

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "environment" },
};

const Camera = ({onCapture, onClear, onCameraStateChange, isVideoPlaying, isCapture, disabled}) => {
    const wrapperRef = useRef()
    const videoRef = useRef()
    const canvasRef = useRef()
    const history = useHistory()
    const { pathname } = useLocation()

    const [container, setContainer] = useState({ width: 0, height: 0 })
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true)
    const [isFlashing, setIsFlashing] = useState(false)

    const [mediaStream, err] = useUserMedia(CAPTURE_OPTIONS)
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
        onCameraStateChange('MEDIA_ONLINE');
        handleResize()
    }

    const handleCapture = () => {
        setIsFlashing(true)
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
        setTimeout(() => {
            setIsFlashing(false)
        }, 100);
    }

    const handleClear = useCallback( () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCanvasEmpty(true);
        onClear && onClear();
    }, [onClear])

    const handleReset = () => {
        history.replace(pathname)
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

    useEffect(() => {
        if (!isCapture) {
            handleClear()
        }
    }, [isCapture, handleClear])

    useEffect(() => {
        if (isVideoPlaying) return
        if (err) {
            onCameraStateChange('NO_MEDIA')
        } else {
            onCameraStateChange('LOADING')
        }
    }, [mediaStream, err, isVideoPlaying, onCameraStateChange])

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
                    hidden={!isVideoPlaying}
                />
            </div>

            <div className='camera-container'>
                <canvas
                    ref={canvasRef}
                    width={container.width || 0}
                    height={container.height}
                    style={{
                        height: '100%',
                    }}
                />
            </div>

            <div className={isFlashing && isVideoPlaying? 'camera-flash camera-flash-on' : 'camera-flash'} />

            <div className='camera-container-btn'>
                <button
                    className={!isVideoPlaying? 'camera-btn-hide' : 'camera-btn'}
                    onClick={isCanvasEmpty ? handleCapture : handleReset}
                    disabled={disabled}
                />
            </div>
            
            {/* Blcok camera view when disabled */}
            <div className={`camera-container camera-block-${disabled? 'on' : 'off'}`} />
        </div>
    )
}

export default Camera