import styled from 'styled-components'

export const Body = styled.div`
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
`

export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: ${props => props.flexDirection || 'column'}
`