import { TArea } from "./style";

export function TextArea() {
    return(
        <TArea>
            <label htmlFor="mensagem">Mensagem</label>
            <textarea id="mensagem" placeholder="Digite a mensagem..."></textarea>
        </TArea>
    )
}