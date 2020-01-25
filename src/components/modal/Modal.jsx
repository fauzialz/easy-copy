import React, {forwardRef, useState, useContext} from 'react'
import localforage from 'localforage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Singular from './mode/Singular'
import Multiple from './mode/Multiple'
import './Modal.scss'
import { formContext, setForm, noteListContext } from '../../store'
import LOCAL from '../../config'
import { Form, Obj } from '../../services'

const Modal = forwardRef(({
    openModal, onClose,
    btnOperations, addList, closeList,
    singularMultipleSwitch, infoSwitch,
    onFocus, onInfoBlur }, ref ) => {
    
    const { noteList, setNoteList } = useContext(noteListContext)
    const {form, dispatch} = useContext(formContext)
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

    /* Change title handler */
    const onChangeTitle = e => {
        let temp = form
        temp.title = e.target.value
        dispatch(setForm(temp))
    }

    /* Change content text and info handler */
    const onChangeText = e => {
        let temp = form
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
            btnOperations('pinned')
            return
        }
        /* Change pinned value on edit direcly change DB. */
        let noteListTemp = Obj.deepCopy(noteList)
        let formTemp = Obj.deepCopy(form)
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

    /* on submit basic work flow */
    const onSubmitFrame = manipulateNoteList => {
        if(form.contents[0].text === '') {
            onClose()
            return
        }
        let temp = manipulateNoteList(Obj.deepCopy(noteList))
        localforage.setItem(LOCAL.tableName, temp).then ( res => {
            console.log(res)
            setNoteList(res)
            onClose()
        })
    }

    /* function callback for post new data to IndexedDB */
    const postForm = temp => { 
        temp.push(Form.formFilter(form))
        return temp
    }
    /* function callback for put/edit data on IndexedDB */
    const putForm = temp => {
        for(let i in temp) {
            if(temp[i].id === form.id) {
                temp[i] = Form.formFilter(form)
            }
        }
        return temp
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