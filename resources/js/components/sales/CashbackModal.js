import React from "react";

import Modal from "react-bootstrap/lib/Modal";
import Button from 'react-bootstrap/lib/Button';



const CashbackModal = ({show, action, to_charge,  to_cashback, handleChange, keyUp}) => (

    <>

        <Modal show={show} bsSize="small">
            <Modal.Header>
                <Modal.Title componentClass="h3">Vuelto</Modal.Title>
            </Modal.Header>
            <div className="modal-body">




                <table className="table table-bordered">
                    <thead>

                    </thead>
                    <tbody style={{fontSize:"25px"}}>
                    <tr><td colSpan={"2"}> <input id="received_money" type="number" name="received_money" className="form-control" placeholder="Recibo" onKeyUp={keyUp} onChange={(e) => {handleChange(e)}}
                    /></td></tr>
                    <tr><td>COBRO</td>
                    <td>{to_charge}</td>
                    </tr>
                    <tr><td>VUELTO</td>
                        <td>{to_cashback}</td>
                    </tr>

                    </tbody>
                </table>

            </div>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={action} bsSize="large">
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
);

export default CashbackModal;

