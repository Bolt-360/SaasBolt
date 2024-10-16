import styled from "styled-components";

export const Container = styled.button`
    border: 1px solid;
    border-color: #4ade80;
    border-radius: 0.375rem;
    display: flex;
    justify-content: center;
    left: 0;
    width: 4rem;
    padding: 0.5rem;
    color: #16a34a;
    background-color: #ffffff;
    transition: background-color 0.3s;
    
    &:hover {
        color: #ffffff;
        background-color: #4ade80;
        border: none;
    }
`