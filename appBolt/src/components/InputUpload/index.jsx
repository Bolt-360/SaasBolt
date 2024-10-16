import { Container } from "./style";

export function InputUpload() {
    return(
        <Container>
            <label className="custom-file-upload">
                <input type="file"/>    
                Escolher arquivo
                <span>Nenhum arquivo selecionado</span>
            </label>
        </Container>
    )
}