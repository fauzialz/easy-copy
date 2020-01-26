import React from 'react'
import { Str } from '../../../services'
import CopyButton from '../../copyButton'

const SingularContent = ({noteListIndex, singleNote}) => (
    <div className="list-content"> 
        {/* TEXT Content */}
        <div className="list-text" >
            {Str.toJsx(singleNote.contents[0].text)}
        </div>

        <div className="list-boundary-line" />
        
        {/* COPY BUTTON */}
        <CopyButton content={singleNote.contents[0]} noteListIndex={noteListIndex} />
    </div>
)

export default SingularContent