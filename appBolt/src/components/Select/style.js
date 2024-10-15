import styled from "styled-components";

export const InputSelect = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-color);
    }

    select {
        border-width: 1px; 
        border-radius: 0.25rem;
        padding: 0.5rem;
        outline: 2px solid transparent;
        outline-offset: 2px;

        &:focus {
            border-color: #22c55e;
        }
    }
`