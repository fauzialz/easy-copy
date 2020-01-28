
import React from 'react'
import './Headbar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

const Headbar = (props) => {
    const [searchFocus, setSearchFocus] = useState(false)
    const [searchText, setSearchText] = useState('')

    const headbarButtonHandler = () => {
        if(searchFocus) {
            setSearchText('')
            setSearchFocus(false)
        }
    }
    return (
        <div className="headbar-base">
            <div className={searchFocus? "headbar-frame-focus" : "headbar-frame"}>
                <button className="headbar-btn" onClick={headbarButtonHandler}>
                    <FontAwesomeIcon icon={searchFocus? "arrow-left" : "bars"} />
                </button>
                <input className="headbar-search" 
                    onFocus={() => setSearchFocus(true)}
                    // onBlur={() => setSearchFocus(false)}
                    placeholder="Search your text"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
            </div>   
        </div>
    )
}

export default Headbar