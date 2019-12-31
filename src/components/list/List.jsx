import React, {Fragment} from 'react'
import LOCAL from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Str } from '../../services'
import Emoji from '../emoji'
import './List.scss'

const SingularContent = ({onCopy, index, e}) => (
    <div className="list-content"> 
        {/* TEXT Content */}
        <div className="list-text" >
            {Str.jsxNewLine(e.contents[0].text)}
        </div>

        <div className="list-boundary-line" />
        
        {/* COPY BUTTON */}
        <div className="list-button-base">
            <div className="list-button-tablecell">
                <div className="list-button-relative">
                    <button className="list-button" onClick={e => e.stopPropagation()}>
                        <CopyToClipboard text={e.contents[0].text} onCopy={() => onCopy(index, 0)}>
                            <FontAwesomeIcon icon="copy" />
                        </CopyToClipboard>
                    </button>
                    <div className={e.contents[0].copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}</div>
                </div>
            </div>
        </div>
    </div>
)

const MultipleContent = ({onCopy, index, e}) => (
    <div className="list-content-listed"> 
        {/* TEXT Content */}
        {e.contents.map((content, i) => (
            <div className="list-content-tile" key={i}>
                <div className="list-text" >
                    {Str.jsxNewLine(content.text)}
                </div>
                
                {/* COPY BUTTON */}
                <div className="list-button-base">
                    {content.withInfo? <div className="list-content-info">{content.info}</div>: null}
                    <div className="list-button-tablecell">
                        <div className="list-button-relative">
                            <button className="list-button multiple-button" onClick={e => e.stopPropagation()}>
                                <CopyToClipboard text={!content.text===""?content.text: LOCAL.onTextEmpty} onCopy={() => onCopy(index, i)}>
                                    <FontAwesomeIcon icon="copy" />
                                </CopyToClipboard>
                            </button>
                            <div className={content.copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}</div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const List = ({data, onEdit, onCopy}) => {

    return (
        <div className="list-wrapper">
            {(data.filter(e => e.deleted === false).length) === 0 ?
                /* WHEN NO LIST FOUND */
                <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div> :

                /* WHEN LIST EXIST */
                <Fragment>
                    {data.map((e, i) => {
                        if(e.deleted) return null
                        return (
                            <div className="list-tile" key={e.id} onClick={() => onEdit(e)}>
                                {/* TITLE */}
                                {e.title?<div className="list-title" >{e.title}</div>: null}

                                {!e.listContents?
                                    <SingularContent onCopy={onCopy} index={i} e={e} />:
                                    <MultipleContent onCopy={onCopy} index={i} e={e} />
                                }
                                
                            </div>
                        )
                    })}
                </Fragment>
            }
        </div>
    )
}

export default List