import React, { useState, useContext, useRef } from 'react'
import localforage from 'localforage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formContext, setForm, noteListContext } from '../../store'
import LOCAL from '../../config'
import './Modal.scss'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ModalFooter } from './ModalFooter'
import { ModalConetent } from './ModalContent'

const Modal = () => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const {form, dispatch} = useContext(formContext)
    const [openOptions, setOpenOptions] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const inputRef = useRef(null)
    const history = useHistory()

    useEffect(() => {
        if(form.id === '') {
            history.replace('/')
            return
        }
        setOpenModal(true)
        if(!form.newEntry) return
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100);
         // eslint-disable-next-line
    }, [])

    const onCloseHandler = () => {
        setOpenModal(false)
        setTimeout(() => {
            history.replace('/')
        }, 200);
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

    /* On pinned button hit */
    const onPin = () => {
        let formTemp = {...form}

        // if new entry no need to direcly change DB
        if(formTemp.newEntry) {
            formTemp.pinned = !formTemp.pinned
            dispatch(setForm(formTemp))
            return
        }
        
        /* Change pinned value on edit direcly change DB. */
        let noteListTemp = [...noteList]
        formTemp.pinned = !formTemp.pinned
        dispatch(setForm(formTemp))
        for(let i in noteListTemp) {
            if(noteListTemp[i].id === formTemp.id) {
                noteListTemp[i].pinned = formTemp.pinned
            }
        }
        localforage.setItem(LOCAL.tableName, noteListTemp).then( res => {
            setNoteList(res)
        })
    }

    return (
        <div className={openModal? "modal-open" : "modal-close"}>
            <div className="modal-wrapper">

                {/* MODAL HEADER SESSION */}
                <div className="modal-header">

                    {/* BACK BUTTON */}
                    <button
                        className="modal-back-btn" 
                        onClick={() => checkOptions(onCloseHandler)} >
                        <FontAwesomeIcon icon="arrow-left" />
                    </button>

                    {/* PIN BUTTON */}
                    <button 
                        className={form.pinned ? "modal-pin-btn-on" : "modal-pin-btn-off" } 
                        onClick={onPin} >
                        <FontAwesomeIcon icon="thumbtack" />
                    </button>
                </div>

                <ModalConetent ref={inputRef} />

                {/* FOOTER SESSION */}
                <ModalFooter onClose={onCloseHandler} />
            </div>
        </div>
    )
}

export default Modal