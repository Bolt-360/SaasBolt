import { Container } from "./style";
import { BsThreeDotsVertical } from 'react-icons/bs';

export function Table({dados, handleModalOpen, buttonRef}) {
    return(
        <Container>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome da Instância</th>
                    <th>Número</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((item, index) => (
                        <tr key={index}>
                            <td>{item.hashtag}</td>
                            <td className="nome">{item.nome}</td>
                            <td>{item.numero}</td>
                            <td className="status">
                                <span>{item.status}</span>
                            </td>
                            <td>
                                <BsThreeDotsVertical 
                                size={18} 
                                style={{ cursor: 'pointer' }} 
                                onClick={(e) => handleModalOpen(e, index)} 
                                />
                            </td>
                        </tr>
                    ))} 
            </tbody>
        </Container>
    )
}