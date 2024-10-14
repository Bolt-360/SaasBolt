import { List } from "./style";
import whats from '../../assets/whatsapp.png'
import lista from '../../assets/lista.png'

export function MenuList() {
    return (
        <List>
            <li>
                <a href="http://localhost:8080/#/instancias">
                    <span>
                        <img src={lista} alt="" />
                        Listar Instâncias
                    </span>
                </a>
            </li>

            <li>
                <a href="http://localhost:8080/#/disparador">
                    <span>
                        <img src={whats} alt="" />
                        Disparador
                    </span>
                </a>
            </li>
        </List>
    )
}