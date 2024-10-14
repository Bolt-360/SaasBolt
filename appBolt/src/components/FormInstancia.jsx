import { useState } from "react";

export function FormInstancia() {
    const [openSubInput, setOpenSubInput] = useState(false);

    const handleSubInputToggle = () => {
        setOpenSubInput(!openSubInput);
    }

    return (
        <div className="container-form">
            <div>
                <span className="text-lg">Importar / </span>
                <span className="text-xl font-bold">Enviar em massa</span>
            </div>

            <div className="box-form">
                <div className="flex flex-col">
                    <label htmlFor="options" className="mb-2 font-medium">SELECIONE A INSTÂNCIA</label>
                    <select id="options" className="border rounded-md p-2 outline-none focus:border-green-500">
                        <option value="" disabled selected>Selecione...</option>
                        <option value="Alfa-Financeiro">Alfa-Financeiro</option>
                        <option value="Alfa-Clube-de-Beneficios">Alfa-Clube de Benefícios</option>
                        <option value="Alfa-Regional-Fortaleza">Alfa-Regional Fortaleza</option>
                        <option value="Alfa-Regional-Natal">Alfa-Regional Natal</option>
                        <option value="Disparo-Rastreamento">Disparo-Rastreamento</option>
                        <option value="Disparo-Alfa">Disparo-Alfa</option>
                        </select>
                </div>

                <form action="" className="form">
                    <div className="flex gap-1 items-center border rounded-md">
                        <label htmlFor="mensagem">Mensagem</label>
                        <textarea type="text" id="mensagem" placeholder="Digite a mensagem..." className="border rounded-r-md p-2 w-full outline-none focus:border-green-500"/>
                    </div>

                    <div className="flex items-center gap-1">
                        <label htmlFor="tempo">Tempo de espera entre as mensagens</label>
                        <input type="number" id="tempo" className="border p-0 rounded-md w-full outline-none focus:border-green-500"/>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <label htmlFor="arquivos">Enviar arquivo</label>
                            <input type="checkbox" name="" id="arquivos" className="" onClick={handleSubInputToggle}/>
                        </div>

                        {openSubInput && (
                            <div className="flex gap-3 mt-3">
                                <select className="border rounded-md p-2 w-full outline-none focus:border-green-500">
                                    <option value="">Imagem</option>
                                    <option value="">Documento</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Insira a URL da imagem ou arquivo..."
                                    className="border rounded-md p-2 w-full outline-none focus:border-green-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border rounded-md">
                        <input type="file" name="" id="" className="w-full outline-none focus:border-green-500"/>
                    </div>
                </form>

                <button className="border shadow-sm rounded-md flex left-0 w-16 p-2 text-green-600 hover:text-white hover:bg-green-400">Iniciar</button>
            </div>
        </div>
    )
}