import { Icon } from './style'
import icon from '../../assets/icon.png'

export function IconMenu() {
    return (
        <Icon>
            <a href="http://localhost:8080/">
                <span>
                    <img src={icon} alt="Bchat" />
                    <span>Bchat - API</span>
                </span>
            </a>
        </Icon>
    )
}