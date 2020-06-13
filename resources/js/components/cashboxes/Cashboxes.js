import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';


export default class Cashboxes extends Component {

    constructor(props){
        super(props);
        const currency = [{id:1, value:10, total:0, quantity:0}, {id:2, value:50, total:0, quantity:0}, {id:3, value:100, total:0, quantity:0},
            {id:4, value:500, total:0, quantity:0},{id:5, value:1000, total:0, quantity:0}, {id:6, value:2000, total:0, quantity:0},
            {id:7, value:5000, total:0, quantity:0}, {id:8, value:10000, total:0, quantity:0}, {id:9, value:20000, total:0, quantity:0}];
        this.state = {

            cashbox_form:currency,
            total:0

        }


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

        } );
    }


    render(){

        return (
            <div className="row">
                <div className="col-md-12">
                    <form id="" action="/" method="" >

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
                                                <td className="text-center">{currency.value}</td>
                                                <td className="text-center"> <input type="number" name={currency.id} className="form-control" placeholder="Cantidad"
                                                                                  onChange={this.handleUpdateForm} value={currency.quantity}/></td>
                                                <td className="text-center">{currency.total}</td>
                                            </tr>
                                        ))}
                                        <tr><td></td><td className="text-center">TOTAL</td><td className="text-center">{this.state.total}</td></tr>

                                        </tbody>

                                    </table>

                                </div>
                                <div className="col-xs-2">
                                    <button type="submit" className="btn btn-block btn-primary" >Abrir caja</button>
                                </div>

                            </div>


                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

if (document.getElementById('cashboxes')) {

    ReactDOM.render(<Cashboxes/>, document.getElementById('cashboxes'));
}

