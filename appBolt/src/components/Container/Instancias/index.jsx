import { Menu } from "../../Menu";
import { Pagina } from "../../Pagina";
import { User } from "../../User";
import { Container } from "./style";
import { GlobalStyle } from "../../../styles/global";
import { Table } from "../../Table";
import { TextSpan } from "../../TextSpan";

export function InstanciaContainer() {
    let dados = [
        {
            hashtag: '#', 
            nome: 'Alfa-Financeiro', 
            numero: '558196633962@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Clube-de-Beneficios', 
            numero: '558791022416@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Regional-Fortaleza', 
            numero: '558581558181@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Regional-Natal', 
            numero: '558487015870@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Disparos-alfa', 
            numero: '558189763100@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Rastreamento_novo', 
            numero: '558192879119@s.whatsapp.net', 
            status: 'Instancia Conectada'
        }
    ]
    
    return (
        <Container>
            <Menu />
            <Pagina> 
                <User />
                <TextSpan />
                <Table dados={dados}/>
            </Pagina>
            <GlobalStyle/>
        </Container>
    )
}