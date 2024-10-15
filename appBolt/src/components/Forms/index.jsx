import { TextSpan } from '../TextSpan'
import { BoxForm } from './Box-form'
import { Container } from './style'

export function Forms() {
    return(
        <Container>
            <TextSpan>
                <span>Importar / </span>
                <span><strong>Enviar em massa</strong></span>
            </TextSpan>
            <BoxForm />
        </Container>
    )
}