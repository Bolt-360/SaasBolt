import { Container } from './style'
import icon from '../../../assets/icon.png'
import { FaBars } from 'react-icons/fa'


export function IconMenu({ toggleSidebar }) {
    return (
        <Container>
            <a href="http://localhost:8080/">
                <span>
                    <img src={icon} alt="Bchat" />
                    <span>Bchat - API</span>
                </span>
            </a>
            <FaBars onClick={toggleSidebar}/>
        </Container>
    )
}