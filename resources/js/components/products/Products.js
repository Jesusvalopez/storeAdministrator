import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import 'react-toastify/dist/ReactToastify.css';
import ProductsList from "./ProductsList";
import ProductsCreate from "./ProductsCreate";

export default class Products extends Component {

    constructor(props){
        super(props);
        this.state = {
            form : {
                name: '',
                description:'',
                stock: '',
            },
            error : null,
            pricetypes: [],
            products: [],
            editId: null,

        }


    }

    handleUpdateForm = (e) => {
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
    handleUpdateListElement = (element) => {
        this.setState({products: [element].concat(this.state.products)});

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
                {this.props.showCreate ? <ProductsCreate form={this.state.form}
                                                         onUpdatePriceTypes={this.handleUpdatePriceTypes}
                                                         onUpdateListElement={this.handleUpdateListElement}
                                                         onUpdateForm={this.handleUpdateForm}
                                                         priceTypes={this.state.pricetypes}
                                                         /> : null}
                {this.props.showList ? <ProductsList products={this.state.products} onUpdateList={this.handleUpdateList} onEdit={this.handleOnEdit}/>: null}

            </div>
        );
    }
}

if (document.getElementById('products')) {

    ReactDOM.render(<Products showCreate={SHOW_CREATE} showList={SHOW_LIST}/>, document.getElementById('products'));
}

