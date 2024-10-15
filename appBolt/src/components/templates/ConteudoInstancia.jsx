import { List } from "../List";
import { User } from "../User";
import { Pagina } from "../Pagina";

export function ConteudoInstancia() {
    return (
        <div className="mx-32 my-5">
            <Pagina>
                <div className="flex flex-col gap-7">
                    <User />
                    <List />
                </div>
            </Pagina> 
        </div>
    )
}