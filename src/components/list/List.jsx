import React, { useContext, useEffect, Fragment, useState } from 'react'
import { noteListContext } from '../../store'
import Emoji from '../emoji'
import LOCAL from '../../config'
import './List.scss'
import ListTile from './ListTile.jsx'

const List = ({ onEdit }) => {
    const { noteList } = useContext(noteListContext)
    const [ pinnedList, setPinnedList] = useState([])
    const [ otherList, setOtherList] = useState([])

    useEffect(() => {
        filterPinnedList()
    // eslint-disable-next-line
    }, [noteList])

    const filterPinnedList = () => {
        let pinnedListTemp = noteList.filter( note => ( note.pinned && !note.deleted ))
        let pinnedId = pinnedListTemp.map( pinned => pinned.id )
        filterOtherList(pinnedId)
        setPinnedList(pinnedListTemp)
    }

    const filterOtherList = (pinnedId) => {
        let otherListTemp = noteList.filter( note => ( !pinnedId.includes(note.id) && !note.deleted ))
        otherListTemp.reverse()
        setOtherList(otherListTemp)
    }

    return (
        <div className="list-wrapper"
            style={{ paddingTop: pinnedList.length > 0 && otherList.length > 0? '60px': '80px' }}
        >
            {(noteList.filter(singleNote => singleNote.deleted === false).length) === 0 ?
                /* WHEN NO LIST FOUND */
                <div className="on-list-empty">{LOCAL.onListEmpty}<br/><Emoji /></div> :

                /* WHEN LIST EXIST */
                <Fragment>
                    {pinnedList.length > 0 && otherList.length > 0 &&
                        <div className="section-title">PINNED</div>
                    }
                    <ListTile noteList={pinnedList} onEdit={onEdit} />

                    {pinnedList.length > 0 && otherList.length > 0 &&
                        <div className="section-title">OTHERS</div>
                    }
                    <ListTile noteList={otherList} onEdit={onEdit} />
                
                </Fragment>
            }
        </div>
    )
}

export default List