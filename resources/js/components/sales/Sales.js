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
            payment_methods_sales : [],

            total : 0,
            sub_total : 0,
            discounts_total : 0,
            totalMethodsSale:0.0,

        }



        toast.configure();
    }



    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarning = (text) => toast.warn(text);

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
        axios.get('/payment-methods')
            .then(res => {
                this.setState({
                    payment_methods: res.data
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
            this.notifyWarning('Debe agregar cantidad');
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
                        product.product_price_type_id = product.find_price_type().prices.id;

                        return product;
                    }
                    return product;
                });
                return {products_on_sale:{
                    products:new_products_on_sale
                    } };

            },() => { this.calculateTotals() });

            return false;
        }



        var product_price = product.prices_types.find(price => (price.id === parseInt(priceType_value)));

        var product_on_sale_model = {
                product:product,
                quantity: add_quantity_value,
                price_type_id: parseInt(priceType_value),
                discounts:[],
                product_price_type_id: product_price.prices.id,
                get_price_type:function () {
                    return this.find_price_type().name;
                },
                calculate_price:function () {
                return this.quantity * this.find_price_type().prices.price;
                },
                calculate_final_price:function () {

                    var discount_amount = 0;

                    if(this.discounts.length > 0){
                        this.discounts.map((discount)=>{
                            discount_amount+= parseInt(discount.quantity);
                        });

                    }

                    var discount_percent = (100 - discount_amount) / 100;

                return this.quantity * this.find_price_type().prices.price * discount_percent;
                },
                find_price_type:function () {
                    var price_type = this.product.prices_types.find(price => (price.id === this.price_type_id));
                    return price_type;
                },

        };

        this.setState(prevState => {


            const products_on_sale_2 = [...prevState.products_on_sale.products];
            return {products_on_sale:{
                    products:products_on_sale_2.concat(product_on_sale_model),
                } };
            /*
            products_on_sale:{
                products: products_on_sale.concat(product_on_sale_model),
                 }
             */

        },() => { this.calculateTotals() })





    }

    handleChangePriceType = (e) =>{
        this.setState({
            selected_price_type_id: parseInt(e.target.value)
        });
    }


    calculateTotals= () =>{

        const products = this.state.products_on_sale.products;
        var total = 0;
        var sub_total = 0;

        products.map(product => {

            total+= parseFloat(product.calculate_final_price());
            sub_total +=parseFloat(product.calculate_price());


        });


        this.setState({
            total: total,
            sub_total: sub_total,
            discounts_total: sub_total-total,
        });


    }

    calculateTotalPaymentMethodsSale= () =>{

        const payment_methods_sales = this.state.payment_methods_sales;
        var total = 0.0;

        payment_methods_sales.map(payment_methods_sale => {

            total+= parseFloat(payment_methods_sale.quantity);

        });


        this.setState({
            totalMethodsSale: total,

        });


    }


    showProductsOnSale = () =>{

        return this.state.products_on_sale.products.map((product_on_sale) => (  function () {

            <tr key={product_on_sale.product.id}>
                <td className="text-center">{product_on_sale.product.name}</td>
                <td className="text-center">{product_on_sale.quantity}</td>
                <td className="text-center">{product_on_sale.get_price_type()}</td>
                <td className="text-center">$ {product_on_sale.calculate_price()}</td>
                <td className="text-center"><a href="#" className="btn btn-danger"><i className="fa fa-times"></i></a></td>

            </tr>;


        }      ));
        /*


        ))*/
    }
    handleDeleteProduct = (id) =>{

        this.setState(prevState => {

            const products_on_sale = [...prevState.products_on_sale.products];

            const new_products_on_sale = products_on_sale.filter(product => {
                return product.product.id !== id;
            });

            return {products_on_sale:{
                    products:new_products_on_sale
                } };

        },() => { this.calculateTotals() })

    }

    handleDeletePaymentMethod = (id) =>{

        this.setState(prevState => {

            const payment_methods_sales = [...prevState.payment_methods_sales];

            const new_payment_methods_sales = payment_methods_sales.filter(payment_method => {
                return payment_method.payment_method.id !== id;
            });

            return {payment_methods_sales:new_payment_methods_sales
                 };

        }, ()=>{
            this.calculateTotalPaymentMethodsSale();
        })

    }


    handleAddPaymentMethod = (e) =>{

        var payment_method_select = document.getElementById("PaymentMethodsElements");
        var payment_method_amount_element = document.getElementById("paymentMethodAmount");

        var payment_method_value = payment_method_select.options[payment_method_select.selectedIndex].value;

        const payment_method = this.state.payment_methods.find(payment_method => (payment_method.id === parseInt(payment_method_value)));


        var payment_method_model = {
            payment_method:payment_method,
            quantity: parseInt(payment_method_amount_element.value),

        };


        this.setState(prevState => {
                const new_payment_methods_sale = [...prevState.payment_methods_sales];
                return {
                    payment_methods_sales:new_payment_methods_sale.concat(payment_method_model)
                }
            }, ()=>{
            this.calculateTotalPaymentMethodsSale();
            }

        );

        payment_method_amount_element.value = '';


    }

    handleAddDiscount = (e) =>{
        var discount_selected = document.getElementById("discounts");
        var products_on_sale_discount = document.getElementById("products_on_sale_discount");

        var discount_selected_value = discount_selected.options[discount_selected.selectedIndex].value;
        var products_on_sale_discount_value = products_on_sale_discount.options[products_on_sale_discount.selectedIndex].value;

        if(products_on_sale_discount_value === ''){
            return false;
        }

        const discount = this.state.discounts.find(discount => (discount.id === parseInt(discount_selected_value)));

        this.setState(prevState => {

            const products_on_sale = [...prevState.products_on_sale.products];

            const new_products_on_sale = products_on_sale.map(product => {

                if (products_on_sale_discount_value === 'all' || product.product.id === parseInt(products_on_sale_discount_value)) {

                    //validar que el descuento no esté aplicado ya.
                    if(!product.discounts.find(discountToFind => (discountToFind.id === discount.id))) {
                        product.discounts = product.discounts.concat(discount);
                    }

                    return product;
                }
                return product;
            });
            return {products_on_sale:{
                    products:new_products_on_sale
                } };

        },() => { this.calculateTotals() })
        this.notify('Descuento agregado');


    }

    handleSubmitSale = () =>{


        const products = this.state.products_on_sale.products;
        //validar que haya productos
        if(products.length === 0){
            this.notifyWarning('No hay productos para registrar');
            return false;
        }
        if(this.state.total !== this.state.totalMethodsSale){
            this.notifyWarning('Debe agregar los medios de pago');
            return false;
        }


        var saleForm = {
                products: products,
                payment_methods_sale: this.state.payment_methods_sales,
        }

        try {
            axios.post('/sales',  saleForm )
                .then(res => {

                    this.setState({
                        products_on_sale:{
                            products: [],
                        },
                        payment_methods_sales:[],
                    },() => { this.calculateTotals(); this.calculateTotalPaymentMethodsSale() })

                    console.log(res);
                    this.notify('Venta registrada')

                })
        }catch (e) {
            this.notifyError('No se pudo crear el registro')
        }

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
                                            <th className="text-center">Descuentos</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        {this.state.products_on_sale.products.map((product_on_sale) => (

                                            <tr key={product_on_sale.product.id} >

                                            <td className="text-center">{product_on_sale.product.name}</td>
                                            <td className="text-center">{product_on_sale.quantity}</td>
                                            <td className="text-center">{product_on_sale.get_price_type()}</td>
                                            <td className="text-center">$ {product_on_sale.calculate_price()}</td>
                                            <td className="text-center">
                                                {product_on_sale.discounts.map((discount)=>(
                                                    <label className={"label label-success"} key={discount.id}>{discount.name}</label>
                                                ))}
                                            </td>
                                            <td className="text-center"><a href="#" className="btn btn-danger" onClick={()=>this.handleDeleteProduct(product_on_sale.product.id)}><i className="fa fa-times"></i></a></td>

                                        </tr>


                                            ))}




                                        </tbody>

                                    </table>

                                </div>

                            </div>



                            <div className="box-header with-border">
                                <h3 className="box-title">Medios de pago</h3>
                            </div>
                            <div className="box-body">
                                <div className="col-md-8">
                                <div className="row">
                                    <div className="col-xs-4">

                                        <select id="PaymentMethodsElements" name="payment_method"  className="form-control">
                                            {this.state.payment_methods.map((payment_method) => (
                                                <option key={payment_method.id} value={payment_method.id} >{payment_method.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-xs-4">

                                        <input id="paymentMethodAmount" type="number" name="amount" className="form-control" placeholder="$ 1000"
                                        />
                                    </div>
                                    {this.state.products_on_sale.products.length > 0 ?
                                        <div className="col-xs-4">

                                            <button type="" className="btn btn-block btn-primary" onClick={this.handleAddPaymentMethod}>Agregar medio de pago</button>
                                        </div>
                                        :null}

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

                                                {this.state.payment_methods_sales.map((payment_methods_sale) => (
                                                    <tr key={payment_methods_sale.payment_method.id}>
                                                        <td className="text-center">{payment_methods_sale.payment_method.name}</td>
                                                        <td className="text-center">{payment_methods_sale.quantity}</td>
                                                        <td className="text-center"><a href="#" className="btn btn-danger"onClick={()=>this.handleDeletePaymentMethod(payment_methods_sale.payment_method.id)}><i className="fa fa-times"></i></a></td>

                                                    </tr>

                                                ))}

                                                <tr>

                                                    <th className="text-center">TOTAL</th>
                                                    <th className="text-center">$ {this.state.totalMethodsSale}</th>
                                                    <th></th>
                                                </tr>


                                                </tbody>

                                            </table>

                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-4">
                                    <table className="table">
                                        <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><b>SUBTOTAL</b></td>
                                        <td><b>${this.state.sub_total}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><b>TOTAL DESCUENTOS</b></td>
                                        <td><b>$ -{this.state.discounts_total}</b></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><b>TOTAL</b></td>
                                        <td><b>${this.state.total}</b></td>
                                        <td></td>
                                    </tr>
                                        </tbody>
                                        </table>
                                </div>
                            </div>


                            <div className="box-body">
                                <div className="row">

                                    <div className="col-xs-2">
                                        <button type="submit" className="btn btn-block btn-primary btn-lg" onClick={this.handleSubmitSale}>Generar Venta</button>
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
                                <select id="products_on_sale_discount" name="products_on_sale"  className="form-control">
                                    {this.state.products_on_sale.products.length > 0 ? <option value="all">Todos</option> : <option value="">No hay productos en la venta</option>}
                                    {this.state.products_on_sale.products.map((product_on_sale) => (
                                        <option key={product_on_sale.product.id} value={product_on_sale.product.id} >{product_on_sale.product.name}</option>

                                    ))}
                                </select>
                            </div>
                            </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <label htmlFor="discounts">Descuento</label>
                                <select id="discounts" name="discounts"  className="form-control">
                                    {this.state.discounts.map((discount) => (
                                        <option key={discount.id} value={discount.id} >{discount.name}</option>
                                    ))}
                                </select>
                            </div>
                            {this.state.products_on_sale.products.length > 0 ?

                                <div className="col-xs-5">
                                <label htmlFor=""></label>
                                <button type="submit" className="btn btn-block btn-primary" onClick={this.handleAddDiscount}>Agregar descuento</button>
                                </div>

                                : null}


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

