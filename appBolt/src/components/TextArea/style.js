import styled from "styled-components";

export const TArea = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 0.375rem;
    border-width: 1px;

    textarea {
        border-width: 1px;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        padding: 0.5rem;
        width: 100%;
        outline: 2px solid transparent;
        outline-offset: 2px;

        &:focus {
            border-color: var(--border-color);
        }
    }
`