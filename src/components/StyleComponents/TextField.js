import styled, { keyframes } from 'styled-components';

const TextField = styled.input.attrs({
    type: 'text',
    size: props => props.small ? 3 : 20
})`
    background: #E0E0E0;
    border-radius: 3px;
    border-bottom-style: ridge;
    color: white;
    margin: 0.5rem;
    padding: ${props => props.padding};
    outline: 0;
`;

const UnderLine = styled.hr`
    border-top: none rgb(224, 224, 224);
    border-left: none rgb(224, 224, 224);
    border-right: none rgb(224, 224, 224);
    border-bottom: 1px solid rgb(224, 224, 224);
    bottom: 8px;
    margin: 0px;
    overflow: hidden;
    box-sizing: content-box;
    animation: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;

    ${TextField}:hover & {
        border-top: none #64FFDA;
        border-left: none #64FFDA;
        border-right: none #64FFDA;
        border-bottom: 2px solid #64FFDA;
        transform: scaleX(0);
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  }
`;

const FocusedUnderLine = styled.hr`
    border-top: none #64FFDA;
    border-left: none #64FFDA;
    border-right: none #64FFDA;
    border-bottom: 2px solid #64FFDA;
    overflow: hidden;
    bottom: 8px;
    margin: 0px;
    box-sizing: content-box;

    ${TextField}:focus & {
        transform: scaleX(0);
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    }
`;

const TextFieldWrapper = {
    TextField,
    UnderLine,
    FocusedUnderLine,
}

export default TextFieldWrapper;

