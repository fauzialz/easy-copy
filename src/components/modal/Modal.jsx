import React, {forwardRef, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Modal.scss'

const Modal = forwardRef(({openModal, onSubmit, onClose, form, onChangeTitle, onChangeText, btnOperations, addList, closeList, singularMultipleSwitch}, ref) => {
    const [openOptions, setOpenOptions] = useState(false)
    const [showAdd, setShowAdd] = useState(true)

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

    const onDelete = () => {
        btnOperations('deleted')
        checkOptions(onSubmit)
    }

    /* Delay add botton show after hit */
    const onAddList = () => {
        addList()
        setShowAdd(false)
        setTimeout(() => {
            setShowAdd(true)
        }, 2400);
    }

    const changeMode = () => {
        singularMultipleSwitch()
        setTimeout(() => {
            setOpenOptions(false)
        }, 200);
    }


    return (
        <div className={openModal? "modal-open" : "modal-close"}>
            <div className="modal-wrapper">
                <div className="modal-header">
                    <button className="modal-back-btn" onClick={() => checkOptions(onClose)}>
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>
                    {/* <div className="center-text">Easy Copy</div> */}
                    <button className={form.pinned ? "modal-pin-btn-on" : "modal-pin-btn-off" } onClick={() => btnOperations('pinned')}>
                        <FontAwesomeIcon icon="thumbtack" />
                    </button>
                </div>
                
                <input className="modal-title" placeholder="Title (optional)" value={form.title} onChange={onChangeTitle} />
                
                {!form.listContents?
                    <textarea ref={ref} 
                        autoFocus
                        className="modal-textarea"
                        placeholder="Text to copy"
                        value={form.contents[0].text}
                        onChange={onChangeText}
                        name="0"
                    />:
                    <div className="multipletext-slot">{
                        form.contents.map( (content, i) => (
                            <div className="multipletext-list" key={i}>
                                <input className="multipletext-text" autoFocus
                                    name={i}
                                    value={content.text}
                                    onChange={onChangeText}
                                />
                                <button className="multipletext-addinfo">
                                    <FontAwesomeIcon icon="info-circle" />
                                </button>
                                <button className="multipletext-close" onClick={() => closeList(i)}>
                                    <FontAwesomeIcon icon="times" />
                                </button>
                            </div>
                        ))
                    }
                        {showAdd?
                        <button className="mutlipletext-add" onClick={onAddList}>
                            <FontAwesomeIcon icon="plus" />
                            New Text
                        </button>
                        :null}
                    </div>
                }

                <div className="modal-footer">
                    <button className="modal-left-btn" onClick={() => setOpenOptions(!openOptions)}><FontAwesomeIcon icon="ellipsis-v" /></button>
                    <button className="modal-right-btn" onClick={() => checkOptions(onSubmit)}><FontAwesomeIcon icon="save" /></button>
                </div>
                <div className={openOptions? "modal-options-on" : "modal-options-off"}>
                    <button className="modal-options-btn" onClick={changeMode}>
                        <FontAwesomeIcon icon={!form.listContents? "cubes" : "cube"} />
                        {!form.listContents? 'Multiple Text' : 'Singular Text'}
                    </button>
                    <button className="modal-options-btn" onClick={onDelete}>
                        <FontAwesomeIcon icon="trash" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
})

export default Modal