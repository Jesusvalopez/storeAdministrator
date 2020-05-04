import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PaymentMethodForm from "./PaymentMethodForm";
import PaymentMethodList from "./PaymentMethodList";
import ConfirmModal from "../ConfirmModal";
import PaymentMethodEdit from "./PaymentMethodEdit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class PaymentMethods extends Component {

    constructor(props){
        super(props);
        this.state = {
            payment_methods : [],
            error : null,
            form:{
                name: '',
                comission: '',
            },
            formEdit:{
                name: '',
                comission: '',
                editId: null,
            },
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,

            showPaymentMethodEdit: false,
            showPaymentMethodCreate: true,


        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        toast.configure();
    }


    handleClose(e){
        this.setState({
            show:false
        });
    }
    handleEditShow = (id) => {

        axios.get('/payment-methods/'+id)
            .then(res => {
                this.setState({
                    formEdit: {name: res.data.name, comission: res.data.comission,editId:res.data.id},
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });

        this.setState({
            showPaymentMethodEdit:true,
            showPaymentMethodCreate: false,

        });
    }

    handleEditHide = () => {
        this.setState({
            showPaymentMethodEdit:false,
            showPaymentMethodCreate: true,
        });
    }

    handleShow = (id) => {
        this.setState({
            show:true,
            deleteId: id,
        });
    }


    async componentDidMount() {
        axios.get('/payment-methods')
            .then(res => {
                this.setState({
                    payment_methods: res.data
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    async handleSubmit(e){
        e.preventDefault()
        try {
            axios.post('/payment-methods',  this.state.form )
                .then(res => {
                    this.setState({
                        payment_methods: [res.data].concat(this.state.payment_methods),
                        form:{
                            name: '',
                            comission: '',
                        }
                    });
                    this.notify('Registro creado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo crear el registro')
        }
    }

    handleSubmitEdit = (e) =>{
        e.preventDefault();
        try {
            axios.put('/payment-methods/'+this.state.formEdit.editId,  this.state.formEdit )
                .then(res => {
                    this.setState({
                        payment_methods: res.data
                    });
                    this.handleEditHide();
                    this.notify('Registro modificado con éxito')
                })
        }catch (e) {
            this.notifyError('No se pudo editar el registro')
        }
    }

    deleteAction = (e) =>{
        e.preventDefault();
        try {

            // <input type="hidden" name="_method" value="delete">//{params: {id: id}})
            axios.delete('/payment-methods/'+this.state.deleteId,  )
                .then(res => {
                    this.setState({
                        payment_methods: res.data,
                        show: false,

                    });
                    this.notify('Registro eliminado con éxito')

                })
        }catch (e) {
            this.notifyError('No se pudo eliminar el registro')
        }
    }

    handleChangeEdit = (e) =>{

        this.setState({
            formEdit:{
                ...this.state.formEdit,
                [e.target.name]: e.target.value
            }
        });
    }
    handleChange(e){
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value}
        });
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);


    render(){

        return (
            <div>
                { this.state.showPaymentMethodCreate ? <PaymentMethodForm form = {this.state.form}
                                                                onChange={this.handleChange}
                                                                onSubmit={this.handleSubmit}/> : null }


                { this.state.showPaymentMethodEdit ? <PaymentMethodEdit form = {this.state.formEdit}
                                                              onCancel={this.handleEditHide}
                                                              onChange={this.handleChangeEdit}
                                                              onSubmit={this.handleSubmitEdit}/> : null }

                <PaymentMethodList payment_methods = {this.state.payment_methods}
                              onClick={this.handleShow}
                              onClickEdit={this.handleEditShow}/>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>

            </div>
        );
    }
}

if (document.getElementById('PaymentMethods')) {

    ReactDOM.render(<PaymentMethods />, document.getElementById('PaymentMethods'));
}
