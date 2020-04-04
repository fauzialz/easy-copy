import React from 'react'
import { Str } from '../../../services'
import CopyButton from '../../copyButton'
import './MultipleContent.scss'

const MultipleContent = ({noteListIndex, singleNote}) => (
    <div className="list-content-listed"> 

        {/* TEXT Content */}
        {singleNote.contents.map((content, contentIndex) => (
            <div className="list-content-tile" key={contentIndex}>
                <div className={content.withInfo? "list-text-withinfo" : "list-text-normal"} >
                    {Str.toJsx(content.text)}
                </div>
                
                {/* COPY BUTTON */}
                <CopyButton content={content} noteListIndex={noteListIndex} contentIndex={contentIndex} />
            </div>
        ))}
    </div>
)

export default MultipleContent