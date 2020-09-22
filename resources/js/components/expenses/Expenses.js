import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import Select, { components } from 'react-select';
import {toast} from "react-toastify";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Moment from "moment";
const Placeholder = props => {
    return <components.Placeholder {...props} />;
};


export default class Expenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: '',
                description: '',
                price: '',
            },
            products: [],
            expenses: [],
            start_date: Date.now(),
            selected_value: null,
            product_selected_value: null,
            quantity: 0,

        }

        toast.configure();
    }

    async componentDidMount() {
        axios.get('/expense-products')
            .then(res => {
                this.setState({
                    products: res.data
                });
               // this.state.products(res.data);
            })
            .catch((error) => {
               console.log(error);
            })

        axios.get('/expenses')
            .then(res => {
                this.setState({
                    expenses: res.data
                });
                // this.state.products(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarning = (text) => toast.warn(text);

    validateinputs = () => {

        var price_value = parseInt(document.getElementById("productPrice").value);
        var name_value = document.getElementById("productName").value;
        var description_value = document.getElementById("productDescription").value;

        if(name_value.length < 1){
            this.notifyWarning('Debe agregar el nombre del producto o servicio');
            document.getElementById("productName").focus();
            return false;
        }

        if(isNaN(price_value) || price_value < 1){
            this.notifyWarning('Debe agregar el costo');
            document.getElementById("productPrice").focus();
            return false;
        }


        if(description_value.length < 1){
            this.notifyWarning('Debe agregar la descripción del producto o servicio');
            document.getElementById("productDescription").focus();
            return false;
        }


        return true;

    }

    validateExpenseInputs = () => {

        var price_value = parseInt(document.getElementById("quantity").value);

        if(!this.state.selected_value){
            this.notifyWarning('Debe seleccionar un producto o servicio');
            return false;
        }

        if(isNaN(price_value) || price_value < 1){
            this.notifyWarning('Debe agregar cantidad');
            document.getElementById("quantity").focus();
            return false;
        }

        return true;

    }

    resetForm = () => {
        document.getElementById("createProductForm").reset();
    }

    handleCreateExpenseSubmit = (e) =>{
        e.preventDefault();
        if(this.validateExpenseInputs()){
            try {

                var data = {quantity: this.state.quantity, selected_value: this.state.selected_value, start_date: Moment(this.state.start_date).format('YYYY/MM/DD')};

                axios.post('/expenses',   data)
                    .then(res => {
                        this.setState({expenses: [res.data].concat(this.state.expenses)});
                        //  this.props.onCreateListElement(res.data);
                       // this.resetForm();
                        this.notify('Gasto creado con éxito')

                    }).catch(err => {
                    // what now?

                })
            }catch (e) {
                this.notifyError('No se pudo crear el gasto')
            }
        }

    }

    handleCreateSubmit = (e) =>{
        e.preventDefault();



        if(this.validateinputs()){
            try {
                axios.post('/expense-products',  this.state.form )
                    .then(res => {
                        this.setState({products: [res.data].concat(this.state.products)});
                      //  this.props.onCreateListElement(res.data);
                        this.resetForm();
                        this.notify('Registro creado con éxito')

                    }).catch(err => {
                    // what now?
                    this.notifyWarning('El registro ya existe')
                })
            }catch (e) {
                this.notifyError('No se pudo crear el registro')
            }
        }
    }

    handleQuantityChange = (e) =>{
        this.setState({
            quantity: e.target.value
        });

    }
    handleInputsChange = (e) =>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    setStartDate = (date) =>{
        this.setState({
            start_date: date,
        })
    }


    convertNumber = (value) =>{

        var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };

    handleSelectChange = (e) => {

        this.setState({
            selected_value:e.value,
            product_selected_value: e,
        })
        document.getElementById("quantity").focus();
    }

    render(){

        return (
            <div>
                <div className="col-xs-6">





                    <div className="row">
                        <div className="col-md-12">
                            <form id="createExpenseForm" action="/" method="" onSubmit={this.handleCreateExpenseSubmit}>

                                <div className="box box-success">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Nuevo gasto</h3>
                                    </div>

                                    <div className="box-body">
                                        <div className="row">

                                            <div className="col-xs-8">

                                                <Select id="products" name="products" components={{ Placeholder }} value={this.state.product_selected_value}
                                                        placeholder={'Seleccione'} onChange={this.handleSelectChange} options={this.state.products.map((product)=>{

                                                            return {"value":product.id, "label":product.name + ' ' + this.convertNumber(Math.round(product.price)) };

                                                })} />
                                            </div>

                                            <div className="col-xs-3">
                                                <input id ="quantity" type="number" name="quantity" className="form-control" placeholder="Cantidad"
                                                       onChange={this.handleQuantityChange}/>
                                            </div>

                                            <br/>

                                            <div className="col-xs-10">
                                                <label style={{width: "100%"}} htmlFor="">Fecha Gasto</label>
                                                <DatePicker
                                                    style={{width: "100%"}}
                                                    className="form-control"
                                                    dateFormat="dd/MM/yyyy"
                                                    selected={this.state.start_date}
                                                    onChange={this.setStartDate}

                                                />
                                            </div>


                                        </div>
                                    </div>

                                    <div className="box-body">
                                        <div className="row">


                                            <div className="col-xs-2">
                                                <button type="submit" className="btn btn-block btn-primary" >Crear</button>
                                            </div>


                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                            <form id="" action="/" method="" >

                                <div className="box box-success">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Últimos gastos</h3>
                                    </div>


                                    <div className="box-body">


                                        <table className="table table-bordered">
                                            <thead>

                                            <tr>
                                                <th className="text-center">Número gasto</th>
                                                <th className="text-center">Producto</th>
                                                <th className="text-center">Fecha gasto</th>
                                                <th className="text-center">Cantidad</th>
                                                <th className="text-center">Total</th>
                                                <th className="text-center">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {this.state.expenses ? this.state.expenses.map((expense) => (
                                                <tr key={expense.id}>
                                                    <td className="text-center">{expense.id}</td>
                                                    <td className="text-center">{expense.expense_details[0].product.name}</td>
                                                    <td className="text-center">{expense.expense_date}</td>
                                                    <td className="text-center">{expense.expense_details[0].quantity}</td>
                                                    <td className="text-center">{this.convertNumber(Math.round(expense.expense_details[0].quantity * expense.expense_details[0].product.price))}</td>

                                                </tr>
                                            )) : null}

                                            </tbody>

                                        </table>



                                    </div>




                                </div>
                            </form>
                        </div>
                    </div>


                </div>







                <div className="col-xs-6">

                    <div className="row">
                        <div className="col-md-12">
                            <form id="createProductForm" action="/" method="" onSubmit={this.handleCreateSubmit}>

                                <div className="box box-success">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Nuevo Producto o Servicio</h3>
                                    </div>
                                    <div className="box-body">
                                        <div className="row">
                                            <div className="col-xs-8">
                                                <input id ="productName" type="text" name="name" className="form-control" placeholder="Nombre del producto o servicio"
                                                       onChange={this.handleInputsChange} value={this.state.form.name}/>
                                            </div>
                                            <div className="col-xs-3">
                                                <input id ="productPrice" type="number" name="price" className="form-control" placeholder="Costo"
                                                       onChange={this.handleInputsChange} value={this.state.form.price}/>
                                            </div>

                                        </div>
                                        <br/>
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <input id ="productDescription" type="text" name="description" className="form-control" placeholder="Descripción"
                                                       onChange={this.handleInputsChange} value={this.state.form.description}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="box-body">
                                        <div className="row">


                                            <div className="col-xs-2">
                                                <button type="submit" className="btn btn-block btn-primary" >Crear</button>
                                            </div>


                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <form id="" action="/" method="" >

                                <div className="box box-success">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Últimos productos o servicios</h3>
                                    </div>


                                    <div className="box-body">


                                            <table className="table table-bordered">
                                                <thead>

                                                <tr>
                                                    <th className="text-center">Nombre</th>
                                                    <th className="text-center">Descripción</th>
                                                    <th className="text-center">Precio</th>
                                                    <th className="text-center">Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {this.state.products ? this.state.products.map((product) => (
                                                    <tr key={product.id}>
                                                        <td className="text-center">{product.name}</td>
                                                        <td className="text-center">{product.description}</td>
                                                        <td className="text-center">{product.price}</td>
                                                        <td className="text-center"></td>

                                                    </tr>
                                                )) : null}

                                                </tbody>

                                            </table>



                                    </div>




                                </div>
                            </form>
                        </div>
                    </div>
                </div>







            </div>
        );
    }
}

if (document.getElementById('expenses')) {

    ReactDOM.render(<Expenses/>, document.getElementById('expenses'));
}

