import React from 'react'
import { Str } from '../../../services'
import CopyButton from '../../copyButton'
import './SingularContent.scss'

const SingularContent = ({noteListId, singleNote, searchText}) => (
    <div className="list-content"> 
        {/* TEXT Content */}
        <div className="list-text" >
            {   searchText?
                Str.markString(singleNote.contents[0].text, searchText):
                Str.toJsx(singleNote.contents[0].text)
            }
        </div>

        <div className="list-boundary-line" />
        
        {/* COPY BUTTON */}
        <CopyButton content={singleNote.contents[0]} noteListId={noteListId} />
    </div>
)

export default SingularContent