import React, { ChangeEvent, forwardRef, useContext } from 'react'
import { formContext, setForm } from '../../store'
import Singular from './mode/Singular'
import Multiple from './mode/Multiple'
import LOCAL from '../../config'

const ModalContent = forwardRef((_, ref) => {
    const {form, dispatch} = useContext(formContext)

    /* Change title handler */
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const temp = {...form} 
        temp.title = e.target.value
        dispatch(setForm(temp))
    }

    /* Change content text and info handler */
    const onChangeText = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
        const temp = {...form}
        const node = e.target.name.split('-')
        const index = Number(node[0])
        const attr: 'text' | 'info' = node[1] as any

        if(attr === 'info') {
            if(e.target.value.length <= LOCAL.infoLength) {
              temp.contents[index][attr] = e.target.value
            }
        }else temp.contents[index][attr] = e.target.value
        dispatch(setForm(temp))
    }

    const singularProps = {
        ref,
        onChange: onChangeText
    }

    return (
        <>    
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
                <Singular {...singularProps} /> 
                :
                /* MULITPLE INPUT TEXT */
                <Multiple
                    onChange={onChangeText}
                />
            }
        </>
    )
})

export { ModalContent as ModalConetent }