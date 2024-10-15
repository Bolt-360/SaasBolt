import { Balao } from "../Balao";
import { User } from "../User";
import { Pagina } from "../Pagina";

export function ConteudoHome() {
    return (
        <>
            <Pagina>
                <User />
                <Balao />
            </Pagina> 
        </>
    )
}