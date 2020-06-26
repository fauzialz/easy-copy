import React, { useContext } from 'react'
import { Str } from '../../../services'
import CopyButton from '../../copyButton'
import './MultipleContent.scss'
import { settingContext } from '../../../store'

const MultipleContent = ({noteListId, singleNote, searchText}) => {
    const { setting } = useContext(settingContext)
    const { mosaicView } = setting

    return (
        <div className="list-content-listed"> 

            {/* TEXT Content */}
            {singleNote.contents.map((content, contentIndex) => (
                <div 
                    key={contentIndex}
                    className={`list-content-tile${mosaicView? ' list-content-tile--mosaic': ''}`}
                    style={
                        mosaicView && content.withInfo?
                        {flexWrap: 'wrap'}: {flexWrap: 'nowrap'}
                    }
                >
                    {mosaicView && content.withInfo &&
                        <CopyButton content={content} noteListId={noteListId} contentIndex={contentIndex} searchText={searchText} head/>
                    }

                    <div className="list-text" >
                        {searchText?
                            Str.markString(content.text, searchText):
                            Str.toJsx(content.text)
                        }
                    </div>
                    
                    {/* COPY BUTTON */}
                    {mosaicView && content.withInfo? null :
                        <CopyButton content={content} noteListId={noteListId} contentIndex={contentIndex} searchText={searchText} />
                    }
                </div>
            ))}
        </div>
    )
}

export default MultipleContent