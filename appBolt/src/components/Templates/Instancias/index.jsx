import { Menu } from "../../Menu";
import { Pagina } from "../../Pagina";
import { User } from "../../User";
import { Container } from "./style";
import { GlobalStyle } from "../../../styles/global";
import { Table } from "../../Table";
import { TextSpan } from "../../TextSpan";
import Modal from 'react-modal'
import { useState } from "react";
import { ModalList } from "../../ModalList";

Modal.setAppElement('#root');

export function InstanciaContainer() {
    let dados = [
        {
            hashtag: '#', 
            nome: 'Alfa-Financeiro', 
            numero: '558196633962@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Clube-de-Beneficios', 
            numero: '558791022416@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Regional-Fortaleza', 
            numero: '558581558181@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Alfa-Regional-Natal', 
            numero: '558487015870@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Disparos-alfa', 
            numero: '558189763100@s.whatsapp.net', 
            status: 'Instancia Conectada'
        },
        {
            hashtag: '#', 
            nome: 'Rastreamento_novo', 
            numero: '558192879119@s.whatsapp.net', 
            status: 'Instancia Conectada'
        }
    ]

    const [modalOpen, setModalOpen] = useState(false)
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    function handleModalOpen(event, index) {
        const rect = event.target.getBoundingClientRect();
        setButtonPosition({ top: rect.bottom, left: rect.left })
        setSelectedItemIndex(index);
        setModalOpen(true);           
    }

    function handleModalClose() {
        setModalOpen(false);
        setSelectedItemIndex(null)
    }
    
    return (
        <Container>
            <Menu />
            <Pagina> 
                <User />
                <TextSpan>
                    <span>Listar e Visualizar / </span>
                    <span><strong>Instâncias</strong></span>
                </TextSpan>
                <Table dados={dados} handleModalOpen={handleModalOpen}/>
            </Pagina>

            <ModalList
            modalOpen={modalOpen}
            handleModalClose={handleModalClose}
            buttonPosition={buttonPosition}
            selectedItemIndex={selectedItemIndex}
            dados={dados}
            />
            <GlobalStyle/>
        </Container>
    )
}