import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select, { components } from 'react-select';

const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

export default class ProductsBundleCreate extends Component {

    constructor(props){
        super(props);
        this.state = {
            error : null,
            products_to_bundle:[],
            selected_value:null,
        }

        toast.configure();
    }


    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarning = (text) => toast.warn(text);

    async componentDidMount() {
        axios.get('/bundles')
            .then(res => {
                this.props.onUpdateBundles(res.data);
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    resetForm = () => {
        document.getElementById("createBundleProductForm").reset();
    }

    handleSubmit = (e) =>{
        e.preventDefault();

        if(this.state.products_to_bundle.length < 1 ){
            this.notifyWarning('Debe agregar productos al combo')
            return false;
        }

        try {
            axios.post('/bundles',  this.props.bundle_form )
                .then(res => {

                    this.props.handleUpdateListBundleCreate(res.data);
                    this.resetForm();
                    this.notify('Registro creado con éxito')
                    this.setState({products_to_bundle:[]},()=>{
                        this.props.onUpdateBundleProducts(this.state.products_to_bundle);
                    });

                })
        }catch (e) {
            this.notifyError('No se pudo crear el registro')
        }
    }

    handleChange = (e) =>{
        this.props.onUpdateBundleForm(e);
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

    deleteProductOnBundleList = (id) => {

            this.setState(prevState => {

                const products_to_bundle = [...prevState.products_to_bundle];

                const new_products_to_bundle = products_to_bundle.filter(product_to_bundle => {
                    return product_to_bundle.product.id !== id;
                });

                return {products_to_bundle:new_products_to_bundle
                };

            },()=>{
                this.props.onUpdateBundleProducts(this.state.products_to_bundle);
            });

    }

    handleSelectChange = (e) => {
            this.setState({
                selected_value:e.value,
            })
    }
    handleUpdateBundleCreateList = (e) => {
            e.preventDefault();
            var product_quantity_element = document.getElementById("product_quantity");

        if(isNaN(product_quantity_element.value) || product_quantity_element.value < 1){
            this.notifyWarning('Debe agregar cantidad');
            document.getElementById("product_quantity").focus();
            return false;
        }


            const product = this.props.products.find(product => (product.id === parseInt(this.state.selected_value)));

            const alreadyProduct = this.state.products_to_bundle.find(products_to_bundle =>(products_to_bundle.product.id === product.id));

            if(alreadyProduct){
                this.notifyWarning('Producto ya está en la lista');
                return false;
            }

            var product_to_bundle = {
                product:product,
                quantity: parseInt(product_quantity_element.value),

            };




            this.setState(prevState => {
                    const new_product_to_bundle = [...prevState.products_to_bundle];
                    return {
                        products_to_bundle:new_product_to_bundle.concat(product_to_bundle)
                    }
                },()=>{
                this.props.onUpdateBundleProducts(this.state.products_to_bundle);
                }
            );

            product_quantity_element.value = '';


        }


    onClickUpdateBtn = (e) =>{
        e.preventDefault();
        try {
            axios.put('/bundles/'+this.props.bundleEditId,  this.props.bundle_form )
                .then(res => {

                    this.props.handleUpdateListBundleCreate(res.data);
                    this.resetForm();
                    this.notify('Registro actualizado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo actualizar el registro')
        }
    }



    render(){

        return (
            <div className="row">
                <div className="col-md-12">
                    <form id="createBundleProductForm" action="/" method="" onSubmit={this.handleSubmit}>

                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">Nuevo Combo</h3>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-xs-3">
                                        <input type="text" name="name" className="form-control" placeholder="Nombre del producto"
                                               onChange={this.handleChange} value={this.props.bundle_form.name}/>
                                    </div>
                                    <div className="col-xs-7">
                                        <input type="text" name="description" className="form-control" placeholder="Descripción "
                                               onChange={this.handleChange} value={this.props.bundle_form.description}/>
                                    </div>

                                </div>
                                <br/>
                                <div className="row">
                                    <div className="col-xs-5">
                                        <label htmlFor="">Productos</label>
                                            <Select  components={{ Placeholder }}
                                                     placeholder={'Seleccione'} onChange={this.handleSelectChange} options={this.props.products.map((product)=>{
                                                return {"value":product.id, "label":product.name};
                                            })} />
                                    </div>
                                    <div className="col-xs-2">
                                        <label htmlFor="">Cantidad</label>
                                        <input id="product_quantity" type="number" name="product_quantity" className="form-control" placeholder=""
                                               />
                                    </div>
                                    <div className="col-xs-3">
                                        <label htmlFor=""></label>
                                        <button type="" className="btn btn-block btn-primary" onClick={this.handleUpdateBundleCreateList}>Agregar Producto</button>
                                    </div>
                                </div>
                                <br/>
                                <div className="row">


                                    <table className="table table-bordered">
                                        <thead>

                                        <tr>
                                            <th className="text-center">Producto</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {this.state.products_to_bundle.map((product)=>(
                                            <tr key={product.product.id}>
                                                <td className="text-center">
                                                    {product.product.name}
                                                </td>
                                                <td className="text-center">
                                                    {product.quantity}
                                                </td>
                                                <td className="text-center"><a href="#" className="btn btn-danger" onClick={() => this.deleteProductOnBundleList(product.product.id)}><i
                                                    className="fa fa-times"></i></a></td>

                                            </tr>
                                        ))}
                                        </tbody>
                                        </table>

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
                                                   onChange={this.handleChange} value={this.props.bundle_form[nameProperty] || ""}/>
                                        </div>)
                                    }) : null}

                                </div>
                            </div>

                            <div className="box-body">
                                <div className="row">

                                    {this.props.show_bundle_create_btn ?
                                        <div className="col-xs-2">
                                            <button type="submit" className="btn btn-block btn-primary" >Crear</button>
                                        </div>
                                        : null }
                                    {this.props.show_bundle_update_btn ?
                                        <div>
                                            <div className="col-xs-3">
                                                <button onClick={this.onClickUpdateBtn} type="" className="btn btn-block btn-primary">Actualizar
                                                </button>
                                            </div>
                                            <div className="col-xs-2">
                                                <button type="" className="btn btn-block default" onClick={this.props.onCancelBundleUpdate}>Cancelar
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
