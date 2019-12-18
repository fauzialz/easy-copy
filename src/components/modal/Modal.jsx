import React, {forwardRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Modal.scss'

const Modal = forwardRef(({openModal, onSubmit, onClose, form, onChangeTitle, onChangeText, onPinButton}, ref) => {
    return (
        <div className={openModal? "modal-open" : "modal-close"}>
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={onClose}>
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>
                    {/* <div className="center-text">Easy Copy</div> */}
                    <button className={form.pinned ? "modal-pin-btn-on" : "modal-pin-btn-off" } onClick={onPinButton}>
                        <FontAwesomeIcon icon="thumbtack" />
                    </button>
                </div>
            <div className="modal-wrapper">
                <button className="modal-left-btn" /* onClick={onClose} */><FontAwesomeIcon icon="ellipsis-v" /></button>
                <button className="modal-right-btn" onClick={onSubmit}><FontAwesomeIcon icon="save" /></button>
                
                <input className="modal-title" placeholder="Title (optional)" value={form.title} onChange={onChangeTitle} />
                <textarea ref={ref} className="modal-textarea" placeholder="Text to copy" value={form.contents[0].text} onChange={onChangeText} />
            </div>
        </div>
    )
})

export default Modal