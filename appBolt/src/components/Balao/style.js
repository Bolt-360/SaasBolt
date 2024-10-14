import styled from 'styled-components'

export const Container = styled.div`
    margin-top: 20px;
    max-width: 1000px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
`

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;

    h1 {
        font-size: 1.125rem;
        color: #15803d;
    }

    div {
        max-width: 510px;
    }

    div p {
        color: var(--text-color)
    }
`

export const Image = styled.div`
    img {
        width: 13rem;
        height: 10rem;
    }
`


