import { Menu } from "../../Menu";
import { Pagina } from "../../Pagina";
import { User } from "../../User";
import { Container } from "./style";
import { Balao } from "../../Balao";
import { GlobalStyle } from "../../../styles/global";

export function HomeContainer() {
    return (
        <Container>
            <Menu />
            <Pagina> 
                <User />
                <Balao />
            </Pagina>
            <GlobalStyle/>
        </Container>
    )
}