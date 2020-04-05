import React, { useContext, useEffect } from 'react'
import { noteListContext } from '../../store'
import localforage from 'localforage'
import Emoji from '../emoji'
import LOCAL from '../../config'
import './List.scss'
import ListTile from './ListTile.jsx'

const List = ({ onEdit }) => {
    const { noteList, setNoteList } = useContext(noteListContext)

    useEffect(() => {
        localforage.getItem(LOCAL.tableName).then( res => {
            if(res) {
                debugger
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
                <ListTile noteList={noteList} onEdit={onEdit} />
            }
        </div>
    )
}

export default List