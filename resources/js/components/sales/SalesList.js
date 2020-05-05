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

                this.setState(prevState => {

                    const new_sales = res.data.map(sale => {
                        const  totals= this.calculateTotals(sale)

                        sale.sub_total = totals.sub_total;
                        sale.discounts = totals.discount;
                        sale.comissions = totals.comission;
                        sale.total = totals.total;

                        return sale;
                    });

                    return {sales:new_sales
                    };

                })

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }


    calculateTotals = (sale) =>{

        var subTotal = 0.0;
        var discount = 0;
        var discount_quantity = 0;


        sale.sale_details.map((sale_detail)=>{
            var sub = parseFloat(sale_detail.price_product.price) * sale_detail.quantity
            subTotal+=sub;

            sale_detail.discount_sale_details.map((discount_sale_detail)=>{
                discount_quantity=parseInt(discount_sale_detail.discount.quantity);

            });

            if(sale_detail.discount_sale_details.length > 0)
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
        return {sub_total :subTotal, discount: discount, comission: comission, total: total};
    }




    render(){

        return (
            <div>
                <div className="col-md-12">

                    <div className="box box-success">
                        <div className="box-header with-border">
                            <h3 className="box-title">Detalle Ventas</h3>
                        </div>


                                {this.state.sales ? this.state.sales.map((sale) => (
                                    <div className="box-body" key={sale.id}>
                                        <div className="row">
                                            <div className="col-xs-offset-1 col-xs-2">
                                                <h3 >Venta # {sale.id}</h3>

                                            </div>
                                            <div className="col-xs-2">
                                                <h3 >Vendedor: {sale.seller.name}</h3>

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-offset-1 col-xs-10">
                                            <table className="table table-bordered">
                                                <thead>

                                                <tr>
                                                    <th className="text-center">Producto</th>
                                                    <th className="text-center">Cantidad</th>
                                                    <th className="text-center">Descuentos Aplicados</th>
                                                    <th className="text-center">Tipo de precio</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                            {sale.sale_details.map((sale_detail)=>(
                                                <tr key={sale_detail.id}>
                                                    <td className="text-center">{sale_detail.price_product.product.name}</td>
                                                    <td className="text-center">{sale_detail.quantity}</td>
                                                    <td className="text-center">
                                                        {sale_detail.discount_sale_details.map((discount)=>(
                                                            <label className={"label label-success"} key={discount.id}>{discount.discount.name}</label>
                                                        ))}
                                                    </td>
                                                    <td className="text-center"></td>


                                                </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                    </div>
                                )) : null}




                    </div>


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
                                                <td className="text-center">$ {sale.sub_total}</td>
                                                <td className="text-center">$ {sale.discounts}</td>
                                                <td className="text-center">$ {sale.comissions}</td>
                                                <td className="text-center">$ {sale.total}</td>
                                                <td className="text-center"><a
                                                    href="#" className="btn btn-danger"><i
                                                    className="fa fa-times"></i></a></td>

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

