import styled from "styled-components";

export const Container = styled.div`
    border-radius: 0.375rem;
    outline: none;

    input {
        width: 100%;
        outline: 2px solid transparent;
        outline-offset: 2px;
        display: none;
    }

    .custom-file-upload {
        width: 100%;
        display: flex;
        padding: 10px 20px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: background-color 0.3s;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    span {
        border-left: 1px solid #ccc;
        margin-left: 1rem;
        padding-left: 1rem;
    }
`