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

    onClickUpdateBtn = (e) =>{
        e.preventDefault();
        try {
            axios.put('/products/'+this.props.editId,  this.props.form )
                .then(res => {
console.log(res.data);
                    //this.props.onUpdateListElement(res.data);
                    this.resetForm();
                    this.notify('Registro actualizado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo actualizar el registro')
        }
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
            <div className="row">
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
                                               onChange={this.handleChange} value={this.props.form.name}/>
                                    </div>
                                    <div className="col-xs-7">
                                        <input type="text" name="description" className="form-control" placeholder="Descripción "
                                               onChange={this.handleChange} value={this.props.form.description}/>
                                    </div>
                                    <div className="col-xs-2">
                                        <input type="text" name="stock" className="form-control" placeholder="Stock"
                                               onChange={this.handleChange} value={this.props.form.stock}/>
                                    </div>

                                </div>

                            </div>
                            <div className="box-header with-border">
                                <h3 className="box-title">Precios</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    {this.props.priceTypes ? this.props.priceTypes.map((pricetype) => {
                                        var nameProperty = "price_"+pricetype.id;
                                        return(
                                        <div className="col-xs-2" key={pricetype.id}>
                                            <label >{pricetype.name}</label>
                                            <input type="number" name={"price_"+pricetype.id} className="form-control"
                                                   onChange={this.handleChange} value={this.props.form[nameProperty] || ""}/>
                                        </div>)
                                    }) : null}

                                </div>
                            </div>

                            <div className="box-body">
                                <div className="row">

                                    {this.props.show_create_btn ?
                                    <div className="col-xs-2">
                                        <button type="submit" className="btn btn-block btn-primary" >Crear</button>
                                    </div>
                                    : null }
                                    {this.props.show_update_btn ?
                                        <div>
                                            <div className="col-xs-3">
                                                <button onClick={this.onClickUpdateBtn} type="" className="btn btn-block btn-primary">Actualizar
                                                </button>
                                            </div>
                                            <div className="col-xs-2">
                                                <button type="" className="btn btn-block default" onClick={this.props.onCancelUpdate}>Cancelar
                                                </button>
                                            </div>
                                        </div>
                                        : null}
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
