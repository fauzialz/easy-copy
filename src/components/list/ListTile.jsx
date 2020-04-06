import React, { useContext } from 'react'
import SingularContent from './mode/SingularContent'
import MultipleContent from './mode/MultipleContent'
import './ListTile.scss'
import { Str } from '../../services'
import { settingContext } from '../../store'

const ListTile = ({noteList, onEdit, searchText}) => {
    const { setting } = useContext(settingContext)
    const { mosaicView } = setting

    return (
        <div className={mosaicView? "list-tile-wrapper-mosaic": "list-tile-wrapper"} >
            {noteList.map((singleNote) => {
                if(singleNote.deleted) return null
                return (
                    <div className={ mosaicView? "list-tile-mosaic" : "list-tile"} key={singleNote.id} onClick={() => onEdit(singleNote)}>
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
        </div>
    )
}

export default ListTile