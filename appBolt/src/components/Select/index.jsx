import { InputSelect } from "./style"

export function Select() {
    return(
        <InputSelect>
            <label htmlFor="options">SELECIONE A INSTÂNCIA</label>
            <select id="options">
                <option value="" disabled selected>Selecione...</option>
                <option value="Alfa-Financeiro">Alfa-Financeiro</option>
                <option value="Alfa-Clube-de-Beneficios">Alfa-Clube de Benefícios</option>
                <option value="Alfa-Regional-Fortaleza">Alfa-Regional Fortaleza</option>
                <option value="Alfa-Regional-Natal">Alfa-Regional Natal</option>
                <option value="Disparo-Rastreamento">Disparo-Rastreamento</option>
                <option value="Disparo-Alfa">Disparo-Alfa</option>
            </select>
    </InputSelect>
    )
}