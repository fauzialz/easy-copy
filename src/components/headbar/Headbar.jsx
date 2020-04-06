
import React, { Fragment, useState, useContext } from 'react'
import './Headbar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchResult from '../searchResult'
import { settingContext } from '../../store'
import localforage from 'localforage'
import LOCAL from '../../config'

const Headbar = ({onEdit}) => {
    const [searchFocus, setSearchFocus] = useState(false)
    const [searchText, setSearchText] = useState('')
    const { setting, setSetting } = useContext(settingContext)

    const headbarButtonHandler = () => {
        if(searchFocus) {
            setSearchText('')
            setSearchFocus(false)
        }
    }

    const changeViewHandler = () => {
        let settingTemp = {...setting}
        settingTemp.mosaicView = !settingTemp.mosaicView
        localforage.setItem(LOCAL.appSetting, settingTemp).then(res => {
            setSetting({...res})
        })
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
                    {
                        searchFocus? <Fragment>
                            {searchText !== '' &&
                                <button className="headbar-btn headbar-btn--close" onClick={() => setSearchText('')}>
                                    <FontAwesomeIcon icon="times" />
                                </button>
                            }
                        </Fragment>:
                        <button className={`headbar-btn headbar-btn--close headbar-btn--${setting.mosaicView?'rotate': 'normal'}`} onClick={changeViewHandler}>
                            <FontAwesomeIcon icon={setting.mosaicView? "pause" : "th-large"} />
                        </button>
                    }
                </div>

                <SearchResult searchText={searchText} onEdit={onEdit} />
            </div>   
        </div>
    )
}

export default Headbar