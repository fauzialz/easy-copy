import React, { useContext } from 'react'
import { noteListContext } from '../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Obj } from '../../services'
import LOCAL from '../../config'
import './CopyButton.scss'

const CopyButton = ({content, noteListIndex, contentIndex = 0}) => {
    const { noteList, setNoteList } = useContext(noteListContext)
    const listButtonClass = content.listContents? "list-button multiple-button" : "list-button"

    const onCopy = () => {
        let temp = noteList
        temp[noteListIndex].contents[contentIndex].copied = true
        setNoteList(Obj.deepCopy(temp))
        setTimeout(() => {
          temp[noteListIndex].contents[contentIndex].copied = false
          setNoteList(Obj.deepCopy(temp))
        }, 1300);
    }

    return (
        <div className="list-button-base">
            <div className="list-button-tablecell">
                <div className="list-button-relative">
                    {content.withInfo? <span className="list-content-info">\ {content.info}</span>: null}
                    <button className={listButtonClass} onClick={e => e.stopPropagation()}>
                        <CopyToClipboard text={content.text || LOCAL.onTextEmpty} onCopy={() => onCopy()}>
                            <FontAwesomeIcon icon="copy" />
                        </CopyToClipboard>
                    </button>
                    <div className={content.copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}</div>
                </div>
            </div>
        </div>
    )
}

export default CopyButton