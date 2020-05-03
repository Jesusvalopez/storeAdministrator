import React from "react";

import Modal from "react-bootstrap/lib/Modal";
import Button from 'react-bootstrap/lib/Button';

const ConfirmModal = ({handleClose, show, text, action}) => (
    <>

            <Modal show={show} onHide={handleClose} >
                <Modal.Header>
                    <Modal.Title componentClass="h3">Confirmar acción</Modal.Title>
                </Modal.Header>
                <Modal.Body componentClass="h4">{text}</Modal.Body>
                <Modal.Footer>
                    <Button  onClick={handleClose} bsSize="large">
                        No
                    </Button>
                    <Button bsStyle="primary" onClick={action} bsSize="large">
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
);

export default ConfirmModal;

