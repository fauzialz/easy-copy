import React, { Fragment } from 'react'

const _hashtagTemplate = (hashtag, i) => (
    <a  key={i} 
        onClick={e => e.stopPropagation()} 
        target="blank"
        href={`https://twitter.com/search?q=%23${hashtag[0].match(/[a-z0-1A-Z]+/g)}`}
        style={{
            color: '#00adb5',
            fontWeight: 600,
            textDecoration: 'none'
        }}
    >{hashtag}</a>
)

const _markStringTemplate = (substring) => (
    <span
        style={{
            color: '#ffff',
            backgroundColor: '#00adb5',
            padding: '2px 0'
        }}
    >{substring}</span>
)

const _getHashtag = text => text.match(/#[a-z0-1A-Z.*]+/g)

const _buildNewLine = (arrayLine) => arrayLine.map( (word, i) => {
    let hashtag = _getHashtag(word)
    if(!hashtag) return `${word} `
    let subWord = word.split(hashtag[0])
    let newWord = [ subWord[0], _hashtagTemplate(hashtag, i), `${subWord[1]} ` ]
    return newWord 
})

const _hashtagConverter = line => {
    if( !_getHashtag(line) ) return line
    let arrayLine = line.split(" ")
    let newLine = _buildNewLine(arrayLine)
    return newLine
}

const _markedStringConverter = (line, searchText) => {
    let newLine = line.map( (subLine, i) => (
        (i + 1) === line.length? 
        subLine: <Fragment key={i}>{subLine}{_markStringTemplate(searchText)}</Fragment>)
    )
    return newLine
}

const _markString = (line, searchText) => {
    if(!line.match('\n')) {
        return _markedStringConverter(line.split(searchText), searchText)
    }
    let newLine = line.split('\n')
    newLine = newLine.map( (subLine, i) => (
        (i + 1) === newLine.length?
        subLine: 
        <Fragment key={i}>{
            _markedStringConverter(subLine.split(searchText), searchText)
        }<br /></Fragment>
    ))
    return newLine
}

const _isNotString = str => ((str? false : str === "" ? false : true) || str.constructor !== String)

const _errorBadArgument = () => { throw new Error("Bad Argument. The argument is not string or empty.") }

export default {
    toTitleCase: str => {
        if( _isNotString(str) ) _errorBadArgument()
        return str.replace(/\w\S*/g, txt => (
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        ));
    },
    frontZero: str => ('0' + str).slice(-2),
    toJsx: str => {
        if( _isNotString(str) ) _errorBadArgument()
        if(str === "") return <br />
        let temp = str.split('\n').map( (line, i) => (<React.Fragment key={i} >{_hashtagConverter(line)} <br /></React.Fragment>))
        return (temp)
    },
    hashtagConverter: _hashtagConverter,
    markString: _markString
}