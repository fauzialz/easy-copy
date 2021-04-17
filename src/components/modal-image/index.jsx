import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createWorker } from 'tesseract.js'
import Camera from '../camera'
import './styles.scss'

const ModalImage = () => {
    const [openModal, setOpenModal] = useState(false)
    const [openOptions, setOpenOptions] = useState(false)
    const [ocrResult, setOcrResult] = useState('')
    const history = useHistory()
    const mount = useRef(false)

    const inputRef = useRef()

    useEffect(() => {
        mount.current = true
        setOpenModal(true)
        return () => {
            mount.current = false
        }
    }, [])

    const worker = createWorker({
        logger: m => {
            console.log(m)
            if (m?.jobId) {
                const progress = Number(m.progress)
                const message = `recognizing... (${progress.toFixed(2) * 100}%)`
                setOcrResult(message)
            }
        },
    })

    const runOCR = async (scr) => {
        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        const { data: { text } } = await worker.recognize(scr)
        if (!mount.current) {
            console.log('component unmounted')
            return
        }
        setOcrResult(text)
    }

    /*  To make the user see that
        options was closed first
        before modal close   */
    const checkOptions = fun => {
        if(openOptions) {
            setOpenOptions(false)
            setTimeout(() => {
                fun()
            }, 200);
        }else fun()
    }

    const onCloseHandler = () => {
        setOpenModal(false)
        // onClose()
        setTimeout(() => {
            history.replace('/')
            // dispatch(clearForm())
        }, 200);
    }

    const readFile = (e) => {
        if (e.target.files) {
            const file = e.target.files[0];
            // const allowedExt = ['image/png', 'image/jpg', 'image/jpeg'];
            // debugger
            // if (!allowedExt.includes(file.type)) return;

            const reader = new FileReader();

            reader.fileName = file.name
            reader.onload = e => {
                if (e.target) {
                    const url = e.target.result
                    if(!url || (typeof url !== 'string')) return
                    
                    let image = new Image()
                    image.addEventListener('load', (loadedImage) => {
                        let url = loadedImage.srcElement.src
                        setOcrResult('preparing...')
                        runOCR(url)
                    })
                    image.src = url
                }
            };
            // debugger
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className={openModal? "modal-open" : "modal-close"}>
            <div className="modal-wrapper" style={{position: 'relative'}}>
                {/* MODAL HEADER SECTION */}
                <div className="modal-header" style={{position: 'absolute', top:0, left: 0, zIndex: 2}}>

                    {/* BACK BUTTON */}
                    <button
                        className="modal-back-btn btn-img"
                        onClick={() => checkOptions(onCloseHandler)} >
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>

                </div>

                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, display:'flex', justifyContent: 'center'}}>
                    <Camera
                        onCapture={(blob) => {
                            console.log(blob)
                        }}
                        onClear={() => {
                            
                        }}
                    />
                </div>

                <div style={{padding: 20}}>
                    {ocrResult}
                </div>

                <div style={{position: 'fixed', bottom: 0, padding: 10}}>
                    <button
                        style={{ color: 'white', }}
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.value = '';
                                inputRef.current.click();
                            }
                        }}>
                        select image
                    </button>
                </div>
            </div>

            <input
                ref={inputRef}
                type='file'
                style={{ display: 'none'}}
                onChange={readFile}
                accept='image/*'
            />
        </div>
    )
}

export default ModalImage