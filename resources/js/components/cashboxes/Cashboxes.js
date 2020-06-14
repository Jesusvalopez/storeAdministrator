import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import CashboxModal from "./CashboxModal";
import CashbackModal from "../sales/CashbackModal";

export default class Cashboxes extends Component {



    constructor(props){
        super(props);

        const currency = [{id:1, value:10, total:0, quantity:''}, {id:2, value:50, total:0, quantity:''}, {id:3, value:100, total:0, quantity:''},
            {id:4, value:500, total:0, quantity:''},{id:5, value:1000, total:0, quantity:''}, {id:6, value:2000, total:0, quantity:''},
            {id:7, value:5000, total:0, quantity:''}, {id:8, value:10000, total:0, quantity:''}, {id:9, value:20000, total:0, quantity:''}];
        this.state = {

            cashbox_form:currency,
            total:0,
            last_cashboxes: [],
            last_cashbox: null,
            currency: currency,
            buttonText: 'Abrir caja',
            box_type : 1,
            notifyMessage: 'Caja abierta con éxito',
            show:false,

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

        this.setState({
            show:true,

        });

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

    handleClose = () =>{
        this.setState({
            show:false,

        });
    }


    render(){

        return (
            <div className="row">
                <div className="col-md-6">
                    <form id="createCashboxForm" action="/" method="" onSubmit={this.handleSubmit}>

                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Caja</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Billete/Moneda</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-center">Total</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.cashbox_form.map((currency) => (
                                            <tr key={currency.id}>
                                                <td className="text-center">{this.convertNumber(Math.round(currency.value))}</td>
                                                <td className="text-center"> <input type="number" name={currency.id} className="form-control currency-input" placeholder="Cantidad"
                                                                                  onChange={this.handleUpdateForm} value={currency.quantity}/></td>
                                                <td className="text-center">{this.convertNumber(Math.round(currency.total))}</td>
                                            </tr>
                                        ))}
                                        <tr><td></td><td className="text-center">TOTAL</td><td className="text-center">{this.convertNumber(Math.round(this.state.total))}</td></tr>

                                        </tbody>

                                    </table>

                                </div>
                                <div className="col-xs-2">
                                    <button type="submit" className="btn btn-block btn-primary">{this.state.buttonText}</button>
                                </div>

                            </div>


                        </div>
                    </form>
                </div>


                <div className="col-md-6">


                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Últimas cajas</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Fecha</th>
                                            <th className="text-center">Vendedor</th>
                                            <th className="text-center">Tipo</th>
                                            <th className="text-center">Detalle</th>
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
                                                <td className="text-center">{this.convertNumber(Math.round(this.calculateTotal(cashboxes)))}</td>
                                            </tr>
                                        ))}


                                        </tbody>

                                    </table>

                                </div>

                            </div>


                        </div>

                </div>

                <CashboxModal show={this.state.show}  action={this.handleClose}
                              />

            </div>
        );
    }
}

if (document.getElementById('cashboxes')) {

    ReactDOM.render(<Cashboxes/>, document.getElementById('cashboxes'));
}

