import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class SalesList extends Component {

    constructor(props){
        super(props);

        this.state = {
            sales : [],
            error : null,
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,
            numero_ventas: 0,
            ventas_brutas_totales: 0,
            comisiones_totales: 0,
            descuentos_totales: 0,
            ventas_netas_totales: 0,

        }

        toast.configure();
    }


    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);


    handleClose = (e) =>{
        this.setState({
            show:false
        });
    }

    deleteAction = (e) =>{
        e.preventDefault();
        try {

            // <input type="hidden" name="_method" value="delete">//{params: {id: id}})
            axios.delete('/products/'+this.state.deleteId,  )
                .then(res => {

                    this.props.onUpdateList(res.data);
                    this.setState({
                        show: false,
                    });
                    this.notify('Registro eliminado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo eliminar el registro')
        }
    }

    handleShow = (id) => {
        this.setState({
            show:true,
            deleteId: id,
        });
    }


    componentDidMount() {
        axios.get('/sales/listing')
            .then(res => {
                console.log(res.data);
                this.setState(prevState => {

                    var numero_ventas = this.state.numero_ventas;
                    var ventas_brutas_totales = this.state.ventas_brutas_totales;
                    var comisiones_totales = this.state.comisiones_totales;
                    var descuentos_totales = this.state.descuentos_totales;


                    const new_sales = res.data.map(sale => {

                        numero_ventas++;

                        const  totals= this.calculateTotals(sale)

                        sale.sub_total = this.convertNumber(Math.round(totals.sub_total));
                        sale.discounts = this.convertNumber(Math.round(totals.discount));
                        sale.comissions = this.convertNumber(Math.round(totals.comission));
                        sale.total = this.convertNumber(Math.round(totals.total));

                        ventas_brutas_totales+= totals.sub_total;
                        comisiones_totales+= totals.comission;
                        descuentos_totales+= totals.discount;


                        const new_sale_details = sale.sale_details.map(sale_detail =>{

                            const  totals= this.calculateDetailTotals(sale_detail);

                            sale_detail.sub_total =  this.convertNumber(Math.round(totals.sub_total));
                            sale_detail.discounts = this.convertNumber(Math.round(totals.discount));
                            sale_detail.total =this.convertNumber(Math.round(totals.total));

                            return sale_detail;
                        })

                        sale.sale_details = new_sale_details;

                        return sale;
                    });

                    return {sales:new_sales,
                        numero_ventas: numero_ventas,
                        ventas_brutas_totales:this.convertNumber(Math.round(ventas_brutas_totales)),
                        comisiones_totales:this.convertNumber(Math.round(comisiones_totales)),
                        descuentos_totales:this.convertNumber(Math.round(descuentos_totales)),
                        ventas_netas_totales:this.convertNumber(Math.round(ventas_brutas_totales-descuentos_totales-comisiones_totales)),
                    };

                })

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }


    calculateDetailTotals = (sale_detail) =>{

        var subTotal = sale_detail.quantity * sale_detail.price.price;
        var discount = 0;
        var total = 0;
        var discount_quantity = 0;

        sale_detail.discount_sale_details.map((discount_sale_detail)=>{

            discount_quantity=parseInt(discount_sale_detail.discount.quantity);

        });


            discount += subTotal * ((discount_quantity) / 100);

            total = subTotal - discount;

        return {sub_total :subTotal, discount: discount, total: total};

    }
    calculateTotals = (sale) =>{

        var subTotal = 0.0;
        var discount = 0;
        var discount_quantity = 0;


        sale.sale_details.map((sale_detail)=>{

            var sub = parseFloat(sale_detail.price.price) * sale_detail.quantity;

            subTotal+=sub;

            sale_detail.discount_sale_details.map((discount_sale_detail)=>{
                discount_quantity=parseInt(discount_sale_detail.discount.quantity);

            });


                discount += sub * ((discount_quantity) / 100);

        })

        var subTotalComission = 0.0;
        var comission_quantity = 0;
        var comission = 0;

        sale.payment_method_sale.map((payment_method_sales)=>{
            subTotalComission+=parseFloat(payment_method_sales.amount);
            comission_quantity = parseFloat(payment_method_sales.payment_method.comission);

        })

        comission = subTotalComission * ((comission_quantity) / 100);

        var total = subTotal - discount - comission;
        // console.log(sale);

        return {sub_total :subTotal, discount: discount, comission: comission , total: total};
    }


    convertNumber = (value) =>{

      var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };

    render(){

        return (
            <div>

                <div className="col-xs-2">
                    <div className="small-box bg-green">
                        <div className="inner">
                            <h3>{this.state.numero_ventas}</h3>

                            <p>Número de ventas</p>
                        </div>
                        <div className="icon">
                            <i className="fa fa-shopping-cart"></i>
                        </div>

                    </div>
                </div>

                <div className="col-xs-2">
                    <div className="small-box bg-green">
                        <div className="inner">
                            <h3>{this.state.ventas_brutas_totales}</h3>

                            <p>Ventas Brutas Totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-stats-bars"></i>
                        </div>

                    </div>
                </div>

                <div className="col-xs-2">
                    <div className="small-box bg-yellow">
                        <div className="inner">
                            <h3>{this.state.comisiones_totales}</h3>

                            <p>Comisiones totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph"></i>
                        </div>

                    </div>
                </div>
                <div className="col-xs-2">
                    <div className="small-box bg-yellow">
                        <div className="inner">
                            <h3>{this.state.descuentos_totales}</h3>

                            <p>Descuentos totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph"></i>
                        </div>

                    </div>
                </div>

                <div className="col-xs-2">
                    <div className="small-box bg-green">
                        <div className="inner">
                            <h3>{this.state.ventas_netas_totales}</h3>

                            <p>Ventas Netas Totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-stats-bars"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-12">





                                {this.state.sales ? this.state.sales.map((sale) => (
                                    <div className="box box-success" key={sale.id}>
                                        <div className="box-header with-border">
                                            <h3 className="box-title">Venta # {sale.id} | Vendedor: {sale.seller.name}</h3>
                                            {false ? <a href="#" className="btn btn-danger pull-right"><i className="fa fa-times"></i>Eliminar venta</a> : null}
                                        </div>
                                    <div className="box-body" >

                                        <div className="row">
                                            <div className="col-xs-offset-1 col-xs-10">
                                            <table className="table table-bordered">
                                                <thead>

                                                <tr>
                                                    <th className="text-center">Producto</th>
                                                    <th className="text-center">Cantidad</th>
                                                    <th className="text-center">Subtotal</th>
                                                    <th className="text-center">Descuentos</th>
                                                    <th className="text-center">Descuentos Aplicados</th>
                                                    <th className="text-center">Total</th>
                                                    <th className="text-center">Tipo de precio</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                            {sale.sale_details.map((sale_detail)=>(
                                                <tr key={sale_detail.id}>
                                                    <td className="text-center">{sale_detail.price.priceable.name}</td>
                                                    <td className="text-center">{sale_detail.quantity}</td>
                                                    <td className="text-center">{(sale_detail.sub_total)}</td>
                                                    <td className="text-center">{(sale_detail.discounts)}</td>
                                                    <td className="text-center">
                                                        {sale_detail.discount_sale_details.map((discount)=>(
                                                            <label className={"label label-success"} key={discount.id}>{discount.discount.name}</label>
                                                        ))}
                                                    </td>
                                                    <td className="text-center">{(sale_detail.total)}</td>
                                                    <td className="text-center">{sale_detail.price.price_type.name}</td>


                                                </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-offset-1 col-md-5">
                                            <table className="table">
                                                <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td><b>SUBTOTAL</b></td>
                                                    <td><b>{(sale.sub_total)}</b></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td ><b>DESCUENTOS</b></td>
                                                    <td ><b>{(sale.discounts)}</b></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td ><b>COMISIONES</b></td>
                                                    <td ><b>{(sale.comissions)}</b></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td ><b>TOTAL</b></td>
                                                    <td><b>{(sale.total)}</b></td>
                                                    <td></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                            <div className="col-md-5">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                    <th>Medio de pago</th>
                                                    <th>Monto</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sale.payment_method_sale.map((payment_method_sale)=>(
                                                            <tr key={payment_method_sale.id}>
                                                                <td><b>{payment_method_sale.payment_method.name}</b></td>
                                                                <td><b>{this.convertNumber(Math.round(payment_method_sale.amount))}</b></td>

                                                            </tr>
                                                        ))}


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                )) : null}







                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Ventas</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Venta</th>
                                            <th className="text-center">Vendedor</th>
                                            <th className="text-center">SubTotal</th>
                                            <th className="text-center">Descuentos</th>
                                            <th className="text-center">Comision</th>
                                            <th className="text-center">Total</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.sales ? this.state.sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="text-center">{sale.id}</td>
                                                <td className="text-center">{sale.seller.name}</td>
                                                <td className="text-center">{sale.sub_total}</td>
                                                <td className="text-center">{sale.discounts}</td>
                                                <td className="text-center">{sale.comissions}</td>
                                                <td className="text-center">{sale.total}</td>
                                                <td className="text-center">{false ? <a
                                                    href="#" className="btn btn-danger"><i
                                                    className="fa fa-times"></i></a>:null}</td>

                                            </tr>
                                        )) : null}

                                        </tbody>

                                    </table>

                                </div>

                            </div>


                        </div>

                </div>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>
            </div>
        );
    }
}

if (document.getElementById('salesList')) {

    ReactDOM.render(<SalesList />, document.getElementById('salesList'));
}

