import styled from "styled-components";

export const Container = styled.table`
    max-width: 1200px;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.20) 0px 1px 4px;
    border-spacing: 0;
    border-collapse: separate;

    tbody tr {
        &:hover {
            background-color: #f1f1f1;
        }
    }

    td {
        text-align: center;
        border-top: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        padding: 1rem;
        color: #6c757d;
    }

    th {
        color: #6c757d;
        padding: 1rem;
        text-transform: uppercase;
        font-size: 87.5%;
    }

    .nome {
        font-weight: 600;
    }

    .status span {
        border-radius: 0.5rem;
        padding: 0.20rem;
        background: var(--border-color);
        color: #fff;
    }
`