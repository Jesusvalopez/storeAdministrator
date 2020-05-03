import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ConfirmModal from "../ConfirmModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class Products extends Component {

    constructor(props){
        super(props);
        this.state = {
            products : [],
            error : null,
        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);


    render(){

        return (
            <div>

            </div>
        );
    }
}

if (document.getElementById('products')) {

    ReactDOM.render(<Products />, document.getElementById('products'));
}
