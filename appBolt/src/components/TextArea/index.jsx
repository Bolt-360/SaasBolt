import { TArea } from "./style";

export function TextArea() {
    return(
        <TArea>
            <label htmlFor="mensagem">Mensagem</label>
            <textarea type="text" id="mensagem" placeholder="Digite a mensagem..."/>
        </TArea>
    )
}