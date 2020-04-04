import React, { useContext } from 'react'
import './SearchResult.scss'
import { noteListContext } from '../../store'
import ListTile from '../list/ListTile'
import LOCAL from '../../config'

const searchListContents = (searchText, contents) => {
    let available = false
    for(let i = 0; i < contents.length; i++) {
        if(
            contents[i].text.toLowerCase().includes(searchText.toLowerCase()) ||
            contents[i].info.toLowerCase().includes(searchText.toLowerCase())
        ){
            available = true
            break
        }
    }
    return available
}

const SearchResult = ({searchText, onEdit}) => {
    const { noteList } = useContext(noteListContext)


    const noteListResult = noteList.filter( note => (
        !note.listContents? (
            note.title.toLowerCase().includes(searchText.toLowerCase()) || 
            note.contents[0].text.toLowerCase().includes(searchText.toLowerCase())
        ):(
            note.title.toLowerCase().includes(searchText.toLowerCase()) ||
            searchListContents(searchText, note.contents)
        )
    ))

    return (
        <div className="searchResult">
            {searchText === ''? null :
                noteListResult.length === 0? 
                <div className="searchResult__empty">{LOCAL.onSearchEmpty}</div>:
                <ListTile noteList={noteListResult} onEdit={onEdit} />
            }
        </div>
    )
}

export default SearchResult