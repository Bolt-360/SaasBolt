import styled from 'styled-components'

export const Icon = styled.div`
    margin-top: 20px;
    padding: 8px;
    display: flex;
    justify-content: center;

    span {
        color: var(--text-color);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        line-height: 2rem;
        font-size: 1.5rem;
    }

    span img {
        width: 31px;
        height: 30px;
    }
`