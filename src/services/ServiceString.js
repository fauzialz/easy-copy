import React from 'react'

export default {
    toTitleCase: (str) => {
        if(!str) throw new Error("Bad Argument, sir!")
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    frontZero: (str) => ('0' + str).slice(-2),
    jsxNewLine: (str) => {
        if(str === "") return <br />
        if(!str || str.constructor !== String) throw new Error("Bad Argument, sir!")
        let temp = str.split('\n').map( (line, i) => (<React.Fragment key={i} >{line} <br /></React.Fragment>))
        return (temp)
    }
}