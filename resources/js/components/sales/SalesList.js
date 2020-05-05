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
                this.setState({
                    sales: res.data,
                })

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    calculateSubTotal = (sale) =>{

        var subTotal = 0.0;

        sale.sale_details.map((sale_detail)=>{
            subTotal+=parseFloat(sale_detail.price_product.price) * sale_detail.quantity;

        })

       // console.log(sale);
        return subTotal;
    }

    calculateDiscounts = (sale) =>{

        var subTotal = 0.0;
        var discount_quantity = 0;
        var discount = 0;

        sale.sale_details.map((sale_detail)=>{
            subTotal=parseFloat(sale_detail.price_product.price) * sale_detail.quantity;
            sale_detail.discount_sale_details.map((discount_sale_detail)=>{
                discount_quantity=parseInt(discount_sale_detail.discount.quantity);

            })

            if(sale_detail.discount_sale_details.length > 0)
            discount += subTotal * ((discount_quantity) / 100);

        })




        return discount;
    }

    calculateComissions = (sale) =>{

        var subTotal = 0.0;
        var comission_quantity = 0;
        var comission = 0;

        sale.payment_method_sale.map((payment_method_sales)=>{
            subTotal+=parseFloat(payment_method_sales.amount);
            comission_quantity = parseFloat(payment_method_sales.payment_method.comission);

        })

        comission = subTotal * ((comission_quantity) / 100);


        return comission;
    }

    render(){

        return (
            <div>
                <div className="col-md-12">
                    <form id="" action="/" method="" >

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
                                                <td className="text-center">{this.calculateSubTotal(sale)}</td>
                                                <td className="text-center">{this.calculateDiscounts(sale)}</td>
                                                <td className="text-center">{this.calculateComissions(sale)}</td>
                                                <td className="text-center"></td>
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
                    </form>
                </div>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>
            </div>
        );
    }
}

if (document.getElementById('salesList')) {

    ReactDOM.render(<SalesList />, document.getElementById('salesList'));
}

