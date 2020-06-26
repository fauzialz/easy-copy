import React, { useContext, useState, useEffect, Fragment } from 'react'
import './SearchResult.scss'
import { noteListContext } from '../../store'
import ListTile from '../list/ListTile'
import LOCAL from '../../config'

const searchListContents = (contents, conditions) => {
    let available = false
    for(let i = 0; i < contents.length; i++) {
        if( conditions(contents[i]) ){
            available = true
            break
        }
    }
    return available
}

const SearchResult = ({searchText, onEdit}) => {
    const { noteList } = useContext(noteListContext)
    const [ resultPriority, setResultPriority] = useState([])
    const [ resultNormal, setResultNormal] = useState([])

    useEffect(() => {
        filterPriority()
    // eslint-disable-next-line
    }, [searchText, noteList])

    const filterPriority = () => {
        let resultPriorityTemp = noteList.filter( note => (
            !note.listContents? ((
                note.title.includes(searchText) || 
                note.contents[0].text.includes(searchText)
            ) && !note.deleted) :((
                note.title.includes(searchText) ||
                searchListContents(note.contents, (content) => (
                    content.text.includes(searchText) ||
                    content.info.includes(searchText)
                ))
            ) && !note.deleted)
        ))
        let priorityId = resultPriorityTemp.map( result => result.id)
        filterNormal(priorityId)
        setResultPriority(resultPriorityTemp)
    }

    const filterNormal = (priorityId) => {
        let resultNormalTemp = noteList.filter( note => (
            !note.listContents? (
                (
                    note.title.toLowerCase().includes(searchText.toLowerCase()) || 
                    note.contents[0].text.toLowerCase().includes(searchText.toLowerCase())
                ) && !priorityId.includes(note.id) && !note.deleted
            ):(
                (
                    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    searchListContents(note.contents, (content) => (
                        content.text.toLowerCase().includes(searchText.toLowerCase()) ||
                        content.info.toLowerCase().includes(searchText.toLowerCase())
                    ))
                ) && !priorityId.includes(note.id) && !note.deleted
            )
        ))
        setResultNormal(resultNormalTemp)
    }

    return (
        <div className="searchResult">
            {searchText === ''? null :
                resultPriority.length === 0 && resultNormal.length === 0? 
                <div className="searchResult__empty">{LOCAL.onSearchEmpty}</div>:
                <Fragment>
                    {resultPriority.length > 0 && <ListTile noteList={resultPriority} onEdit={onEdit} searchText={searchText} />}
                    {resultNormal.length > 0 && <ListTile noteList={resultNormal} onEdit={onEdit} searchText={searchText} />}
                </Fragment>
            }
        </div>
    )
}

export default SearchResult