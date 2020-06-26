import React, {forwardRef, useState, useContext} from 'react'
import localforage from 'localforage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Singular from './mode/Singular'
import Multiple from './mode/Multiple'
import { formContext, setForm, noteListContext } from '../../store'
import LOCAL from '../../config'
import { Form, Str } from '../../services'
import { makeContent } from '../../model';
import './Modal.scss'

const Modal = forwardRef(({ openModal, onClose }, ref ) => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const {form, dispatch} = useContext(formContext)
    const [openOptions, setOpenOptions] = useState(false)

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

    /* Change title handler */
    const onChangeTitle = e => {
        let temp = {...form} 
        temp.title = e.target.value
        dispatch(setForm(temp))
    }

    /* Change content text and info handler */
    const onChangeText = e => {
        let temp = {...form}
        let node = e.target.name.split('-')
        if(node[1] === 'info') {
            if(e.target.value.length <= LOCAL.infoLength) {
              temp.contents[node[0]][node[1]] = e.target.value
            }
        }else temp.contents[node[0]][node[1]] = e.target.value
        dispatch(setForm(temp))
    }

    /* On pinned button hit */
    const onPin = () => {
        if(form.newEntry) { // if new entry no need to direcly change DB
            form.pinned = !form.pinned
            dispatch(setForm(form))
            return
        }
        /* Change pinned value on edit direcly change DB. */
        let noteListTemp = [...noteList]
        let formTemp = {...form}
        formTemp.pinned = !formTemp.pinned
        dispatch(setForm(formTemp))
        for(let i in noteListTemp) {
            if(noteListTemp[i].id === formTemp.id) {
                noteListTemp[i].pinned = formTemp.pinned
            }
        }
        localforage.setItem(LOCAL.tableName, noteListTemp).then( res => {
            console.log(res)
            setNoteList(res)
        })
    }

    /* On delete button hit*/
    const onDelete = () => {
        form.deleted = true
        dispatch(setForm(form))
        checkOptions(onSubmit)
    }

    /* Swithcing mode singular/multiple input handler */
    const changeMode = () => {
        let formTemp = {...form}

        // incase user delete all the list content when on list mode
        // and then change it to singular mode.
        if(formTemp.contents.length === 0) {
            formTemp.contents.push(makeContent())
        }
        dispatch(setForm(formTemp))
        form.listContents = !form.listContents
        dispatch(setForm(form))
        setTimeout(() => {
            setOpenOptions(false)
        }, 200);
    }

    /* on submit basic work flow */
    const onSubmitFrame = manipulateNoteList => {
        if(form.contents[0].text === '') {
            onClose()
            return
        }
        let newNoteList = manipulateNoteList([...noteList])
        localforage.setItem(LOCAL.tableName, newNoteList).then ( res => {
            console.log(res)
            setNoteList(res)
            onClose()
        })
    }

    /* function callback for post new data to IndexedDB */
    const postForm = newNoteList => { 
        newNoteList.push(Form.formFilter(form))
        return newNoteList
    }
    /* function callback for put/edit data on IndexedDB */
    const putForm = newNoteList => {
        for(let i in newNoteList) {
            if(newNoteList[i].id === form.id) {
                newNoteList[i] = Form.formFilter(form)
            }
        }
        return newNoteList
    }

    /* on form submited */
    const onSubmit = () => onSubmitFrame( form.newEntry? postForm : putForm )

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
                        onChange={onChangeText}
                    /> 
                    :
                    /* MULITPLE INPUT TEXT */
                    <Multiple
                        onChange={onChangeText}
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

                    <div className="modal-time-socket">
                        {Str.getEditOnTime(form.editedOn)}
                    </div>

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