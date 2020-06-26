import React, {forwardRef, useContext} from 'react'
import { formContext } from '../../../store'
import './Singular.scss'

const Singular = forwardRef(({ onChange},ref) => {
    const { form } = useContext(formContext)
    return (
        <textarea 
            ref={ref}
            autoFocus
            className="modal-textarea"
            placeholder="Text to copy"
            value={form.contents[0].text}
            onChange={onChange}
            name="0-text"
        />
    )
})

export default Singular