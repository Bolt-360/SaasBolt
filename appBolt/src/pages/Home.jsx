import { ConteudoHome } from "../components/templates/ConteudoHome";
import { Menu } from "../components/Menu";
import { GlobalStyle } from "../styles/global";

export function Home() {
    return (
        <>
            <Menu />
            <ConteudoHome /> 
            <GlobalStyle />
        </>
    )
}