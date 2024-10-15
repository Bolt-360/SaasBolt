import { Container } from "./style";

export function InputUpload() {
    return(
        <Container> 
            <input type="file" className="w-full outline-none focus:border-green-500"/>
        </Container>
    )
}