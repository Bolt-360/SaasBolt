import { Balao } from "../Balao";
import { User } from "../User";
import { Pagina } from "./Pagina";

export function ConteudoHome() {
    return (
        <div>
            <Pagina>
                <User />
                <Balao />
            </Pagina> 
        </div>
    )
}