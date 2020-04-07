import React, { useContext, useState, useEffect } from 'react'
import SingularContent from './mode/SingularContent'
import MultipleContent from './mode/MultipleContent'
import './ListTile.scss'
import { Str } from '../../services'
import { settingContext } from '../../store'
import StackGrid from "react-stack-grid"

const ListTile = ({noteList, onEdit, searchText}) => {
    // eslint-disable-next-line
    const [ heigthCorrection, setHeightCorrection ] = useState(true)
    const { setting } = useContext(settingContext)
    const { mosaicView } = setting

    useEffect(() => {
        setTimeout(() => {
            setHeightCorrection(mosaicView) //height correction, rerender when view change applied.
        }, 0);
    }, [mosaicView, noteList])

    return (
        <StackGrid
            columnWidth={ mosaicView? "50%" : "100%" }
            gutterHeight={0}
            gutterWidth={8}
            duration={searchText? 0 : 250} //0 animation to minimize bug unrendered note when search text change to quick
        >
            {noteList.map((singleNote) => {
                if(singleNote.deleted) return null //delete this later for trash menu!
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
        </StackGrid>
    )
}

export default ListTile