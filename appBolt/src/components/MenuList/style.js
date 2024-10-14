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
        background: #E0E0E0;
    }

    li:active {
        background: #E0E0E0;
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