import React, {forwardRef} from 'react'

const Singular = forwardRef(({form, onChange},ref) => (
    <textarea 
        ref={ref}
        autoFocus
        className="modal-textarea"
        placeholder="Text to copy"
        value={form.contents[0].text}
        onChange={onChange}
        name="0-text"
    />
))

export default Singular