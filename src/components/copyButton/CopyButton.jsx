import React, { useContext } from 'react'
import { noteListContext } from '../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Str } from '../../services'
import LOCAL from '../../config'
import './CopyButton.scss'

const CopyButton = ({content, noteListId, contentIndex = 0, searchText, head }) => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const listButtonClass = content.withInfo? "list-button withInfo-button" : "list-button"

    const onCopy = () => {
        let newNoteList = [...noteList]
        let noteListIndex = newNoteList.findIndex( note => note.id === noteListId)
        newNoteList[noteListIndex].contents[contentIndex].copied = true
        setNoteList(newNoteList)
        setTimeout(() => {
            let resetNoteList = [...noteList]
            resetNoteList[noteListIndex].contents[contentIndex].copied = false
            setNoteList(resetNoteList)
        }, 1300);
    }

    return (
        <div className={`list-button-base${head? ' list-button-base--head': ''}`}>
            <div className="list-button-tablecell">
                <div className="list-button-relative">
                    {content.withInfo? 
                        <span className={`list-content-info${head? ' list-content-info--head': ''}`}>
                            {!head && <span>/</span>} {
                                searchText?
                                Str.markString(content.info, searchText):
                                content.info
                            } {head && <span>/</span>}
                        </span>: null
                    }
                    <button className={listButtonClass} onClick={e => e.stopPropagation()}>
                        <CopyToClipboard text={content.text || LOCAL.onTextEmpty} onCopy={() => onCopy()}>
                            <FontAwesomeIcon icon="copy" />
                        </CopyToClipboard>
                    </button>
                    <div
                        className={content.copied?
                            `copy-sign-on${head? ' copy-sign-on--head': ''}` :
                            `copy-sign-off${head? ' copy-sign-off--head': ''}`}
                        >
                            {LOCAL.onCopy}
                        </div>
                </div>
            </div>
        </div>
    )
}

export default CopyButton