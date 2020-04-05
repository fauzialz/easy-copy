
import React from 'react'
import './Headbar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import SearchResult from '../searchResult'

const Headbar = ({onEdit}) => {
    const [searchFocus, setSearchFocus] = useState(false)
    const [searchText, setSearchText] = useState('')

    const headbarButtonHandler = () => {
        if(searchFocus) {
            setSearchText('')
            setSearchFocus(false)
        }
    }
    return (
        <div className={`headbar-base`}>
            <div className={searchFocus? "headbar-frame-focus" : "headbar-frame"}>
                <div className={searchFocus? "headbar-bar-focus" : "headbar-bar"} >
                    <button className="headbar-btn" onClick={headbarButtonHandler}>
                        <FontAwesomeIcon icon={searchFocus? "arrow-left" : "bars"} />
                    </button>
                    <input className={searchText !== ''? "headbar-search-focus": "headbar-search" }
                        onFocus={() => setSearchFocus(true)}
                        placeholder={searchFocus? "Search your text" : ""}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    {searchText !== '' &&
                        <button className="headbar-btn headbar-btn--close" onClick={() => setSearchText('')}>
                            <FontAwesomeIcon icon="times" />
                        </button>
                    }
                </div>

                <SearchResult searchText={searchText} onEdit={onEdit} />
            </div>   
        </div>
    )
}

export default Headbar