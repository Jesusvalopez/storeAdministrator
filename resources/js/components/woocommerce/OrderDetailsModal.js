import React from "react";

import Modal from "react-bootstrap/lib/Modal";
import Button from 'react-bootstrap/lib/Button';
import printJS from "print-js";
import Moment from "moment";

const convertNumber = (value) =>{

    var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


    return response;
};

const printOrder = (line_items) => {

    var orders = [];

    line_items.map((item) =>{

        var html = "<table><thead><tr><th>" + item.name + '</th></tr></thead><tbody>';

        item.meta_data.map(meta =>{

            html += "<tr><td><b>" +meta.display_key + "</b>: " + meta.display_value + "</td></tr>";

            return html;

        })
        html += "</tbody></table>";
        var order_model = {producto: html, cantidad: item.quantity}

        orders.push(order_model);

    })


    printJS({

        printable: orders,
        type: 'json',
        properties: ['producto', 'cantidad'],
        header: '<h3 class="custom-h3">'+Moment().format('DD/MM/YY HH:mm:ss')+'</h3>',
        gridStyle: 'text-align: center;border: 1px solid lightgray;',


    })

}

const OrderDetailsModal = ({show, close, order, getMetaData}) => (

    <>

        <Modal show={show} bsSize="large">
            <Modal.Header>
                <Modal.Title componentClass="h3">Pedido #{order ? order.id : null}</Modal.Title>
            </Modal.Header>
            <div className="modal-body">




                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Artículo</th>
                            <th>Coste</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                    {order ? order.line_items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}

                            <table>
                               <tbody>
                               {item.meta_data.map(meta =>(
                                   <tr key={meta.id}>
                                       <td><b>{meta.display_key}: </b></td>
                                       <td>{meta.display_value}</td>
                                   </tr>
                               ))}
                               </tbody>
                            </table>

                            </td>
                            <td>{convertNumber(Math.round(item.price))}</td>
                            <td>{item.quantity}</td>
                            <td>{convertNumber(Math.round(item.total))}</td>
                        </tr>
                    )) : null}
                    {order ? order.coupon_lines.map(coupon => (
                        <tr key={coupon.id}>
                            <td>Cupón: <b>{(coupon.code).toUpperCase()}</b>
                            </td>
                            <td>-{convertNumber(Math.round(coupon.discount))}</td>
                            <td>1</td>
                            <td>-{convertNumber(Math.round(coupon.discount))}</td>
                        </tr>
                    )) : null}

                    </tbody>
                    <tfoot>
                    {order ?
                        <tr>
                            <td colSpan={2}><b>Envío</b></td>
                            <td>{order.shipping_lines[0].method_title}</td>
                            <td>{convertNumber(Math.round(order.shipping_total))}</td>

                        </tr>

                        : null}
                    {order ?
                        <tr>
                            <td colSpan={3}><b>Total</b></td>

                            <td>{convertNumber(Math.round(order.total))}</td>

                        </tr>

                        : null}
                    </tfoot>
                </table>

                <div className="row">
                <div className="col-md-12"><h4><b>Detalles envío</b></h4></div>
                <div className="col-md-4">

                    <p>Dirección:</p>
                    {order ? <p><b>{order.shipping.address_1} dpto: {getMetaData(order.meta_data, 'billing_dpto')}, {order.shipping.city}</b></p> : null}

                </div>
                    <div className="col-md-3">
                        <p>Teléfono:</p>
                        {order ? <p><b> {order.billing.phone}</b></p> : null}

                    </div>
                    <div className="col-md-3">
                        <p>Correo:</p>
                        {order ? <p><b>{order.billing.email}</b></p> : null}

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12"><h4><b>Notas</b></h4></div>
                    <div className="col-md-4">
                    {order ? <p><b>{order.customer_note}</b></p> : null}

            </div>
            </div>
            </div>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={() => printOrder(order.line_items)} bsSize="large">
                    Preparar pedido
                </Button>
                <Button bsStyle="primary" onClick={() => printOrder(order.line_items)} bsSize="large">
                    Imprimir comanda
                </Button>
                <Button bsStyle="primary" onClick={close} bsSize="large">
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
);

export default OrderDetailsModal;

