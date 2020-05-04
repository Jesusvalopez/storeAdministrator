import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default class ProductsCreate extends Component {

    constructor(props){
        super(props);
        this.state = {
            error : null,


        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);

    async componentDidMount() {
        axios.get('/price-types')
            .then(res => {
                this.props.onUpdatePriceTypes(res.data);
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    resetForm = () => {
        document.getElementById("createProductForm").reset();
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        try {
            axios.post('/products',  this.props.form )
                .then(res => {

                    this.props.onUpdateListElement(res.data);
                    this.resetForm();
                    this.notify('Registro creado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo crear el registro')
        }
    }

    handleChange = (e) =>{
        this.props.onUpdateForm(e);
    }

/*
    handleChange = (e) =>{

        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
*/


    render(){

        return (
            <div>
                <div className="col-md-12">
                    <form id="createProductForm" action="/" method="" onSubmit={this.handleSubmit}>

                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Nuevo Producto</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-xs-3">
                                        <input type="text" name="name" className="form-control" placeholder="Nombre del producto"
                                               onChange={this.handleChange}/>
                                    </div>
                                    <div className="col-xs-8">
                                        <input type="text" name="description" className="form-control" placeholder="Descripción "
                                               onChange={this.handleChange}/>
                                    </div>
                                    <div className="col-xs-1">
                                        <input type="text" name="stock" className="form-control" placeholder="Stock"
                                               onChange={this.handleChange}/>
                                    </div>

                                </div>

                            </div>
                            <div className="box-header with-border">
                                <h3 className="box-title">Precios</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    {this.props.priceTypes ? this.props.priceTypes.map((pricetype) => (
                                        <div className="col-xs-2" key={pricetype.id}>
                                            <label >{pricetype.name}</label>
                                            <input type="text" name={"price_"+pricetype.id} className="form-control"
                                                   onChange={this.handleChange}/>
                                        </div>
                                    )) : null}

                                </div>
                            </div>

                            <div className="box-body">
                                <div className="row">

                                    <div className="col-xs-2">
                                        <button type="submit" className="btn btn-block btn-primary" >Crear</button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
/*
if (document.getElementById('products')) {

    ReactDOM.render(<ProductsCreate />, document.getElementById('products'));
}
*/
