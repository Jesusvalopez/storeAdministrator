import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import CashboxModal from "./CashboxModal";
import CashboxCounter from "./CashBoxCounter";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";

export default class Cashboxes extends Component {



    constructor(props){
        super(props);

        const currency = [{id:1, value:10, total:0, quantity:''}, {id:2, value:50, total:0, quantity:''}, {id:3, value:100, total:0, quantity:''},
            {id:4, value:500, total:0, quantity:''},{id:5, value:1000, total:0, quantity:''}, {id:6, value:2000, total:0, quantity:''},
            {id:7, value:5000, total:0, quantity:''}, {id:8, value:10000, total:0, quantity:''}, {id:9, value:20000, total:0, quantity:''}];

        const currency_withdraw = [{id:1, value:10, total:0, quantity:''}, {id:2, value:50, total:0, quantity:''}, {id:3, value:100, total:0, quantity:''},
            {id:4, value:500, total:0, quantity:''},{id:5, value:1000, total:0, quantity:''}, {id:6, value:2000, total:0, quantity:''},
            {id:7, value:5000, total:0, quantity:''}, {id:8, value:10000, total:0, quantity:''}, {id:9, value:20000, total:0, quantity:''}];
        this.state = {

            cashbox_form:currency,
            cashbox_withdraw_form:currency_withdraw,
            total:0,
            total_withdraw:0,
            last_cashboxes: [],
            last_cashbox: null,
            currency: currency,
            buttonText: 'Abrir caja',
            box_type : 1,
            notifyMessage: 'Caja abierta con éxito',
            show:false,
            total_cash:0,
            total_last_cashbox:0,
            show_difference_modal:false,
            difference:0,

        }
        toast.configure();

    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarning = (text) => toast.warn(text);

    convertNumber = (value) =>{

        var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };


    componentDidMount() {

        this.reloadLastCashboxes();

        this.reloadLastCashTotal();

    }

    reloadLastCashTotal(){
        axios.get('/sales/daily-cash-total')
            .then(res => {
                console.log(res.data);
                this.setState( {

                    total_cash_sales: parseInt(res.data.last_cash_sales),
                    total_last_cashbox: res.data.last_cashbox_total,
                    total_cash: parseInt(res.data.last_cash_sales) + res.data.last_cashbox_total,

                } );


            })
    }
    reloadLastCashboxes(){
        axios.get('/cashboxes/listing')
            .then(res => {
                console.log(res.data);
                var buttonText = 'Abrir caja';
                var notifyMessage = 'Caja abierta con éxito';
                var boxType = 1;
                if(res.data[0].cashbox_type === 1){
                    buttonText = 'Cerrar caja';
                    notifyMessage = 'Caja cerrada con éxito';
                    boxType = 2;
                }

                this.setState( {

                    last_cashboxes: res.data,
                    buttonText: buttonText,
                    notifyMessage: notifyMessage,
                    box_type: boxType,
                    last_cashbox: res.data[0],

                } );


            })
    }

    calculateTotal = (cashbox) =>{

        var total = 0;



        cashbox.cashbox_details.map(cashbox_detail => {

            this.state.currency.map(currency => {

                if(currency.id == cashbox_detail.cash_type){
                    total += cashbox_detail.quantity * currency.value;
                }

            })


        });

        return total;
    }

    handleUpdateFormWithdrawal = (e) => {

        const target_id = e.target.name
        const target_value = e.target.value

        this.setState(prevState => {

            var currency = [...prevState.cashbox_withdraw_form];

            var new_total = 0;

            var new_currency = currency.map(currency => {

                if (currency.id == target_id) {


                    currency.quantity = target_value;
                    currency.total = currency.value * currency.quantity;
                    new_total += currency.total;

                    return currency;
                }
                new_total += currency.total;

                return currency;
            });
            return {cashbox_withdraw_form:new_currency, total_withdraw: new_total};

        });

    }
    handleUpdateJustification = (e) => {


        this.setState({
                [e.target.name]: e.target.value

        });


    }
    handleUpdateForm = (e) => {

        const target_id = e.target.name
        const target_value = e.target.value

        this.setState(prevState => {

            var currency = [...prevState.cashbox_form];

            var new_total = 0;

            var new_currency = currency.map(currency => {

                if (currency.id == target_id) {


                    currency.quantity = target_value;
                    currency.total = currency.value * currency.quantity;
                    new_total += currency.total;

                    return currency;
                }
                new_total += currency.total;

                return currency;
            });
            return {cashbox_form:new_currency, total: new_total};

        });


    }

    resetForm = () => {

        this.setState(prevState => {

            var currency = [...prevState.cashbox_form];


            var new_currency = currency.map(currency => {


                    currency.quantity = '';
                    currency.total = 0;


                return currency;
            });
            return {cashbox_form:new_currency, total: 0};

        });

    }

    handleSubmit = (e) =>{
        e.preventDefault();

        if (this.state.box_type === 2) {

            console.log(this.state.total);
            console.log(this.state.total_cash);

            if (this.state.total !== this.state.total_cash) {


                this.setState({
                    show_difference_modal:true,
                    difference: this.state.total_cash - this.state.total,
                });

            } else {

                this.setState({
                    show: true,
                });
            }
        } else {
            this.handleOk();
        }

        /*
        try {
            axios.post('/cashboxes',  this.state.cashbox_form )
                .then(res => {


                    this.resetForm();
                    this.notify(this.state.notifyMessage);
                    this.reloadLastCashboxes();

                });

        }catch (e) {
            this.notifyError('No se pudo obtener la información')
        }
        */

    }

    handleDifferenceModalAccept = () =>{

        this.setState({
            show:true,
            show_difference_modal:false,

        });

    }
    handleWithdraw = () =>{

        //restar de cashbox_form el cashbox_withdraw_form


    }


    handleOk = () =>{

        this.setState({
            show:false,

        });


        try {
            axios.post('/cashboxes',  this.state.cashbox_form )
                .then(res => {


                    this.resetForm();
                    this.notify(this.state.notifyMessage);
                    this.reloadLastCashboxes();
                    this.reloadLastCashTotal();


                });

        }catch (e) {
            this.notifyError('No se pudo obtener la información')
        }


    }

    handleCloseDifferenceModal = () =>{
        this.setState({
            show_difference_modal:false,

        });
    }
    handleClose = () =>{
        this.setState({
            show:false,

        });
    }


    render(){

        return (
            <div className="row">
                <div className="col-md-4">

                    <CashboxCounter show_button={true} text="Caja" handleSubmit={this.handleSubmit} cashbox_form={this.state.cashbox_form} handleUpdateForm={this.handleUpdateForm} total={this.state.total} buttonText={this.state.buttonText}></CashboxCounter>

                </div>


                <div className="col-md-8">


                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Últimas cajas</h3>
                            </div>
                            <div className="box-body">
                                <div className="">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Fecha</th>
                                            <th className="text-center">Vendedor</th>
                                            <th className="text-center">Tipo</th>
                                            <th className="text-center">Detalle</th>
                                            <th className="text-center">Efectivo</th>
                                            <th className="text-center">Transferencia</th>
                                            <th className="text-center">Tarjeta</th>
                                            <th className="text-center">Rappi</th>
                                            <th className="text-center">Pedidos Ya</th>
                                            <th className="text-center">Diferencia</th>
                                            <th className="text-center">Total</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.last_cashboxes.map((cashboxes) => (
                                            <tr key={cashboxes.id}>
                                                <td className="text-center">{cashboxes.date_time}</td>
                                                <td className="text-center">{cashboxes.seller.name}</td>
                                                <td className="text-center">{cashboxes.cashbox_type_name}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center"> {cashboxes.details}</td>
                                                <td className="text-center">{this.convertNumber(Math.round(this.calculateTotal(cashboxes)))}</td>
                                            </tr>
                                        ))}


                                        </tbody>

                                    </table>

                                </div>

                            </div>


                        </div>

                </div>





                <Modal show={this.state.show} bsSize='lg'>
                    <Modal.Header>
                        <Modal.Title componentClass="h3">Cierre de caja</Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">

                        <div className="row">
                            <div className="col-md-3"><h4>Monto en caja: <b>{this.convertNumber(this.state.total)}</b></h4></div>
                            <div className="col-md-3"><h4>Monto a retirar: <b>{this.convertNumber(this.state.total_withdraw)}</b></h4></div>
                            <div className="col-md-6"><h4>Monto restante en caja: <b>{this.convertNumber(this.state.total - this.state.total_withdraw)}</b></h4></div>


                        </div>
                        <CashboxCounter show_button={false} text="Retiro" handleSubmit={()=>{}} cashbox_form={this.state.cashbox_withdraw_form} handleUpdateForm={this.handleUpdateFormWithdrawal} total={this.state.total_withdraw} buttonText="Retirar"></CashboxCounter>



                    </div>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleClose} bsSize="large">
                            Cancelar
                        </Button>
                        <Button bsStyle="primary" onClick={this.handleWithdraw} bsSize="large">
                            Retirar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.show_difference_modal}>
                    <Modal.Header>
                        <Modal.Title componentClass="h3">Diferencia de caja</Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">



                        <div className="">
                            <h3 className="text-center">Existe una diferencia de: <b>{this.convertNumber(this.state.difference)}</b></h3>
                        <label htmlFor="">Justificación:</label>
                        <textarea className="form-control" name="justification" id="" cols="30" rows="10" onChange={this.handleUpdateJustification}></textarea>
                            <small>*Presione cancelar si desea contar nuevamente</small>
                        </div>


                    </div>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleCloseDifferenceModal} bsSize="large">
                            Cancelar
                        </Button>
                        <Button bsStyle="primary" onClick={this.handleDifferenceModalAccept} bsSize="large">
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>


            </div>
        );
    }
}

if (document.getElementById('cashboxes')) {

    ReactDOM.render(<Cashboxes/>, document.getElementById('cashboxes'));
}

