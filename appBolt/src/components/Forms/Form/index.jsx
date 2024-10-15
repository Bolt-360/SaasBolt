import { Container } from "../style";
import { Checkbox } from '../../Checkbox'
import { InputNumber } from '../../InputNumber'
import { InputUpload } from '../../InputUpload'
import { TextArea } from '../../TextArea'

export function Form() {
    return(
        <Container>
            <TextArea />
            <InputNumber /> 
            <Checkbox />
            <InputUpload />
        </Container>
    )
}