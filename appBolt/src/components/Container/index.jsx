import { Menu } from "../Menu";
import { Pagina } from "../Pagina";
import { User } from "../User";
import { Container } from "./style";
import { Balao } from "../Balao";

export function PageContainer() {
    return (
        <Container>
            <Menu />
            <Pagina> 
                <User />
                <Balao />
            </Pagina>
        </Container>
    )
}