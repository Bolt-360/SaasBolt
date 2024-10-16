import { Input } from './style'

export function InputNumber() {
    return(
        <Input>
            <label htmlFor="tempo">Tempo de espera entre as mensagens</label>
            <input type="number" id="tempo"/>
        </Input>
    )
}