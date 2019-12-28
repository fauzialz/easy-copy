
import React from 'react'
import './Headbar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Headbar = (props) => {
    return (
        <div className="headbar-base">
            <div className="headbar-frame">
                <button className="headbar-btn">
                    <FontAwesomeIcon icon="bars" />
                </button>
                <input className="headbar-search"
                    placeholder="Search your text"
                />
            </div>   
        </div>
    )
}

export default Headbar