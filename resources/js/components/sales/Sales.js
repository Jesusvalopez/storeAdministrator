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
            selected_price_type_id : null,
            products : [],

            products_on_sale :{
                products:[],
            },


            discounts:[],
            payment_methods : [],

        }



        toast.configure();
    }



    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

    componentDidMount() {
        axios.get('/price-types')
            .then(res => {
                this.setState({
                    pricetypes: res.data,
                    selected_price_type_id:res.data[0].id

                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
        axios.get('/products')
            .then(res => {
                this.setState({
                    products: res.data
                });

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
        axios.get('/discounts')
            .then(res => {
                this.setState({
                    discounts: res.data
                });

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    handleAddProduct = () =>{

        var product_selected = document.getElementById("products");
        var priceType = document.getElementById("priceType");
        var priceType_value = priceType.value;
        var add_quantity_value = parseInt(document.getElementById("productAddQuantity").value);

        if(isNaN(add_quantity_value) || add_quantity_value < 1){
            this.notifyError('Debe agregar cantidad');
            document.getElementById("productAddQuantity").focus();
            return false;
        }

        var product_selected_value = product_selected.options[product_selected.selectedIndex].value;
        var products = this.state.products;
        var product = products.find(product => (product.id === parseInt(product_selected_value)));


        var products_on_sale = this.state.products_on_sale.products;

        //validar primero si el producto ya se encuentra
        var result = products_on_sale.find(product => (product.product.id === parseInt(product_selected_value)));


        document.getElementById("productAddQuantity").value = '';

        //Si el producto ya se encuentra agregado, solo actualizamos el tipo de precio y las cantidades.
        if(result){


            this.setState(prevState => {


                const products_on_sale = [...prevState.products_on_sale.products];

                const new_products_on_sale = products_on_sale.map(product => {

                    if (product.product.id === parseInt(product_selected_value)) {

                        product.quantity += add_quantity_value;
                        product.price_type_id = parseInt(priceType_value);

                        return product;
                    }
                    return product;
                });
                return {products_on_sale:{
                    products:new_products_on_sale
                    } };

            });

            return false;
        }

        var product_on_sale_model = {
                product:product,
                quantity: add_quantity_value,
                price_type_id: parseInt(priceType_value),

                get_price_type:function () {
                    return this.find_price_type().name;
                },
                calculate_price:function () {
                return this.quantity * this.find_price_type().prices.price;
                },
                find_price_type:function () {
                    var price_type = this.product.prices_types.find(price => (price.id === this.price_type_id));
                    return price_type;
                }
        };

        this.setState({

            products_on_sale:{
                products: products_on_sale.concat(product_on_sale_model),
            }
        })





    }

    handleChangePriceType = (e) =>{
        this.setState({
            selected_price_type_id: parseInt(e.target.value)
        });
    }


    calculateTotal = () =>{

        const products = this.state.products_on_sale.products;
        var total = 0;

        products.map(product => {

            total+= parseFloat(product.calculate_price());

        });

        return total;

    }

    calculateSubTotal = () =>{

        const products = this.state.products_on_sale.products;
        var total = 0;

        products.map(product => {

            total+= parseFloat(product.calculate_price());

        });

        return total;

    }


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
                                    <select id="priceType" name="priceType"  className="form-control" value={this.selected_price_type_id} onChange={this.handleChangePriceType}>
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
                                        <select id="products" name="products"  className="form-control">
                                            {this.state.products.map((product) => (
                                                <option key={product.id} value={product.id} >{product.name + ' $ ' + product.prices_types.find(price => (price.id === parseInt(this.state.selected_price_type_id))).prices.price}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-xs-1">
                                        <label htmlFor="">Cantidad</label>
                                        <input id="productAddQuantity" type="number" name="quantity" className="form-control" placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <div className="col-xs-2">
                                        <button type="" className="btn btn-block btn-primary" onClick={this.handleAddProduct}>Agregar</button>
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
                                            <th className="text-center">Tipo Precio</th>
                                            <th className="text-center">Precio</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.products_on_sale.products.map((product_on_sale) => (
                                            <tr key={product_on_sale.product.id}>
                                                <td className="text-center">{product_on_sale.product.name}</td>
                                                <td className="text-center">{product_on_sale.quantity}</td>
                                                <td className="text-center">{product_on_sale.get_price_type()}</td>
                                                <td className="text-center">$ {product_on_sale.calculate_price()}</td>
                                                <td className="text-center"><a href="#" className="btn btn-danger"><i className="fa fa-times"></i></a></td>

                                            </tr>

                                        ))}

                                            <tr>
                                                <td></td>
                                                <td>SUBTOTAL</td>
                                                <td>$ {this.calculateSubTotal()}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                            <td></td>
                                            <td>TOTAL DESCUENTOS</td>
                                            <td>$ 0</td>
                                            <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>TOTAL</td>
                                                <td>${this.calculateTotal()}</td>
                                                <td></td>
                                            </tr>


                                        </tbody>

                                    </table>

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







                <div className="col-md-4">
                    <div className="box box-success">
                    <div className="box-header with-border">
                        <h3 className="box-title">Descuentos</h3>
                    </div>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <label htmlFor="products_on_sale">Producto</label>
                                <select name="products_on_sale"  className="form-control">
                                    {this.state.products_on_sale.products.map((product_on_sale) => (
                                        <option key={product_on_sale.product.id} value={product_on_sale.product.id} >{product_on_sale.product.name}</option>

                                    ))}
                                </select>
                            </div>
                            </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <label htmlFor="discounts">Descuento</label>
                                <select name="discounts"  className="form-control">
                                    {this.state.discounts.map((discount) => (
                                        <option key={discount.id} value={discount.id} >{discount.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-xs-5">
                                <label htmlFor="discounts"></label>
                                <button type="submit" className="btn btn-block btn-primary" >Agregar descuento</button>
                            </div>

                        </div>

                    </div>
                    <div className="box-header with-border">
                        <h3 className="box-title">Medios de pago</h3>
                    </div>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-xs-6">

                                <select name="payment_methods"  className="form-control">
                                    {this.state.payment_methods.map((payment_method) => (
                                        <option key={payment_method.id} value={payment_method.id} >{payment_method.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-xs-5">

                                <button type="submit" className="btn btn-block btn-primary" >Agregar medio de pago</button>
                            </div>

                        </div>
                        <div className="box-body">
                            <div className="row">
                                <div className="col-xs-12">
                        <table className="table">
                            <thead>

                            <tr>
                                <th className="text-center">Medio Pago</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>

                            <tr >
                                <td className="text-center">Debito</td>
                                <td className="text-center">$ 1.000</td>
                                <td className="text-center"><a href="#" className="btn btn-danger"><i className="fa fa-times"></i></a></td>

                            </tr>
                            <tr>
                                <td className="text-center">Efectivo</td>
                                <td className="text-center">$ 350</td>
                                <td className="text-center"><a href="#" className="btn btn-danger"><i className="fa fa-times"></i></a></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>TOTAL</td>
                                <td>$ 1.350</td>
                                <td></td>
                            </tr>


                            </tbody>

                        </table>

                    </div>
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

