import Modal from 'react-modal'
import { Container, ContainerItem } from './style'

export function ModalList({ modalOpen, handleModalClose, buttonPosition, selectedItemIndex, dados} ) {
    if (!modalOpen || selectedItemIndex === null) {
        return null
    }

    const selectedItem = dados[selectedItemIndex];

    return (
        <Modal
        isOpen={modalOpen} 
        onRequestClose={handleModalClose}
        overlayClassName="react-modal-overlay"
        className='react-modal-content'
        style={{
            content: {
                position: 'absolute',
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left}px`,
                righy: 'auto',
                bottom: 'auto',
                transform: 'translate(0,0)'
            }
        }}
        >
            <Container>
                <ContainerItem onClick=''>Gerar QRCODE</ContainerItem>
                <ContainerItem onClick=''>Desconectar</ContainerItem>
                <ContainerItem onClick=''>Deletar</ContainerItem>
            </Container>
        </Modal>
    )
}