import React from 'react'
import { Str } from '../../../services'
import CopyButton from '../../copyButton'
import './MultipleContent.scss'

const MultipleContent = ({noteListId, singleNote, searchText}) => (
    <div className="list-content-listed"> 

        {/* TEXT Content */}
        {singleNote.contents.map((content, contentIndex) => (
            <div className="list-content-tile" key={contentIndex}>
                <div className={content.withInfo? "list-text-withinfo" : "list-text-normal"} >
                    {searchText?
                        Str.markString(content.text, searchText):
                        Str.toJsx(content.text)
                    }
                </div>
                
                {/* COPY BUTTON */}
                <CopyButton content={content} noteListId={noteListId} contentIndex={contentIndex} searchText={searchText} />
            </div>
        ))}
    </div>
)

export default MultipleContent