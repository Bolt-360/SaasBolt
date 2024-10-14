import { Menu } from "../components/Menu";
import { ConteudoInstancia } from "../components/templates/ConteudoInstancia";
import { GlobalStyle } from "../styles/global";

export function Instancias() {
    return (
        <div className="flex flex-1">
            <Menu />
            <ConteudoInstancia /> 
            <GlobalStyle />
        </div>
        
    )
}