import React, {forwardRef} from 'react'

const Modal = forwardRef(({openModal, onSubmit, onClose, form, onChangeTitle, onChangeText}, ref) => {
    return (
        <div className={openModal? "modal-open" : "modal-close"}>
            <div className="modal-wrapper">
                <button className="modal-left-btn" onClick={onClose}>Cancel</button>
                <button className="modal-right-btn" onClick={onSubmit}>Save</button>
                
                <input className="modal-title" placeholder="Title (optional)" value={form.title} onChange={onChangeTitle} />
                <textarea ref={ref} className="modal-textarea" placeholder="Text to copy" value={form.contents[0].text} onChange={onChangeText} />
            </div>
        </div>
    )
})

export default Modal