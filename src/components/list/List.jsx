import React, { Fragment, useContext, useEffect } from 'react'
import { noteListContext } from '../../store'
import localforage from 'localforage'
import SingularContent from './mode/SingularContent'
import MultipleContent from './mode/MultipleContent'
import Emoji from '../emoji'
import LOCAL from '../../config'
import './List.scss'

const List = ({ onEdit }) => {
    const { noteList, setNoteList } = useContext(noteListContext)

    useEffect(() => {
        localforage.getItem(LOCAL.tableName).then( res => {
            if(res) {
                setNoteList(res)
            }
        }).catch( err => console.error(err))
        // eslint-disable-next-line
    }, [])

    return (
        <div className="list-wrapper">
            {(noteList.filter(singleNote => singleNote.deleted === false).length) === 0 ?
                /* WHEN NO LIST FOUND */
                <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div> :

                /* WHEN LIST EXIST */
                <Fragment>
                    {noteList.map((singleNote, noteListIndex) => {
                        if(singleNote.deleted) return null
                        return (
                            <div className="list-tile" key={singleNote.id} onClick={() => onEdit(singleNote)}>
                                {/* TITLE */}
                                {singleNote.title?<div className={singleNote.listContents? "list-title-multiple" : "list-title"} >{singleNote.title}</div>: null}
                                {/* CONTENT/s */}
                                {!singleNote.listContents?
                                    <SingularContent noteListIndex={noteListIndex} singleNote={singleNote} />:
                                    <MultipleContent noteListIndex={noteListIndex} singleNote={singleNote} />
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