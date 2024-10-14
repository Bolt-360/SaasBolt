import { InputNumber } from '../InputNumber'
import { Select } from '../Select'
import { TextArea } from '../TextArea'
import { Form } from './style'

export function Forms() {
    return(
        <Form> 
            <Select />
            <TextArea />
            <InputNumber /> 
        </Form>
    )
}