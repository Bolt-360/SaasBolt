import styled from  'styled-components'

export const List = styled.ul`
    display: flex;
    flex-direction: column;

    li {
        border-radius: 0.25rem;
        padding: 8px;
        margin: 5px;
        position: relative; 
    }

    li:hover {
        background: #f0f0f0;
    }

    li:active {
        background: #f0f0f0;
        color: #04AA6D;
    }

    a span {
        display: flex;
        flex-direction: row;
        gap: 10px;
        color: var(--text-color);
        text-decoration: none;
    }

    a span img {
        width: 16px;
        height: 16px;
    }
`