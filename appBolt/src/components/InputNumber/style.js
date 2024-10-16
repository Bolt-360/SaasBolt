import styled from "styled-components";

export const Input = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;

    label {
        padding: 0.5rem;
        min-width: 300px;
    }

    input {
        padding: 0.7rem;
        width: 100%;
        border: none;
        border-left: 1px solid #ccc;
        outline: 1px solid transparent;
        outline-offset: 2px;

        &:focus {
            border-color: var(--border-color);
            outline: none;
        }
    }
`