import React, {forwardRef, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Singular from './mode/Singular'
import Multiple from './mode/Multiple'
import './Modal.scss'

const Modal = forwardRef(({
    openModal, onSubmit, onClose,
    form, onChangeTitle, onChangeText,
    btnOperations, addList, closeList,
    singularMultipleSwitch, onPin, infoSwitch,
    onFocus, onInfoBlur }, ref ) => {
        
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

    /* On delete button hit*/
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

    /* Swithcing mode singular/multiple input handler */
    const changeMode = () => {
        singularMultipleSwitch()
        setTimeout(() => {
            setOpenOptions(false)
        }, 200);
    }

    return (
        <div className={openModal? "modal-open" : "modal-close"}>
            <div className="modal-wrapper">

                {/* MODAL HEADER SESSION */}
                <div className="modal-header">

                    {/* BACK BUTTON */}
                    <button
                        className="modal-back-btn" 
                        onClick={() => checkOptions(onClose)} >
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>

                    {/* PIN BUTTON */}
                    <button 
                        className={form.pinned ? "modal-pin-btn-on" : "modal-pin-btn-off" } 
                        onClick={onPin} >
                        <FontAwesomeIcon icon="thumbtack" />
                    </button>
                </div>
                
                {/* CONTENT TITLE */}
                <input 
                    className="modal-title"
                    placeholder="Title (optional)"
                    value={form.title}
                    onChange={onChangeTitle}
                />
                
                {/* INPUT MODE SESSION */}
                {!form.listContents?

                    /* SIUNGLAR INPUT TEXT */
                    <Singular
                        ref={ref}
                        form={form}
                        onChange={onChangeText}
                    /> 
                    :
                    /* MULITPLE INPUT TEXT */
                    <Multiple
                        form={form}
                        onChange={onChangeText}
                        infoSwitch={infoSwitch}
                        closeList={closeList}
                        showAdd={showAdd}
                        onAddList={onAddList}
                        onFocus={onFocus}
                        onInfoBlur={onInfoBlur}
                    />
                }

                {/* FOOTER SESSION */}
                <div className="modal-footer">

                    {/* OPTIONS BUTTON */}
                    <button 
                        className="modal-left-btn" 
                        onClick={() => setOpenOptions(!openOptions)}>
                        <FontAwesomeIcon icon="ellipsis-v" />
                    </button>

                    {/* SAVE BUTTON */}
                    <button
                        className="modal-right-btn"
                        onClick={() => checkOptions(onSubmit)}>
                        <FontAwesomeIcon icon="save" />
                    </button>
                </div>

                {/* OPTIONS TILE SESSION */}
                <div className={openOptions? "modal-options-on" : "modal-options-off"}>
                    
                    {/* CHANGE INPUT MODE BUTTON */}
                    <button 
                        className="modal-options-btn" 
                        onClick={changeMode}>
                        <FontAwesomeIcon icon={!form.listContents? "cubes" : "cube"} />
                        {!form.listContents? 'Multiple Text' : 'Singular Text'}
                    </button>

                    {/* DELETE BUTTON */}
                    <button 
                        className="modal-options-btn"
                        onClick={onDelete}>
                        <FontAwesomeIcon icon="trash" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
})

export default Modal