import React, { Fragment } from 'react'
import SingularContent from './mode/SingularContent'
import MultipleContent from './mode/MultipleContent'
import './ListTile.scss'

const ListTile = ({noteList, onEdit}) => (
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
)

export default ListTile