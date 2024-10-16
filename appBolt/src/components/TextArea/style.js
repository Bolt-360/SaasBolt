import styled from "styled-components";

export const TArea = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #ccc;

    label {
        padding: 1rem 0.5rem;
    }

    textarea {
        border: none;
        border-left: 1px solid #ccc;
        padding: 1rem;
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        width: 100%;
        max-width: 1000px;
        outline: 2px solid transparent;
        outline-offset: 2px;

        &:focus {
            border-color: var(--border-color);
            outline: none;
        }
    }
`