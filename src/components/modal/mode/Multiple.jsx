import React, {Fragment, useState, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LOCAL from '../../../config'

const Multiple = ({form, onChange, infoSwitch, closeList, showAdd, onAddList, onFocus, onInfoBlur }) => {
    const [refs, setRefs] = useState({})
    refs['info0'] = useRef(null)

    /* Use to create dynamic ref for every new input info */
    const createRef = e => {
        if (e) {
            let node = e.name.split('-')
            if(!refs[`info${node[0]}`]) {
                let temp = refs
                temp[`info${node[0]}`] = {current: e}
                setRefs(temp)
            }
        }
    }

    /* Make info input auto focus when input botton hited */
    const onInfoButton = i => {
        let input = refs[`info${i}`]
        if(!form.contents[i].withInfo) {
            setTimeout(() => {
                input.current.focus()
            }, 200);
        }
        infoSwitch(i)
    }

    return (
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
                        onFocus={onFocus}
                    />

                    {content.focus?
                        <Fragment>
                            {/* ADD INFO BUTTON */}
                            <button
                                className={content.withInfo? "multipletext-addinfo-on" : "multipletext-addinfo-off"}
                                onClick={() => onInfoButton(i)}>
                                <FontAwesomeIcon icon="comment-dots" />
                            </button>

                            {/* CLOSE CONTENT BUTTON */}
                            <button
                                className="multipletext-close"
                                onClick={() => closeList(i)}>
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </Fragment>: null
                    }

                    {/* CONTENT INFO INPUT */}
                    <div className="info-base">
                        <div className="info-relative">
                            <div className="info-pipe" />
                            <input className="info-text" 
                                ref={i === 0? refs.info0 : e => createRef(e)}
                                placeholder="Add short comment here!"
                                name={i + "-info"}
                                value={content.info}
                                onChange={onChange}
                                onFocus={onFocus}
                                onBlur={onInfoBlur}
                                autoComplete="off"
                            />
                            {content.info.length> 0 && content.infoFocus && <div className="info-count">{content.info.length}/{LOCAL.infoLength}</div>}
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
}

export default Multiple