import styled from "styled-components";

export const Container = styled.div`
    margin: 0.3rem 0;
    background: #fff;
    outline: 2px solid transparent;
    outline-offset: 2px;
`

export const ContainerItem = styled.div`
    padding: 0.5rem;
    padding-left: 20px;
    width: 150px;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #f0f0f0;
    }
`