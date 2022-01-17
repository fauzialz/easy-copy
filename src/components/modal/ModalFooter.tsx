import React, { useContext, useState } from 'react'
import { FormType } from '../../model/MakeForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formContext, noteListContext, setForm } from '../../store'
import { Form, Str } from '../../services'
import localforage from 'localforage'
import LOCAL from '../../config'
import { makeContent } from '../../model'

type MFProps = {
    onClose: () => void;
}

const ModalFooter = ({ onClose }: MFProps) => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const { form, dispatch } = useContext(formContext)
    const [openOptions, setOpenOptions] = useState(false)

    /* Swithcing mode singular/multiple input handler */
    const changeMode = () => {
        let formTemp = {...form}

        // incase user delete all the list content when on list mode
        // and then change it to singular mode.
        if(formTemp.contents.length === 0) {
            formTemp.contents.push(makeContent())
        }

        formTemp.listContents = !formTemp.listContents
        dispatch(setForm(formTemp))
        setTimeout(() => {
            setOpenOptions(false)
        }, 200);
    }

    /* On delete button hit*/
    const onDelete = () => {
        form.deleted = true
        dispatch(setForm(form))
        checkOptions(onSubmit)
    }

    /*  To make the user see that 
        options was closed first
        before modal close   */
    const checkOptions = (fun: () => void) => {
        if(openOptions) {
            setOpenOptions(false)
            setTimeout(() => {
                fun()
            }, 200);
        }else fun()
    }

    /* function callback for post new data to IndexedDB */
    const postForm = (newNoteList: FormType[]) => { 
        newNoteList.push(Form.formFilter(form))
        return newNoteList
    }
    /* function callback for put/edit data on IndexedDB */
    const putForm = (newNoteList: FormType[]) => {
        for(let i in newNoteList) {
            if(newNoteList[i].id === form.id) {
                newNoteList[i] = Form.formFilter(form)
            }
        }
        return newNoteList
    }

    /* on submit basic work flow */
    const onSubmitFrame = (manipulateNoteList: (newNoteList: FormType[]) => FormType[]) => {
        if(form.contents[0].text === '') {
            onClose()
            return
        }
        let newNoteList = manipulateNoteList([...noteList])
        localforage.setItem(LOCAL.tableName, newNoteList).then ( res => {
            setNoteList(res)
            onClose()
        })
    }

    /* on form submited */
    const onSubmit = () => onSubmitFrame( form.newEntry? postForm : putForm )

    return (
        <>
            {/* FOOTER SESSION */}
            <div className="modal-footer">

                {/* OPTIONS BUTTON */}
                <button 
                    className="modal-left-btn" 
                    onClick={() => setOpenOptions(!openOptions)}>
                    <FontAwesomeIcon icon="ellipsis-v" />
                </button>

                {form.editedOn && <div className="modal-time-socket">
                    {Str.getEditOnValue(form.editedOn)}
                </div>}

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
        </>
    )
}

export { ModalFooter }
