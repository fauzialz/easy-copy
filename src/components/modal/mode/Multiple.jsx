import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LOCAL from '../../../config'

const Multiple = ({form, onChange, infoSwitch, closeList, showAdd, onAddList }) => (
    <div className="multipletext-slot">{
        form.contents.map( (content, i) => (
            <div className={content.withInfo? "multipletext-list-withInfo" : "multipletext-list"} key={i}>
                {/* CONTENT ARROW */}
                <div className="multipletext-arrow">
                    <FontAwesomeIcon icon="caret-right" />
                </div>

                {/* CONTENT INPUT */}
                <input className="multipletext-text"
                    autoFocus
                    name={i + "-text"}
                    value={content.text}
                    onChange={onChange}
                    autoComplete="off"
                />

                {/* ADD INFO BUTTON */}
                <button
                    className={content.withInfo? "multipletext-addinfo-on" : "multipletext-addinfo-off"}
                    onClick={() => infoSwitch(i)}>
                    <FontAwesomeIcon icon="comment-dots" />
                </button>

                {/* CLOSE CONTENT BUTTON */}
                <button
                    className="multipletext-close"
                    onClick={() => closeList(i)}>
                    <FontAwesomeIcon icon="times" />
                </button>

                {/* CONTENT INFO INPUT */}
                <div className="info-base">
                    <div className="info-relative">
                        <div className="info-pipe" />
                        <input className="info-text" 
                            placeholder="Add short comment here!"
                            name={i + "-info"}
                            value={content.info}
                            onChange={onChange}
                            autoComplete="off"
                        />
                        {content.info.length> 0 && <div className="info-count">{content.info.length}/{LOCAL.infoLength}</div>}
                    </div>
                </div>

            </div>
        ))
    }
        {showAdd?
        /* ADD CONTENT BUTTON */
        <button className="mutlipletext-add" 
            onClick={onAddList}>
            <FontAwesomeIcon icon="plus" />
            <div>New Text</div>
        </button>
        :null}
    </div>
)

export default Multiple