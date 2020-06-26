import React, {Fragment, useState, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LOCAL from '../../../config'
import './Multiple.scss'
import { formContext, setForm } from '../../../store';
import { makeContent } from '../../../model';

const Multiple = ({ onChange }) => {
    const {form, dispatch} = useContext(formContext)
    const [showAdd, setShowAdd] = useState(true)
    const [refs, setRefs] = useState({})
    /* TODO!!! create refs for main input text */

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

    /*  On list focus handler.
        Show/hide add info button, delete list button */
    const onListFocus = e => {
        let temp = form
        let node = e.target.name.split('-') // value of node = [ index, "text"/"info"]
        for(let i in temp.contents) {
            if(i !== node[0]) {
                temp.contents[i].focus = false
                temp.contents[i].infoFocus = false
            }else{
                temp.contents[i].focus = true 
                if(node[1] === 'info'){ // info focus true if only input info on focus
                    temp.contents[i].infoFocus = true
                }
            }
        }
        dispatch(setForm(temp))
    }
    
    /* On input info blur handler */
    const onInfoBlur = () => {
        let temp = form
        for(let i in temp.contents) {
          temp.contents[i].infoFocus = false
        }
        dispatch(setForm(temp))
    }
    
    /* Open/close access to content list with info */
    const infoButtonHandler = i => {
        let input = refs[`info${i}`]
        if(!form.contents[i].withInfo) {
            setTimeout(() => {
                input.current.focus() //Make info input auto focus when add info button hit
            }, 300);
        }
        form.contents[i].withInfo = !form.contents[i].withInfo
        dispatch(setForm(form))
    }
    
    /* Add new content on list mode handler */
    const addListHandler = () => {
        let formTemp = {...form}
        formTemp.contents.push(makeContent())
        dispatch(setForm(formTemp))
        setShowAdd(false)
        setTimeout(() => {      /* Delay add botton show after hit */
            setShowAdd(true)
        }, 2400);
    }
    
    /* Delete content on list mode handler */
    const deleteListHandler = i => {
        setRefs({}) /* Reset Refs when deleting a list */
        let formTemp = form
        formTemp.contents.splice(i, 1)
        dispatch(setForm(formTemp))
    }
    
    return (
        <div className="multipletext-slot">{
            form.contents.map( (content, i) => (
                <div className={content.withInfo? "multipletext-list-withInfo" : "multipletext-list"} key={i}>

                    {/* CONTENT ARROW DECORATION*/}
                    <div className="multipletext-arrow">
                        <FontAwesomeIcon icon="caret-right" />
                    </div>

                    {/* CONTENT INPUT */}
                    <input
                        autoFocus
                        className={content.focus? "multipletext-text-onfocus" : "multipletext-text"}
                        name={i + "-text"}
                        value={content.text}
                        onChange={onChange}
                        autoComplete="off"
                        onFocus={onListFocus}
                    />

                    {/* LIST BUTTON SEGMENT */}
                    {content.focus?
                        <Fragment>

                            {/* ADD INFO BUTTON */}
                            <button
                                className={content.withInfo? "multipletext-addinfo-on" : "multipletext-addinfo-off"}
                                onClick={() => infoButtonHandler(i)}>
                                <FontAwesomeIcon icon="comment-dots" />
                            </button>

                            {/* CLOSE/DELETE CONTENT BUTTON */}
                            <button
                                className="multipletext-close"
                                onClick={() => deleteListHandler(i)}>
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </Fragment>: null
                    }

                    {/* CONTENT INFO INPUT */}
                    <div className="info-base">
                        <div className="info-relative">

                            {/* INFO PIPE DECORATION */}
                            <div className="info-pipe" />

                            {/* INFO INPUT TEXT */}
                            <input 
                                className="info-text" 
                                ref={e => createRef(e)}
                                placeholder="Add short comment here!"
                                name={i + "-info"}
                                value={content.info}
                                onChange={onChange}
                                onFocus={onListFocus}
                                onBlur={onInfoBlur}
                                autoComplete="off"
                            />

                            {/* INFO INPUT TEXT LENGTH INDICATOR */}
                            {   content.info.length> 0 && 
                                content.infoFocus && 
                                <div className="info-count">
                                    {content.info.length}/{LOCAL.infoLength}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            ))
        }
            {/* ADD CONTENT BUTTON */}
            {showAdd?
                <button className="mutlipletext-add" 
                    onClick={addListHandler}>
                    <FontAwesomeIcon icon="plus" />
                    <div>New Text</div>
                </button> : null
            }
        </div>
    )
}

export default Multiple