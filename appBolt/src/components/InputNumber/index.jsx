import { Input } from './style'

export function InputNumber() {
    return(
        <Input>
            <label htmlFor="tempo">Tempo de espera entre as mensagens</label>
            <input type="number" id="tempo" className="border p-0 rounded-md w-full outline-none focus:border-green-500"/>
        </Input>
    )
}