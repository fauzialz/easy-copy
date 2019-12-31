import React, {Fragment} from 'react'
import LOCAL from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Str } from '../../services'
import Emoji from '../emoji'
import './List.scss'

const List = ({data, onEdit, onCopy}) => {

    const stopPropagation = e => e.stopPropagation()

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
                                                <button className="list-button" onClick={stopPropagation}>
                                                    <CopyToClipboard text={e.contents[0].text} onCopy={() => onCopy(e.contents[0].id, i)}>
                                                        <FontAwesomeIcon icon="copy" />
                                                    </CopyToClipboard>
                                                </button>
                                                <div className={e.contents[0].copied? "copy-sign-on" : "copy-sign-off"}>{LOCAL.onCopy}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Fragment>
            }
        </div>
    )
}

export default List