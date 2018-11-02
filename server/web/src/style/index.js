import styled from 'styled-components'

export * from './createClassroom.js'

export const Text = styled.p`
    margin-top: 0px;
    margin-bottom: 0px;
`
export const Header2 = styled.h2`
    margin-top: 0px;
    margin-bottom: 0px;
`

export const BarLink = styled.div`
    display: flex;
    justify-content: space-between;
    color: gray;
    border-top: 0.5px solid #80808066;
    border-bottom: 0.5px solid #80808066;
    padding-top: 13px;
    padding-bottom: 13px;
    margin-top: 10px;
    margin-bottom: 10px;
`
export const BarLinkList = styled.div`
    display: flex;
    justify-content: space-between;
    color: gray;
    border-bottom: ${props => (props.lastItem === true) ? '0.5px solid #80808066' : "0px"};
    border-top: 0.5px solid #80808066;
    padding-top: 13px;
    padding-bottom: 13px;
`

export const Body = styled.div`
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
`

export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: ${props => props.flexDirection || 'column'}
`