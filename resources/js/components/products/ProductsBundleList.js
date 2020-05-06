import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class ProductsBundleList extends Component {

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
        axios.get('/bundles')
            .then(res => {

                this.props.onUpdateListBundle(res.data);

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
            axios.delete('/bundles/'+this.state.deleteId,  )
                .then(res => {

                    this.props.onUpdateListBundle(res.data);
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
            <div className="row">
                <div className="col-md-12">
                    <form id="" action="/" method="" >

                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Listado de combos</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">

                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Nombre</th>
                                            <th className="text-center">Descripción</th>
                                            <th className="text-center">Productos</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.bundles ? this.props.bundles.map((bundle) => (
                                            <tr key={bundle.id}>
                                                <td className="text-center">{bundle.name}</td>
                                                <td className="text-center">{bundle.description}</td>
                                                <td className="text-center">{bundle.products.map((product)=>(
                                                    <label className={"label label-success"} key={product.id}>{product.name}</label>
                                                ))}</td>

                                                <td className="text-center">{ false ? <a href="#" className="btn btn-primary"><i
                                                    className="fa fa-edit" onClick={() => this.props.onEdit(bundle.id)}></i></a> : null} <a
                                                    href="#" className="btn btn-danger" onClick={() => this.handleShow(bundle.id)}><i
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
