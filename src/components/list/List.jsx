import React, {Fragment} from 'react'
import LOCAL from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Str } from '../../services'

const List = ({data, onEdit, onCopy}) => {

    return (
        <Fragment>
            {data.map((e, i) => {
                if(e.deleted) return null
                return (
                    <div className="list-tile" key={e.id}>
                    {e.title?<div className="list-title" onClick={() => onEdit(e)}>{e.title}</div>: null}
                    <div className="list-content"> 

                        {/* TEXT Content */}
                        <div className="list-text" onClick={() => onEdit(e)}>
                        {Str.jsxNewLine(e.contents[0].text)}
                        </div>

                        <div className="list-boundary-line" />
                        
                        {/* COPY BUTTON */}
                        <div className="list-button-base">
                        <div className="list-button-tablecell">
                            <div className="list-button-relative">
                            <CopyToClipboard text={e.contents[0].text} onCopy={() => onCopy(e.contents[0].id, i)}>
                                <button className="list-button">
                                <FontAwesomeIcon icon="copy" />
                                </button>
                            </CopyToClipboard>
                            <div className={e.contents[0].copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                )
            })}
        </Fragment>
    )
}

export default List