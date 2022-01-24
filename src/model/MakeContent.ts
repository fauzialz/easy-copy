export type Content = {
    text: string;
    copied: boolean;
    withInfo: boolean;
    info: string;
    focus: boolean;
    infoFocus: boolean;
}

function makeContent(text?: string, info?: string): Content {
    return ({
        text : text ?? '',
        copied : false,
        withInfo : !!info ,
        info : info ?? '',
        focus : false,
        infoFocus : false
    })
}

export default makeContent