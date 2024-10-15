import styled from "styled-components";

export const Input = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid;
    border-radius: 0.375rem;

    input {
        padding: 0.7rem;
        width: 100%;
        border-width: 1px;
        border-radius: 0.375rem;
        outline: 2px solid transparent;
        outline-offset: 2px;

        &:focus {
            border-color: var(--border-color);
        }
    }
`