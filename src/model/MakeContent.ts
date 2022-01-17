export type Content = {
    text: string;
    copied: boolean;
    withInfo: false;
    info: string;
    focus: boolean;
    infoFocus: boolean;
}

function makeContent(): Content {
    return ({
        text : '',
        copied : false,
        withInfo : false,
        info : '',
        focus : false,
        infoFocus : false
    })
}

export default makeContent