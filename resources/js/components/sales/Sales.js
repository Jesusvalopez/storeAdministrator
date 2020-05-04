import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";


export default class Sales extends Component {

    constructor(props){
        super(props);
        this.state = {
            pricetypes : [],
            products : [],
            payment_methods : [],

        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

    render(){

        return (
            <div>
                <div className="col-md-8">


                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Venta</h3>
                            </div>
                            <div className="box-body">

                                <div className="row">
                                <div className="col-xs-3">
                                <label htmlFor="">Tipo de precio</label>
                                    <select name="priceType"  className="form-control">
                                        {this.state.pricetypes.map((pricetype) => (
                                            <option key={pricetype.id} value={pricetype.id} >{pricetype.name}</option>
                                        ))}
                                    </select>
                                </div>
                                    <br/>
                                </div>
                                <div className="row">
                                    <div className="col-xs-5">
                                        <label htmlFor="">Producto</label>
                                        <select name="products"  className="form-control">
                                            {this.state.products.map((product) => (
                                                <option key={product.id} value={product.id} >{product.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-xs-1">
                                        <label htmlFor="">Cantidad</label>
                                        <input type="text" name="quantity" className="form-control" placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <div className="col-xs-2">
                                        <button type="submit" className="btn btn-block btn-primary" >Agregar</button>
                                    </div>

                                </div>
                            </div>
                            <div className="box-header with-border">
                                <h3 className="box-title">Detalle de Venta</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Producto</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-center">Precio</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                            <tr >
                                                <td className="text-center">Malta</td>
                                                <td className="text-center">1</td>
                                                <td className="text-center">$ 1.500</td>
                                                <td className="text-center"><a href="#" className="btn btn-danger"><i className="fa fa-times"></i></a></td>

                                            </tr>
                                        <tr>
                                            <td></td>
                                            <td>TOTAL</td>
                                            <td>$ 1.500</td>
                                            <td></td>
                                        </tr>


                                        </tbody>

                                    </table>

                                </div>

                            </div>


                            <div className="box-header with-border">
                                <h3 className="box-title">Medios de pago</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-xs-4">
                                    <label htmlFor="">Medio de pago</label>
                                    <select name="payment_methods"  className="form-control">
                                        {this.state.payment_methods.map((payment_method) => (
                                            <option key={payment_method.id} value={payment_method.id} >{payment_method.name}</option>
                                        ))}
                                    </select>
                                    </div>
                                    <div className="col-xs-3">
                                        <label htmlFor=""></label>
                                        <button type="submit" className="btn btn-block btn-primary" >Agregar medio de pago</button>
                                    </div>

                                </div>

                            </div>


                            <div className="box-body">
                                <div className="row">

                                    <div className="col-xs-2">
                                        <button type="submit" className="btn btn-block btn-primary btn-lg" >Generar Venta</button>
                                    </div>

                                </div>
                            </div>

                        </div>

                </div>
            </div>
        );
    }
}

if (document.getElementById('sale')) {

    ReactDOM.render(<Sales />, document.getElementById('sale'));
}

