import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import ContentLoader from "react-content-loader";
import printJS from "print-js";

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

const SalesLoader = () => (
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

export default class SalesList extends Component {

    constructor(props){
        super(props);



        this.state = {
            sales : null,
            error : null,
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,
            numero_ventas: null,
            ventas_brutas_totales: null,
            comisiones_totales: null,
            descuentos_totales: null,
            ventas_netas_totales: null,
            gastos: null,
            range_start_date: Date.now(),
            range_end_date: Date.now(),
            sales_payments_details: null,

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
            axios.delete('/sales/'+this.state.deleteId,  )
                .then(res => {


                    this.setState(prevState => {
                        return this.reCalculateAllTotals(res)
                    });
                    this.notify('Registro eliminado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo eliminar el registro')
        }
    }

    handlePrintDteByToken = (token) => {
        axios.get('/sales/dte/'+token)
            .then(res => {

                printJS({
                    printable: res.data.pdf,
                    type: 'pdf',
                    base64: true,
                    header: null,
                    gridHeaderStyle: 'font-weight: bold; padding: 105px; border: 1px solid #dddddd;',
                })


            });
    }
    handleShow = (id) => {
        this.setState({
            show:true,
            deleteId: id,
        });
    }


    componentDidMount() {
        trackPromise(
        axios.get('/sales/listing')
            .then(res => {

                this.setState(prevState => {

                    return this.reCalculateAllTotals(res);

                })


            }));
    }


    reCalculateAllTotals (res){
        var numero_ventas = 0;
        var ventas_brutas_totales = 0;
        var comisiones_totales = 0;
        var descuentos_totales = 0;
        var gastos = this.convertNumber(Math.round(res.data.expenses))

        var paymentsModelsTotals = [];



        const new_sales = res.data.sales.map(sale => {

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



            //Calcular por metodo de pago
            sale.payment_method_sale.map((payment_methods_sale) => {
                const amount = payment_methods_sale.amount;
                const payment_method_name = payment_methods_sale.payment_method.name;
                const payment_method_comission = payment_methods_sale.payment_method.comission;

                const paymentsModel = {
                    id: payment_methods_sale.id,
                    payment_method_name: payment_method_name,
                    amount: parseInt(amount),
                    payment_method_comission: payment_method_comission,
                    calculated_comission:function () {
                        const comission_in_percent = this.payment_method_comission / 100;
                        return this.amount * comission_in_percent;
                    },
                    total:function () {
                        return this.amount - this.calculated_comission();
                    }
                }



                if(paymentsModelsTotals.length > 0){

                    var found_one = false;

                        paymentsModelsTotals.map(p => {
                        if (p.payment_method_name === payment_method_name) {
                            p.amount += parseInt(amount);
                            found_one = true;
                        return p;
                        }
                        return p;

                        });

                        if(!found_one){
                        paymentsModelsTotals = paymentsModelsTotals.concat(paymentsModel)
                        }



                }else{
                    paymentsModelsTotals = paymentsModelsTotals.concat(paymentsModel);
                }


            });



            return sale;
        }) ;


        return {
            sales:new_sales,
            numero_ventas: numero_ventas,
            ventas_brutas_totales:this.convertNumber(Math.round(ventas_brutas_totales)),
            comisiones_totales:this.convertNumber(Math.round(comisiones_totales)),
            descuentos_totales:this.convertNumber(Math.round(descuentos_totales)),
            ventas_netas_totales:this.convertNumber(Math.round(ventas_brutas_totales-descuentos_totales-comisiones_totales)),
            sales_payments_details:paymentsModelsTotals,
            gastos: gastos,
            show:false,
        };
    }

    //TODO corregir este calculo esta tomando como descuento todos los productos.
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

    handleFilterDateClick = () =>{

        const start_date = Moment(this.state.range_start_date).format('YYYY/MM/DD');
        const end_date = Moment(this.state.range_end_date).format('YYYY/MM/DD');

        this.setState({
            numero_ventas: null,
            ventas_brutas_totales: null,
            comisiones_totales: null,
            descuentos_totales: null,
            ventas_netas_totales: null,
            sales: null,
            sales_payments_details: null,
            gastos: null,
        });

        trackPromise(
        axios.post('/sales/listing-date', {start_date: start_date, end_date:end_date})
            .then(res => {

                this.setState(() =>{

                   return this.reCalculateAllTotals(res)

                });

            }))
    }

    setRangeEndDate = (date) =>{
        this.setState({
            range_end_date: date,
        })
    }
    setRangeStartDate = (date) =>{
        this.setState({
            range_start_date: date,
        })
    }



    render() {

        const LoadingIndicator = props => {
            const {promiseInProgress} = usePromiseTracker();
            return (
                promiseInProgress &&
                <div
                    style={{
                        width: "100%",
                        height: "100",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Loader type="ThreeDots" color="#fff" height={45} width={45} />

                </div>
            );
        }

        const LoadingIndicator2 = props => {
            const {promiseInProgress} = usePromiseTracker();
            return (
                promiseInProgress &&
                <div
                    style={{
                        width: "100%",
                        height: "100",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Loader type="ThreeDots" color="#00a65a" height={45} width={45} />

                </div>
            );
        }
        return (
            <div>


                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-green">

                        <div className="inner">
                            {this.state.numero_ventas != null ?
                            <h3>{this.state.numero_ventas}</h3>
                                :  <LoadingIndicator/> }
                            <p>Número de ventas</p>
                        </div>

                        <div className="icon">
                            <i className="fa fa-shopping-cart"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-green">
                        <div className="inner">
                            {this.state.ventas_brutas_totales != null ?
                                <h3>{this.state.ventas_brutas_totales}</h3>
                                :  <LoadingIndicator/> }
                            <p>Ventas Brutas Totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-stats-bars"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-yellow">
                        <div className="inner">
                            {this.state.comisiones_totales != null ?
                                <h3>{this.state.comisiones_totales}</h3>
                                :  <LoadingIndicator/> }

                            <p>Comisiones totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph"></i>
                        </div>

                    </div>
                </div>
                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-yellow">
                        <div className="inner">
                            {this.state.descuentos_totales != null ?
                                <h3>{this.state.descuentos_totales}</h3>
                                :  <LoadingIndicator/> }

                            <p>Descuentos totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-green">
                        <div className="inner">
                            {this.state.ventas_netas_totales != null ?
                                <h3>{this.state.ventas_netas_totales}</h3>
                                :  <LoadingIndicator/> }


                            <p>Ventas Netas Totales</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion ion-arrow-graph-up-right"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-4 col-lg-2">
                    <div className="small-box bg-red">
                        <div className="inner">
                            {this.state.gastos != null ?
                                <h3>{this.state.gastos}</h3>
                                :  <LoadingIndicator/> }


                            <p>Gastos</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-arrow-graph-down-right"></i>
                        </div>

                    </div>
                </div>

                <div className="col-md-12">
                    {this.props.showFilters ?
                    <div className="box box-success">
                        <div className="box-header with-border">
                            <div className="col-md-6"><h3 className="box-title">Detalle ingresos</h3></div>
                        </div>

                        <div className="box-body" >

                            <div className="row">


                                <div className="col-md-2">
                                    <label style={{width: "100%"}} htmlFor="">Fecha Inicio</label>
                                    <DatePicker
                                        style={{width: "100%"}}
                                        className="form-control"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.range_start_date}
                                        onChange={this.setRangeStartDate}
                                        selectsStart
                                        startDate={this.state.range_start_date}
                                        endDate={this.state.range_end_date}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label style={{width: "100%"}} htmlFor="">Fecha Término</label>
                                    <DatePicker
                                        style={{width: "100%"}}
                                        className="form-control"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.range_end_date}
                                        onChange={this.setRangeEndDate}
                                        selectsEnd
                                        startDate={this.state.range_start_date}
                                        endDate={this.state.range_end_date}
                                        minDate={this.state.range_start_date}
                                    />
                                </div>





                                <div className="col-md-2">
                                    <label htmlFor=""></label>
                                    <button className="btn btn-primary btn-block" onClick={this.handleFilterDateClick}>Filtrar</button>
                                </div>

                            </div>
                        </div>




                    </div>

                    : null }


                    <div className="box box-success">
                        <div className="box-header with-border">
                            <div className="col-md-6"><h3 className="box-title">Detalle por medios de pago</h3></div>
                        </div>

                        <div className="box-body">

                            {this.state.sales_payments_details != null ?
                            <div className="row">
                                <div className="col-xs-offset-1 col-xs-10">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                    <th>Medio de pago</th>
                                    <th>Subtotal</th>
                                    <th>Comision</th>
                                    <th>Total</th>
                                    </tr>
                                    </thead>

                                <tbody>

                                {this.state.sales_payments_details.map((sale_payment_detail) => (

                                    <tr key={sale_payment_detail.id}>
                                        <td>{sale_payment_detail.payment_method_name}</td>
                                        <td>{this.convertNumber(Math.round(sale_payment_detail.amount))}</td>
                                        <td>{this.convertNumber(Math.round(sale_payment_detail.calculated_comission()))}</td>
                                        <td>{this.convertNumber(Math.round(sale_payment_detail.total()))}</td>
                                    </tr>

                                ))}
                                </tbody>
                                </table>
                            </div>
                            </div>
                                :                             <div className="row">
                                    <div className="col-xs-offset-1 col-xs-10">
                                        <PaymentMethodLoader/>
                                    </div>
                                </div>}

                        </div>
                    </div>




                                {this.state.sales ? this.state.sales.map((sale) => (
                                    <div className="box box-success" key={sale.id}>
                                        <div className="box-header with-border">
                                            <div className="col-md-6"><h3 className="box-title">Venta # {sale.id} | Vendedor: {sale.seller.name}</h3></div>
                                            <div className="col-md-5 "><h3 className="box-title pull-right "> {sale.date_time}</h3> </div>
                                            <div className="col-md-1">
                                                {sale.dtes.length > 0 ? <a  onClick={()=>this.handlePrintDteByToken(sale.dtes[0].token)} className="btn btn-primary pull-left"><i className="fa fa-file-text"></i></a>  : null}
                                                <a href="#" onClick={()=>this.handleShow(sale.id)} className="btn btn-danger pull-right"><i className="fa fa-times"></i></a>  </div>


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
                                )) :

                                    <div className="box box-success">
                                    <div className="box-header with-border">
                                    <div className="col-md-6"></div>
                                    <div className="col-md-5 "></div>
                                    <div className="col-md-1"></div>


                                    </div>
                                    <div className="box-body" >
                                        <SalesLoader/>
                                    </div>
                                    </div>

                                    }



                </div>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>
            </div>
        );
    }
}

if (document.getElementById('salesList')) {

    ReactDOM.render(<SalesList showFilters={SHOW_FILTERS}/>, document.getElementById('salesList'));
}

