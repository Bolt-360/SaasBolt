import { Container } from "./style";
import { useState } from "react";

export function Checkbox() {
    const [openSubInput, setOpenSubInput] = useState(false);

    const handleSubInputToggle = () => {
        setOpenSubInput(!openSubInput);
    }

    return(
        <Container>
            <div className="checkbox">
                <label htmlFor="arquivos">Enviar arquivo</label>
                <input type="checkbox" id="arquivos" onClick={handleSubInputToggle}/>
            </div>

            {openSubInput && (
                <div className="click-checkbox">
                    <select>
                        <option value="">Imagem</option>
                        <option value="">Documento</option>
                    </select>
                    <input
                    type="text"
                    placeholder="Insira a URL da imagem ou arquivo..."
                    />
                </div>
            )}
        </Container>
    )
}