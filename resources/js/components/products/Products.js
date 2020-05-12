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
            bundleEditId: null,
            pricesEditList: null,
            bundlePricesEditList: null,
            show_create_btn: true,
            show_bundle_create_btn: true,
            show_update_btn: false,
            show_bundle_update_btn: false,

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
    handleCancelBundleUpdate = () => {
        this.setState({
            show_bundle_create_btn: true,
            show_bundle_update_btn: false,
            bundle_form : {
                name: '',
                description:'',
            }
        });
    }
    handleCancelUpdate = () => {
        this.setState({
            show_create_btn: true,
            show_update_btn: false,
            form : {
                name: '',
                description:'',
                stock: '',
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
console.log(element);
            this.setState({bundles: [element].concat(this.state.bundles)});
    }


    handleUpdateListBundleEdit = (element) => {

    //    this.setState({bundles: [element].concat(this.state.bundles)});

        this.setState(prevState => {


            //traigo productos anteriores
            const bundles = [...prevState.bundles];

            //los recorro
            const new_bundles = bundles.map(bundle => {

                //si es el mismo producto, lo actualizao
                if(bundle.id === element.id){

                    return element;
                }
                return bundle;

            });
            return {bundles:new_bundles
            };

        });

        this.handleCancelBundleUpdate();

    }

    handleUpdateListBundle = (element) => {

        this.setState({bundles: element});



    }
    handleCreateListElement = (element) => {
        this.setState({products: [element].concat(this.state.products)});
    }
    handleUpdateListElement = (element) => {


        this.setState(prevState => {


            //traigo productos anteriores
            const products = [...prevState.products];

            //los recorro
            const new_products = products.map(product => {

                //si es el mismo producto, lo actualizao
                if(product.id === element.id){

                    return element;
                }
                return product;

            });
            return {products:new_products
                 };

        });

        this.handleCancelUpdate();

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



    handleOnEditBundle = (id) => {
        axios.get('/bundles/'+id)
            .then(res => {

                var prices = {};
                res.data.price.map(price=>{
                    prices["price_"+price.price_type_id] = price.price;

                })

                this.setState({
                    bundle_form: {name: res.data.name, description: res.data.description,
                        ...prices,

                    },
                    show_bundle_create_btn: false,
                    show_bundle_update_btn: true,
                    bundleEditId: id,
                }, () =>{



                });

            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });
    }
    handleOnEdit = (id) => {

        axios.get('/products/'+id)
            .then(res => {

                var prices = {};
                res.data.price.map(price=>{
                    prices["price_"+price.price_type_id] = price.price;

                })

                this.setState({
                    form: {name: res.data.name, description: res.data.description, stock: res.data.stock,
                        ...prices,

                    },
                    show_create_btn: false,
                    show_update_btn: true,
                    editId: id,
                }, () =>{



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
                                                         onCreateListElement={this.handleCreateListElement}
                                                         onUpdateForm={this.handleUpdateForm}
                                                         priceTypes={this.state.pricetypes}
                                                         pricesEditList={this.state.pricesEditList}
                                                         show_create_btn={this.state.show_create_btn}
                                                         show_update_btn={this.state.show_update_btn}
                                                         onCancelUpdate={this.handleCancelUpdate}
                                                         editId={this.state.editId}
                                                         /> : null}
                {this.props.showList ? <ProductsList products={this.state.products} onUpdateList={this.handleUpdateList} onEdit={this.handleOnEdit}/>: null}
                </div>
                <div className="col-xs-6">
                {this.props.showCreate ? <ProductsBundleCreate products={this.state.products}
                                                               bundle_form={this.state.bundle_form}
                                                         onUpdateBundles={this.handleUpdateBundles}
                                                         handleUpdateListBundleCreate={this.handleUpdateListBundleCreate}
                                                         handleUpdateListBundleEdit={this.handleUpdateListBundleEdit}
                                                         onUpdateBundleForm={this.handleUpdateBundleForm}
                                                         onUpdateBundleProducts={this.onUpdateBundleProducts}
                                                         priceTypes={this.state.pricetypes}
                                                               bundlePricesEditList={this.state.bundlePricesEditList}
                                                               show_bundle_create_btn={this.state.show_bundle_create_btn}
                                                               show_bundle_update_btn={this.state.show_bundle_update_btn}
                                                               onCancelBundleUpdate={this.handleCancelBundleUpdate}
                                                               bundleEditId={this.state.bundleEditId}
                /> : null}
                {this.props.showList ? <ProductsBundleList bundles={this.state.bundles} onUpdateListBundleCreate={this.handleUpdateListBundleCreate} onUpdateListBundle={this.handleUpdateListBundle} onEdit={this.handleOnEditBundle}/>: null}
                </div>
            </div>
        );
    }
}

if (document.getElementById('products')) {

    ReactDOM.render(<Products showCreate={SHOW_CREATE} showList={SHOW_LIST}/>, document.getElementById('products'));
}

