import { useEffect, useState } from "react"

export const useUserMedia = (requestedMedia) => {
    const [mediaStream, setMediaStream] = useState(null)

    useEffect(() => {
        const enableStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
                setMediaStream(stream)
            } catch (err) {
                console.error(err)
            }
        }

        const cleanup = () => {
            mediaStream.getTracks().forEach(track => {
                track.stop();
            })
        }

        if (!mediaStream) {
            enableStream()
        } else {
            return () => cleanup()
        }
    }, [mediaStream, requestedMedia])

    return mediaStream
}