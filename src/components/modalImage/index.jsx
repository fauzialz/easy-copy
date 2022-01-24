import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { createWorker } from 'tesseract.js'
import Camera from '../camera'
import LoadingSpinner from '../loadingSpinner'
import './styles.scss'
import OcrPanel, { OCR_STATUS } from '../ocrPanel'
import { clearForm, formContext, noteListContext, setForm, setFormNewId } from '../../store'
import { ModalConetent } from '../modal/ModalContent'
import { ModalImageFooter } from './ModalImageFooter'

const INPUT_TYPE = {
    FILE: 'file',
    CAMERA: 'camera',
}

const ModalImage = () => {
    const [openModal, setOpenModal] = useState(false)
    const [openOptions, setOpenOptions] = useState(false)

    // OCR STATUS
    const [ocrStatus, setOcrStatus] = useState(OCR_STATUS.IDLE)
    const [ocrMessage, setOcrMessage] = useState('')
    const [ocrInputType, setOcrInputType] = useState('')

    // CAMERA STATUS
    const [cameraState, setCameraState] = useState('LOADING')

    const history = useHistory()
    const location = useLocation()
    
    const mount = useRef(false)
    const inputRef = useRef()
    const workerRef = useRef()

    // PARAMS
    const query = queryString.parse(location.search)
    const capture = Boolean(query?.capture)
    const result = query?.result || ''

    const isVideoPlaying = cameraState === 'MEDIA_ONLINE'
    const cameraIsLoading = cameraState === 'LOADING'
    const noCamera = cameraState === 'NO_MEDIA'

    const ocrIsPreparing = ocrStatus === OCR_STATUS.PREPARING
    const ocrIsRunning = ocrStatus === OCR_STATUS.RUNNING
    const ocrIsDone = ocrStatus === OCR_STATUS.COMPLETE || result
    const ocrInputIsFile = ocrInputType === INPUT_TYPE.FILE

    // RESULT FORM
    const { form, dispatch } = useContext(formContext)
    const { noteList } = useContext(noteListContext)

    useEffect(() => {
        mount.current = true
        setOpenModal(true)
        return () => {
            mount.current = false
            const worker = workerRef.current
            if (worker) {
                worker.terminate()
            }
        }
    }, [])

    useEffect(() => {
        if (!result && ocrIsDone) {
            resetAllOcrState()
        }

        if (result) {
            dispatch(setFormNewId(noteList))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])

    useEffect(() => {
        if (!form.id || !!form.contents[0].text) return
        const temp = {...form}
        temp.contents[0].text = result
        dispatch(setForm(temp))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form])

    const resetAllOcrState = () => {
        setOcrStatus(OCR_STATUS.IDLE)
        setOcrInputType('')
        setOcrMessage('')
        // setOcrResult('')
    }

    const runOCR = async (scr, inputType) => {
        setOcrStatus(OCR_STATUS.PREPARING)
        setOcrInputType(inputType)
        setOcrMessage('Preparing...')

        const worker = createWorker({
            logger: m => {
                if (m?.jobId) {
                    setOcrStatus(OCR_STATUS.RUNNING)
                    const progress = Number(m.progress)
                    const message = `${Math.floor(progress.toFixed(2) * 100)}%`
                    setOcrMessage(message)
                }
            },
            errorHandler: m => {
                console.error('TESSERACT ERROR:\n', m)
            }
        })
        workerRef.current = worker
        
        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        const { data: { text } } = await worker.recognize(scr)
        await worker.terminate()

        if (!mount.current) {
            console.info('component unmounted')
            return
        }

        setOcrStatus(OCR_STATUS.COMPLETE)
        setOcrMessage('done')
        const params = queryString.stringify({ ...query, result : text})
        history.push(`${location.pathname}?${params}`)
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

    const getBackRoute = () => {
        if (!capture && !result) {
            return '/'
        }
        if (capture && result) {
            return `${location.pathname}?capture=true`
        }
        dispatch(clearForm())
        return location.pathname
    }    

    const onCloseHandler = () => {
        setOpenModal(capture || result)
        if (result) resetAllOcrState()
        setTimeout(() => {
            history.replace(getBackRoute())
        }, 200);
    }

    const onCaptureHandler = (blob) => {
        const url = URL.createObjectURL(blob)
        if(!url || (typeof url !== 'string')) return

        runOCR(url, INPUT_TYPE.CAMERA)
    }

    const readFile = (e) => {
        if (e.target.files) {
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.fileName = file.name
            reader.onload = e => {
                if (e.target) {
                    const url = e.target.result
                    if(!url || (typeof url !== 'string')) return
                    
                    let image = new Image()
                    image.addEventListener('load', (loadedImage) => {
                        let url = loadedImage.srcElement.src
                        runOCR(url, INPUT_TYPE.FILE)
                    })
                    image.src = url
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handlerCameraState = (status) => {
        setCameraState(status)
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

                {noCamera &&
                    <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div className="note">
                            No camera detected.<br/>
                            Convert a picture from your local storage instead.
                        </div>
                    </div>
                }

                {cameraIsLoading && 
                    <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <LoadingSpinner />
                    </div>
                }

                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, display:'flex', justifyContent: 'center'}}>
                    <Camera
                        onCapture={(blob) => {
                            onCaptureHandler(blob)
                            history.push(`${location.pathname}?capture=true`)
                        }}
                        onCameraStateChange={handlerCameraState}
                        isVideoPlaying={isVideoPlaying}
                        isCapture={capture}
                        disabled={ocrInputIsFile}
                    />
                </div>

                <div className={!isVideoPlaying? 'btn-file-socket-mid' : 'btn-file-socket'}>
                    <button
                        className='btn-img btn-file'
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.value = '';
                                inputRef.current.click();
                            }
                        }}
                        disabled={ocrIsPreparing || ocrIsRunning}
                    >
                            <FontAwesomeIcon icon='folder' />
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

            <OcrPanel
                status={ocrStatus}
                isDone={ocrIsDone}
                progress={ocrMessage}
            >
                {
                    ocrIsPreparing || ocrIsRunning
                    ? <div className='ocr-status'>
                        {
                            ocrIsPreparing
                                ? ocrMessage
                                : `Recognizing... (${ocrMessage})`
                        }
                    </div>
                    : null
                }
                    <div className='ocr-result' style={{display: ocrIsDone ? 'block' : 'none'}}>
                        <ModalConetent />
                        <ModalImageFooter />
                    </div>
            </OcrPanel>
        </div>
    )
}

export default ModalImage