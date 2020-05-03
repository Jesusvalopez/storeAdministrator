import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PriceTypeForm from "./PriceTypeForm";
import PriceTypeList from "./PriceTypeList";
import ConfirmModal from "../ConfirmModal";
import PriceTypeEdit from "./PriceTypeEdit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class PriceTypes extends Component {

    constructor(props){
        super(props);
        this.state = {
            pricetypes : [],
            error : null,
            form:{
                name: ''
            },
            formEdit:{
                name: '',
                status: '',
                editId: null,
            },
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,

            showPriceTypeEdit: false,
            showPriceTypeCreate: true,
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

        axios.get('/price-types/'+id)
            .then(res => {
                this.setState({
                    formEdit: {name: res.data.name, status: res.data.status,editId:res.data.id},
                    selected: res.data.status,
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            });

        this.setState({
            showPriceTypeEdit:true,
            showPriceTypeCreate: false,

        });
    }

    handleEditHide = () => {
        this.setState({
            showPriceTypeEdit:false,
            showPriceTypeCreate: true,
        });
    }

    handleShow = (id) => {
        this.setState({
            show:true,
            deleteId: id,
        });
    }


    async componentDidMount() {
        axios.get('/price-types')
            .then(res => {
                this.setState({
                    pricetypes: res.data
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
            axios.post('/price-types',  this.state.form )
                .then(res => {
                    this.setState({
                        pricetypes: [res.data].concat(this.state.pricetypes),
                        form:{
                            name: ''
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
            axios.put('/price-types/'+this.state.formEdit.editId,  this.state.formEdit )
                .then(res => {
                    this.setState({
                        pricetypes: res.data
                    });
                    this.handleEditHide()
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
            axios.delete('/price-types/'+this.state.deleteId,  )
                .then(res => {
                    this.setState({
                        pricetypes: res.data,
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
            form:{[e.target.name]: e.target.value}
        });
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);


    render(){

        return (
            <div>
                { this.state.showPriceTypeCreate ? <PriceTypeForm form = {this.state.form}
                                                                onChange={this.handleChange}
                                                                onSubmit={this.handleSubmit}/> : null }


                { this.state.showPriceTypeEdit ? <PriceTypeEdit form = {this.state.formEdit}
                                                                onCancel={this.handleEditHide}
                                                                onChange={this.handleChangeEdit}
                                                                options={this.state.options}
                                                                onSubmit={this.handleSubmitEdit}/> : null }

                <PriceTypeList pricetypes = {this.state.pricetypes}
                               onClick={this.handleShow}
                               onClickEdit={this.handleEditShow}/>
                <ConfirmModal handleClose={this.handleClose} show={this.state.show} text={this.state.text} action={this.deleteAction}/>

            </div>
        );
    }
}

if (document.getElementById('PriceTypes')) {

    ReactDOM.render(<PriceTypes />, document.getElementById('PriceTypes'));
}
