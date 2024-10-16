import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;

    .checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .click-checkbox {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;

        select {
            border-width: 1px;
            border-color: #ccc;
            border-radius: 0.375rem;
            padding: 0.5rem;
            width: 100%;
            outline: 2px solid transparent;
            outline-offset: 2px;
            transition: border-color 0.3s;

            &:focus {
                border-color: var(--border-color);
                outline: none;
            }
        }

        input {
            border-width: 1px;
            border-color: #ccc;
            border-radius: 0.375rem;
            padding: 0.5rem;
            width: 100%;
            outline: 2px solid transparent;
            outline-offset: 2px;
            transition: border-color 0.3s;

            &:focus {
                border-color: var(--border-color);
                outline: none;
            }
        }
    }
`