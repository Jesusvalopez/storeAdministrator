import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import ProductsList from "./ProductsList";
import ProductsBundleList from "./ProductsBundleList";
import ProductsCreate from "./ProductsCreate";
import ProductsBundleCreate from "./ProductsBundleCreate";

export default class Products extends Component {

    constructor(props){
        super(props);
        this.state = {
            form : {
                name: '',
                description:'',
                stock: '',
            },
            bundle_form : {
                name: '',
                description:'',
                products_to_bundle: [],
            },
            error : null,
            pricetypes: [],
            products: [],
            bundles: [],
            editId: null,

        }


    }

    onUpdateBundleProducts = (evt) => {
        this.setState({bundle_form:{
                ...this.state.bundle_form,
            products_to_bundle: evt
        }
        });
    }
    handleUpdateBundleForm = (e) => {
        this.setState({
            bundle_form:{
                ...this.state.bundle_form,
                [e.target.name]: e.target.value
            }
        });
    }
    handleUpdateForm = (e) => {
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    handleUpdateListBundleCreate = (element) => {

        this.setState({bundles: [element].concat(this.state.bundles)});
    }
    handleUpdateListBundle = (bundlesList) => {

        this.setState({bundles: bundlesList});
    }
    handleUpdateListElement = (element) => {
        this.setState({products: [element].concat(this.state.products)});

    }
    handleUpdateBundles = (bundles) => {
        this.setState({bundles: bundles});
    }
    handleUpdatePriceTypes = (priceTypes) => {
        this.setState({pricetypes: priceTypes});
    }
    handleUpdateList = (productsList) => {
        this.setState({products: productsList});
    }



    handleOnEdit = (id) => {

        axios.get('/products/'+id)
            .then(res => {
                this.setState({
                    form: {name: res.data.name, description: res.data.description, stock: res.data.stock, editId:res.data.id}
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });

    }



    render(){

        return (
            <div>
                <div className="col-xs-6">
                {this.props.showCreate ? <ProductsCreate form={this.state.form}
                                                         onUpdatePriceTypes={this.handleUpdatePriceTypes}
                                                         onUpdateListElement={this.handleUpdateListElement}
                                                         onUpdateForm={this.handleUpdateForm}
                                                         priceTypes={this.state.pricetypes}
                                                         /> : null}
                {this.props.showList ? <ProductsList products={this.state.products} onUpdateList={this.handleUpdateList} onEdit={this.handleOnEdit}/>: null}
                </div>
                <div className="col-xs-6">
                {this.props.showCreate ? <ProductsBundleCreate products={this.state.products}
                                                               bundle_form={this.state.bundle_form}
                                                         onUpdateBundles={this.handleUpdateBundles}
                                                         handleUpdateListBundleCreate={this.handleUpdateListBundleCreate}
                                                         onUpdateBundleForm={this.handleUpdateBundleForm}
                                                         onUpdateBundleProducts={this.onUpdateBundleProducts}
                                                         priceTypes={this.state.pricetypes}
                /> : null}
                {this.props.showList ? <ProductsBundleList bundles={this.state.bundles} onUpdateListBundleCreate={this.handleUpdateListBundleCreate} onUpdateListBundle={this.handleUpdateListBundle} onEdit={this.handleOnEdit}/>: null}
                </div>
            </div>
        );
    }
}

if (document.getElementById('products')) {

    ReactDOM.render(<Products showCreate={SHOW_CREATE} showList={SHOW_LIST}/>, document.getElementById('products'));
}

