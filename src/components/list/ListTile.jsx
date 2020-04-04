import React, { Fragment } from 'react'
import SingularContent from './mode/SingularContent'
import MultipleContent from './mode/MultipleContent'
import './ListTile.scss'
import { Str } from '../../services'

const ListTile = ({noteList, onEdit, searchText}) => (
    <Fragment>
        {noteList.map((singleNote, noteListIndex) => {
            if(singleNote.deleted) return null
            return (
                <div className="list-tile" key={singleNote.id} onClick={() => onEdit(singleNote)}>
                    {/* TITLE */}
                    {singleNote.title?<div className={singleNote.listContents? "list-title-multiple" : "list-title"} >
                        {searchText?
                            Str.markString(singleNote.title, searchText) :
                            Str.hashtagConverter(singleNote.title)
                        }
                    </div>: null}
                    {/* CONTENT/s */}
                    {!singleNote.listContents?
                        <SingularContent noteListId={singleNote.id} singleNote={singleNote} searchText={searchText} />:
                        <MultipleContent noteListId={singleNote.id} singleNote={singleNote} searchText={searchText} />
                    }
                </div>
            )
        })}
    </Fragment>
)

export default ListTile