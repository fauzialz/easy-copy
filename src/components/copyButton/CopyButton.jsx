import React, { useContext } from 'react'
import { noteListContext } from '../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Obj, Str } from '../../services'
import LOCAL from '../../config'
import './CopyButton.scss'

const CopyButton = ({content, noteListId, contentIndex = 0, searchText, head }) => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const listButtonClass = content.withInfo? "list-button withInfo-button" : "list-button"

    const onCopy = () => {
        let temp = noteList
        let noteListIndex = noteList.findIndex( note => note.id === noteListId)
        temp[noteListIndex].contents[contentIndex].copied = true
        setNoteList(Obj.deepCopy(temp))
        setTimeout(() => {
          temp[noteListIndex].contents[contentIndex].copied = false
          setNoteList(Obj.deepCopy(temp))
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