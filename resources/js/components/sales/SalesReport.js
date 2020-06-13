import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';
import {trackPromise} from "react-promise-tracker";

import {Doughnut, Line} from 'react-chartjs-2';

export default class SalesReport extends Component {

    constructor(props){
        super(props);

        this.state = {
            sales : null,
            range_start_date: Moment().startOf('month').valueOf(),
            range_end_date: Date.now(),
            _data : {labels: [], datasets: []},
            sales_projection : {labels: [], datasets: []},
            data_donut : {
                labels: [], datasets: [],
                    hoverBackgroundColor: [
                    ]
                }


        }

        toast.configure();
    }


    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

    componentDidMount() {

        const start_date = Moment(this.state.range_start_date).format('YYYY/MM/DD');
        const end_date = Moment(this.state.range_end_date).format('YYYY/MM/DD');

        trackPromise(
            axios.post('/sales/reports-by-date', {start_date: start_date, end_date:end_date})
                .then(res => {



                       this.calculateGraphs(res, true);


                }))
    }


    handleFilterDateClick = () =>{

        const start_date = Moment(this.state.range_start_date).format('YYYY/MM/DD');
        const end_date = Moment(this.state.range_end_date).format('YYYY/MM/DD');

        trackPromise(
            axios.post('/sales/reports-by-date', {start_date: start_date, end_date:end_date})
                .then(res => {



                       this.calculateGraphs(res, false)



                }))
    }


    calculatePaymentMethodsDetails (res){
        var data = res.data.sales;

        var paymentsModelsTotals = [];

        data.map(sale => {

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
        });

        return paymentsModelsTotals;
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

    calculateProjectedSalesGraph(average, average_brutas){

        var labels = [];
        var data_projected = [];
        var data_projected_brutas = [];

        const start_date = Moment(Date.now()).startOf('month');
        const end_date = Moment(Date.now()).endOf('month');

        const days = end_date.diff(start_date, 'days') + 1;


        var i=1;
        var average_acum = 0.0;
        var average_acum_brutas = 0.0;
        for(i; i<=days; i++){

            labels.push(i);
            data_projected.push(average_acum+=average);
            data_projected_brutas.push(average_acum_brutas+=average_brutas);
        }

        this.setState({
            sales_projection: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ventas proyectadas brutas',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgb(0,155,192)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(0,155,192)',
                        pointBackgroundColor: 'rgb(0,155,192)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(0,155,192)',
                        pointHoverBorderColor: 'rgb(0,155,192)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data_projected_brutas
                    },
                    {
                        label: 'Ventas proyectadas netas',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgb(0,192,31)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(0,192,31)',
                        pointBackgroundColor: 'rgb(0,192,31)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(0,192,31)',
                        pointHoverBorderColor: 'rgb(0,192,31)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data_projected
                    },



                ]
            }
        })

    }

    convertNumber = (value) =>{

        var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };



    calculateGraphs (res, calc_projected){

        var data_order_by = res.data.salesOrderBy;

        var labels = [];

        var data = [];
        var data_netas = [];
        var data_promedio = [];
        var data_promedio_bruto = [];

        var totals = 0.0;
        var totals_brutas = 0.0;

        for (var key in data_order_by) {
            labels.push(key)


            var total = 0.0;
            var total_neto = 0.0;

            data_order_by[key].map(element => {
                var calculated = this.calculateTotals(element)
                total += calculated.sub_total;
                totals_brutas += calculated.sub_total;
                total_neto += calculated.total;
                totals += calculated.total;
            });

           data_netas.push(total_neto);
          data.push(total);

        }


        var average = totals / data_netas.length;
        var average_brutas = totals_brutas / data_netas.length;

        if(calc_projected){
        this.calculateProjectedSalesGraph(average, average_brutas);
        }

        data_netas.map(element => data_promedio.push(average) );
        data_netas.map(element => data_promedio_bruto.push(average_brutas) );

        var paymetMethodsDetails = this.calculatePaymentMethodsDetails(res);


        var donuts_labels = [];
        var donuts_amounts = [];
        var donuts_bg_colors = [];

        const colors = {"Efectivo Pedidos Ya": "#00cff5","Pedidos Ya": "#00cff5", "Rappi":"#ff441f", "Transferencia": "#2500ff",
            "Crédito": "#ffbc41","Efectivo": "#00ff6b", "Débito": "#b054ff"}

        paymetMethodsDetails.map(element => {
            donuts_labels.push(element.payment_method_name)
            donuts_amounts.push(element.amount)
            donuts_bg_colors.push(colors[element.payment_method_name]);

        });

        this.setState({
            _data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ventas Brutas',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgb(0,155,192)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(0,155,192)',
                        pointBackgroundColor: 'rgb(0,155,192)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(0,155,192)',
                        pointHoverBorderColor: 'rgb(0,155,192)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data
                    },
                    {
                        label: 'Ventas netas',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgb(0,192,31)',
                        borderColor: 'rgb(0,192,31)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(0,192,31)',
                        pointBackgroundColor: 'rgb(0,192,31)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(0,192,31)',
                        pointHoverBorderColor: 'rgb(0,192,31)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data_netas
                    },
                    {
                        label: 'Promedio bruto',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgb(192,86,0)',
                        borderColor: 'rgb(192,86,0)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(192,86,0)',
                        pointBackgroundColor: 'rgb(192,86,0)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(192,86,0)',
                        pointHoverBorderColor: 'rgb(192,86,0)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data_promedio_bruto
                    },
                    {
                        label: 'Promedio neto',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgb(82,78,78)',
                        borderColor: 'rgb(82,78,78)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(82,78,78)',
                        pointBackgroundColor: 'rgb(82,78,78)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgb(82,78,78)',
                        pointHoverBorderColor: 'rgb(82,78,78)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data_promedio
                    },


                ]
        },
            data_donut:{
                labels: donuts_labels,
                datasets: [{
                    data: donuts_amounts,
                    backgroundColor: donuts_bg_colors,
                    hoverBackgroundColor: donuts_bg_colors
                }]
            }
        })





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



        return (
            <div>

                <div className="col-md-12">
                <div className="box box-success">
                    <div className="box-header with-border">
                        <div className="col-md-6"><h3 className="box-title">Filtros</h3></div>
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




                </div>

                <div className="col-md-8">
                    <div className="box box-success">
                        <div className="box-header with-border">
                            <div className="col-md-6"><h3 className="box-title">Ventas</h3></div>
                        </div>

                        <div className="box-body">


                            <Line data={this.state._data} width={150} options={{scales: {
                                    yAxes: [{
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return value.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                                            }
                                        }
                                    }]
                                },
                            tooltips:{
                                mode: 'index',
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        var label = data.datasets[tooltipItem.datasetIndex].label || 'Other';
                                        var value = Math.round(tooltipItem.value);
                                        return label + ' : '+ '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                                    }
                                }
                            }}}
                                  height={50}/>

                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="box box-success">
                        <div className="box-header with-border">
                            <div className="col-md-6"><h3 className="box-title">Ventas por medio de pago</h3></div>
                        </div>

                        <div className="box-body">


                            <Doughnut data={this.state.data_donut} width={71} options={{tooltips:{

                                    callbacks: {
                                        label: function(tooltipItem, data) {
                                            var label = data.labels[tooltipItem.index] || 'Other';
                                            var value = Math.round(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                                            return label + ' : '+ '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                                        }
                                    }
                                }}}
                                      height={50}/>

                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="box box-success">
                        <div className="box-header with-border">
                            <div className="col-md-6"><h3 className="box-title">Proyección de ventas</h3></div>
                        </div>

                        <div className="box-body">


                            <Line data={this.state.sales_projection} width={300}
                                  height={50} options={{scales: {
                                    yAxes: [{
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return value.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                                            }
                                        }
                                    }]
                                },

                                tooltips:{
                                mode: 'index',
                                callbacks: {
                                label: function(tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || 'Other';
                                var value = Math.round(tooltipItem.value);
                                return label + ' : '+ '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                            }
                            }
                            }}}/>

                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

if (document.getElementById('salesReports')) {

    ReactDOM.render(<SalesReport/>, document.getElementById('salesReports'));
}

