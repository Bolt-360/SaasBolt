import { Container, Content, Image } from './style'
import laptop from '../../assets/laptop.png'

export function Balao() {
    return (
        <Container>
            <Content> 
                <h1>Parabéns, Alfa Clube de Benefícios</h1>
                <div>
                    <p>Agora você tem chance de aumentar em até 89% as vendas do seu negocio, com mensagens publicitárias diretamente no whatsapp dos seus clientes.</p>
                </div>
            </Content>
            <Image> 
                <img src={laptop} alt="" />
            </Image>
        </Container>
    )
}