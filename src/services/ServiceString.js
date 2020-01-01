import React from 'react'

const hashtagTemplate = (hashtag, i) => (
    <a 
        key={i} 
        onClick={e => e.stopPropagation()} 
        target="blank"
        href={`https://twitter.com/search?q=%23${hashtag[0].match(/[a-z0-1A-Z]+/g)}`}
    >
        {hashtag}
    </a>
)

const withHashtag = line => {
    if( ! line.match(/#[a-z0-1A-Z]+/g) ) return line
    let arrayLine = line.split(" ")
    // console.log(arrayLine)
    let newLine = arrayLine.map( (word, i) => {
        // console.log(word)
        let hashtag = word.match(/#[a-z0-1A-Z.*]+/g)
        if(!hashtag) return `${word} `
        // debugger
        // console.log(word)
        let fragWord = word.split(hashtag[0])
        // console.log(fragWord)
        // let newWord = <span key={i}>{fragWord[0]}<HashtagTemplate hashtag={hashtag} i={i} /> </span>
        
        let newWord = []
        fragWord.forEach( (subWord, i) => {
            if( i === 1) {
                newWord = newWord.concat([`${subWord} `, hashtagTemplate(hashtag, i)])
            }else{
                newWord = newWord.concat([subWord, hashtagTemplate(hashtag, i)])
            }
            // if(i < 1 ) {
            //     // newWord = <span key={i}>{subWord}<HashtagTemplate hashtag={hashtag} i={i} /> </span>
            // }else {
            //     newWord = newWord + subWord
            // }
        })
        newWord.pop()
        // debugger
        return newWord
        
    })
    // console.log(arrayLine)
    // debugger
    // for(let hash of hashtag) {
    //     console.log(hash)
    //     line.split(hash).forEach( (subLine, i) => {
    //         console.log(subLine)
    //         // newLine = newLine.concat( [subLine, hashtagTemplate(hash, i)] )
    //     })
    // }
    // console.log(line)
    // console.log(hashtag)
    // debugger
    // newLine.pop()
    return newLine
}

export default {
    toTitleCase: (str) => {
        if(!str) throw new Error("Bad Argument, sir!")
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    frontZero: (str) => ('0' + str).slice(-2),
    toJsx: (str) => {
        if(str === "") return <br />
        if(!str || str.constructor !== String) throw new Error("Bad Argument, sir!")
        let temp = str.split('\n').map( (line, i) => (<React.Fragment key={i} >{withHashtag(line)} <br /></React.Fragment>))
        return (temp)
    }
}