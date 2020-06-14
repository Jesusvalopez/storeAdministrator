import React from "react";

import Modal from "react-bootstrap/lib/Modal";
import Button from 'react-bootstrap/lib/Button';



const CashboxModal = ({show, action}) => (

    <>

        <Modal show={show} bsSize="medium">
            <Modal.Header>
                <Modal.Title componentClass="h3">Vuelto</Modal.Title>
            </Modal.Header>
            <div className="modal-body">




                <table className="table table-bordered">
                    <thead>

                    </thead>
                    <tbody style={{fontSize:"25px"}}>
                    <tr><td colSpan={"2"}> <input id="received_money" type="number" name="received_money" className="form-control" placeholder="Recibo"
                    /></td></tr>
                    <tr><td>COBRO</td>
                        <td></td>
                    </tr>
                    <tr><td>VUELTO</td>
                        <td></td>
                    </tr>

                    </tbody>
                </table>

            </div>
            <Modal.Footer>
                <Button bsStyle="default" onClick={action} bsSize="large">
                    Cancelar
                </Button>
                <Button bsStyle="primary" onClick={action} bsSize="large">
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
);

export default CashboxModal;

