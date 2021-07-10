import classNames from "classnames"
import React, { ReactNode } from "react"
import './styles.scss'

export const OCR_STATUS = {
    IDLE: 'idle',
    PREPARING: 'preparing',
    RUNNING: 'running',
    COMPLETE: 'done',
} as const

type StatusKeys = keyof typeof OCR_STATUS
type OcrPanelProps = {
    children: ReactNode;
    status: typeof OCR_STATUS[StatusKeys];
    isDone: boolean;
    progress: string;
}

const OcrPanel = ({children, status, isDone, progress}: OcrPanelProps) => {
    const isPreparing = status === OCR_STATUS.PREPARING
    const isRunning = status === OCR_STATUS.RUNNING
    
    return (
        <div className={
            classNames('ocrPanel', {
                'ocrPanel--show': isPreparing || isRunning || isDone,
                'ocrPanel--spread': isDone,
            })
        }>
            <div className={
                classNames('ocrPanel__socket', {
                    'ocrPanel__socket--done': isDone,
                })
            }>
                {isPreparing || isRunning ?
                    <div className='ocrLoading'>
                        <div
                            className={
                                classNames('ocrLoading__line', {
                                    'ocrLoading__line--prepare': isPreparing,
                                })
                            }
                            style={{ width: isRunning ? progress: undefined}}
                        />
                    </div>: null
                }
                {children}
            </div>
        </div>
    )
}

export default OcrPanel