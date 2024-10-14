import { ConteudoDisparador } from "../components/templates/ConteudoDisparador";
import { Menu } from "../components/Menu";
import { GlobalStyle } from "../styles/global";

export function Disparador() {
    return (
        <div className="flex flex-1">
            <Menu />
            <ConteudoDisparador /> 
            <GlobalStyle />
        </div>
        
    )
}