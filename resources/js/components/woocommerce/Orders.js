import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ContentLoader from "react-content-loader";
import Moment from 'moment';
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmModal from "../ConfirmModal";
import {toast} from "react-toastify";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const PaymentMethodLoader = () => (
    <ContentLoader width={'100%'} height={100}>
        <rect x="0%" y="4" rx="0" ry="0" width="100%" height="22" />

        <rect x="0%" y="33" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="33" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="33" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="33" rx="0" ry="0" width="20%" height="13" />
        <rect x="0%" y="55" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="55" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="55" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="55" rx="0" ry="0" width="20%" height="13" />
        <rect x="0%" y="77" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="77" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="77" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="77" rx="0" ry="0" width="20%" height="13" />


    </ContentLoader>
);

export default class Orders extends Component {



    constructor(props){
        super(props);


        this.state = {
            orders: null,
            order: null,
            show_order_modal: false,
            show_confirm_modal: false,
            text: '',
            order_to_finish_id: null,
            blocking: false,
        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);



    componentDidMount() {

        axios.get('/woocommerce/orders')
            .then(res => {
                console.log(res.data);

                this.setState({
                    orders: res.data.orders
                })


            })

    }

    convertNumber = (value) =>{

        var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };

    showOrderDetails = (order) =>{
        this.setState({
            order:order,
            show_order_modal: true,
        });
    }



    closeModal = () =>{

        this.setState({
            show_order_modal:false
        });

    }

    translateStatus(status){

        switch(status){
            case 'processing':
                return 'Procesando';
                break;
            case 'completed':
                return 'Completado';
                break;
            case 'cancelled':
                return 'Cancelado';
                break;
            case 'on-hold':
                return 'En Espera';
                break;
        }

    }


    showConfirmModal(order_id){

        this.setState({
            order_to_finish_id: order_id,
            show_confirm_modal: true,
            text: '¿Desear marcar el pedido #'+order_id+' como finalizado?'
        })

    }

    showButtonsByStatus = (status, order_id) =>{

        return (
            <>
                {status == 'processing' ? <a href="#" onClick={() => this.showConfirmModal(order_id)} className="btn btn-xs btn-primary">Finalizar pedido</a> : null }

            </>
        )

    }
    getMetaDataByKey(meta_data, key){
        var trxResponse = meta_data.find(meta => meta.key === key);

        if(trxResponse){
            return trxResponse.value
        }else{
            return '';
        }
    }
    handleClose = () =>{
        this.setState({show_confirm_modal:false})
    }

    finishOrder = (e) =>{
        e.preventDefault();

        this.setState({blocking:true},
            ()=>{

                try {

                    // <input type="hidden" name="_method" value="delete">//{params: {id: id}})
                    axios.post('/woocommerce/finish-order', {'order_id': this.state.order_to_finish_id}  )
                        .then(res => {

                      //      console.log(res.data);

                            this.setState({show_confirm_modal:false, order_to_finish_id: null, orders: res.data.orders, blocking:false});
                            this.notify('Orden completada');

                        })
                }catch (e) {
                    this.notifyError('No se pudo completar la acción')
                }


            })



    }

    render(){

        return (
            <div>


                <div className="col-md-12">


                    <div className="box box-success">
                        <div className="box-header with-border">
                            <h3 className="box-title">Últimas órdenes</h3>
                        </div>
                        <div className="box-body">
                            {
                                this.state.orders ?
                            <table  className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Estado Transacción</th>
                                    <th>Detalles envío</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>

                                <tbody>


                                {   this.state.orders.map((order) =>(
                                            <tr key={order.id}>
                                                <td><a href="#" onClick={() =>this.showOrderDetails(order)}>#{order.id} {order.billing.first_name} {order.billing.last_name}</a></td>
                                                <td>{Moment(order.date_created).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{this.translateStatus(order.status)}</td>
                                                <td>{this.getMetaDataByKey(order.meta_data, 'transactionResponse')} - {this.getMetaDataByKey(order.meta_data, 'paymentCodeResult')}</td>
                                                <td>Horario entrega: {order.meta_data.find(meta => meta.key === 'delivery_time').value}</td>
                                                <td>{this.convertNumber(Math.round(order.total))}</td>
                                                <td>{this.showButtonsByStatus(order.status, order.id)}</td>
                                            </tr>
                                        ))

                                }

                                </tbody>

                            </table>
                                    : <PaymentMethodLoader></PaymentMethodLoader>
                            }

                            <small>Venta Normal = Webpay Crédito</small>
                            <br/>
                            <small>Venta Débito = Webpay Débito</small>

                        </div>


                    </div>

                </div>

                <OrderDetailsModal  show={this.state.show_order_modal} close={this.closeModal} order={this.state.order} getMetaData={this.getMetaDataByKey} ></OrderDetailsModal>
                <BlockUi tag="div" blocking={this.state.blocking}>
                    <div className="row">
                <ConfirmModal handleClose={this.handleClose} show={this.state.show_confirm_modal} text={this.state.text} action={this.finishOrder}/>
                    </div>
                </BlockUi>
                </div>

        );
    }
}

if (document.getElementById('woocommerceOrders')) {

    ReactDOM.render(<Orders/>, document.getElementById('woocommerceOrders'));
}

