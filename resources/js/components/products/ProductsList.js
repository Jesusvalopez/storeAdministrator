import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class ProductsList extends Component {

    constructor(props){
        super(props);

        this.state = {
            error : null,
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,

        }

        toast.configure();
    }


    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

     componentDidMount() {
        axios.get('/products')
            .then(res => {

                this.props.onUpdateList(res.data);

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

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


    render(){

        return (
            <div>
                <div className="col-md-12">
                    <form id="" action="/" method="" >

                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Listado de Productos</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Nombre</th>
                                            <th className="text-center">Descripción</th>
                                            <th className="text-center">Stock</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.products ? this.props.products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="text-center">{product.name}</td>
                                                <td className="text-center">{product.description}</td>
                                                <td className="text-center">{product.stock}</td>
                                                <td className="text-center">{ false ? <a href="#" className="btn btn-primary"><i
                                                    className="fa fa-edit" onClick={() => this.props.onEdit(product.id)}></i></a> : null} <a
                                                    href="#" className="btn btn-danger" onClick={() => this.handleShow(product.id)}><i
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
/*
if (document.getElementById('productsList')) {

    ReactDOM.render(<ProductsList />, document.getElementById('productsList'));
}
*/
