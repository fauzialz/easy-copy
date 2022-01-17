import React, { useContext } from 'react'
import { Form, Str } from '../../services'
import { clearForm, formContext, noteListContext, setForm } from '../../store'
import { useHistory } from 'react-router-dom'
import localforage from 'localforage'
import LOCAL from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ModalImageFooter = () => {
    const history = useHistory()
    const { noteList, setNoteList } = useContext(noteListContext)
    const { form, dispatch } = useContext(formContext)

    const onClose = () => {
        dispatch(clearForm())
        history.replace('/')
    }

    /* on submit basic work flow */
    const onSubmit = () => {
        if(form.contents[0].text === '') {
            onClose()
            return
        }
        const newNoteList = [...noteList]
        newNoteList.push(Form.formFilter(form))
        localforage.setItem(LOCAL.tableName, newNoteList).then ( res => {
            setNoteList(res)
            onClose()
        })
    }

    return (
        <div className='modal-img-footer'>

            {form.editedOn && <div className="modal-img-time-socket">
                {Str.getEditOnValue(form.editedOn)}
            </div>}

            <div className='modal-img-right'>
                <button
                    className="modal-right-btn-save"
                    onClick={onSubmit}
                >
                    <FontAwesomeIcon icon="save" />
                </button>

                <CopyButton />
            </div>
        </div>
    )
}

const CopyButton = () => {
    const { form, dispatch } = useContext(formContext)

    const content = form.contents[0]

    const onCopy = () => {
        navigator.clipboard.writeText(content.text || LOCAL.onTextEmpty)

        const temp = {...form}
        if (temp.contents[0].copied) return;

        temp.contents[0].copied = true
        dispatch(setForm(temp))

        setTimeout(() => {
            const tempReset = {...form}
            tempReset.contents[0].copied = false
            dispatch(setForm(tempReset))
        }, 1300);
    }

    return (
        <div className='modal-img-copy'>
            <button
                className="modal-right-btn-copy"
                onClick={onCopy}
            >
                COPY
            </button>
            <div
                className={content.copied?
                    'modal-img-copy-sign-on' :
                    'modal-img-copy-sign-off'}
            >
                {LOCAL.onCopy}
            </div>         
        </div>
    )
}

export { ModalImageFooter }