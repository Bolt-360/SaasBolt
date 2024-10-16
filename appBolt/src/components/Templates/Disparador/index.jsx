import { Menu } from "../../Menu";
import { Pagina } from "../../Pagina";
import { User } from "../../User";
import { Container } from "./style";
import { Balao } from "../../Balao";
import { GlobalStyle } from "../../../styles/global";
import { Forms } from "../../Forms";

export function DisparadorContainer() {
    return (
        <Container>
            <Menu />
            <Pagina> 
                <Forms />
            </Pagina>
            <GlobalStyle/>
        </Container>
    )
}