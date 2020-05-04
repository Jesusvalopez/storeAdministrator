import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import DiscountForm from "./DiscountForm";
import DiscountList from "./DiscountList";
import ConfirmModal from "../ConfirmModal";
import DiscountEdit from "./DiscountEdit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class Discounts extends Component {

    constructor(props){
        super(props);
        this.state = {
            discounts : [],
            error : null,
            form:{
                name: '',
                quantity: '',
            },
            formEdit:{
                name: '',
                quantity: '',
                editId: null,
            },
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,

            showDiscountEdit: false,
            showDiscountCreate: true,
            options:[
                {value:1, label:'Activo'},
                {value:0, label:'Inactivo'}
            ],


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

        axios.get('/discounts/'+id)
            .then(res => {
                this.setState({
                    formEdit: {name: res.data.name, quantity: res.data.quantity,editId:res.data.id},
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });

        this.setState({
            showDiscountEdit:true,
            showDiscountCreate: false,

        });
    }

    handleEditHide = () => {
        this.setState({
            showDiscountEdit:false,
            showDiscountCreate: true,
        });
    }

    handleShow = (id) => {
        this.setState({
            show:true,
            deleteId: id,
        });
    }


    async componentDidMount() {
        axios.get('/discounts')
            .then(res => {
                this.setState({
                    discounts: res.data
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
            axios.post('/discounts',  this.state.form )
                .then(res => {
                    this.setState({
                        discounts: [res.data].concat(this.state.discounts),
                        form:{
                            name: '',
                            quantity: '',
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
            axios.put('/discounts/'+this.state.formEdit.editId,  this.state.formEdit )
                .then(res => {
                    this.setState({
                        discounts: res.data
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
            axios.delete('/discounts/'+this.state.deleteId,  )
                .then(res => {
                    this.setState({
                        discounts: res.data,
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
                { this.state.showDiscountCreate ? <DiscountForm form = {this.state.form}
                                                                  onChange={this.handleChange}
                                                                  onSubmit={this.handleSubmit}/> : null }


                { this.state.showDiscountEdit ? <DiscountEdit form = {this.state.formEdit}
                                                                onCancel={this.handleEditHide}
                                                                onChange={this.handleChangeEdit}
                                                                options={this.state.options}
                                                                onSubmit={this.handleSubmitEdit}/> : null }

                <DiscountList discounts = {this.state.discounts}
                               onClick={this.handleShow}
                               onClickEdit={this.handleEditShow}/>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>

            </div>
        );
    }
}

if (document.getElementById('Discounts')) {

    ReactDOM.render(<Discounts />, document.getElementById('Discounts'));
}
