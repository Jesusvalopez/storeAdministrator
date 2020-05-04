import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class ProductsList extends Component {

    constructor(props){
        super(props);
        console.log(props)
        this.state = {
            error : null,
            products: props.products,
        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

    async componentDidMount() {
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
    }


    render(){

        return (
            <div>
                <div className="col-md-12">
                    <form id="createProductForm" action="/" method="" onSubmit={this.handleSubmit}>

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
                                        {this.state.products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="text-center">{product.name}</td>
                                                <td className="text-center">{product.description}</td>
                                                <td className="text-center">{product.stock}</td>
                                                <td className="text-center"><a href="#" className="btn btn-primary"><i
                                                    className="fa fa-edit" ></i></a> <a
                                                    href="#" className="btn btn-danger"><i
                                                    className="fa fa-times"></i></a></td>

                                            </tr>
                                        ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>


                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

if (document.getElementById('productsList')) {

    ReactDOM.render(<ProductsList />, document.getElementById('productsList'));
}
