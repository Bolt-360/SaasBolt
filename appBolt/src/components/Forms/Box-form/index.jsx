import { Select } from "../../Select";
import { Form } from "../Form";
import { Button } from '../../Button'
import { Container } from "./style";

export function BoxForm() {
    return(
        <Container>
            <Select />
            <Form />
            <Button />
        </Container>
    )
}