import { BsThreeDotsVertical } from 'react-icons/bs';

export function List() {
    return (
        <div className="box-table">
            <div>
                <span>Listar e Visualizar / </span>
                <span><strong>Instâncias</strong></span>
            </div>

            <div>
                <table className="table">
                    <thead>
                        <tr className="text-left">
                            <th>#</th>
                            <th>Nome da Instância</th>
                            <th>Número</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#</td>
                            <td><strong>Alfa-Financeiro</strong></td>
                            <td>558196633962@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                        <tr>
                            <td>#</td>
                            <td><strong>Alfa-Clube-de-Beneficios</strong></td>
                            <td>558791022416@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                        <tr>
                            <td>#</td>
                            <td><strong>Alfa-Regional-Fortaleza</strong></td>
                            <td>558581558181@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                        <tr>
                            <td>#</td>
                            <td><strong>Alfa-Regional-Natal</strong></td>
                            <td>558487015870@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                        <tr>
                            <td>#</td>
                            <td><strong>Disparos_Rastreamento</strong></td>
                            <td>558192879119@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                        <tr className='semBorda'>
                            <td>#</td>
                            <td><strong>Disparos-alfa</strong></td>
                            <td>558189763100@s.whatsapp.net</td>
                            <td>Instancia Conectada</td>
                            <td><BsThreeDotsVertical size={18} style={{ cursor: 'pointer' }} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}