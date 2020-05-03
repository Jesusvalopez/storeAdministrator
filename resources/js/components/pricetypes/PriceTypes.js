import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PriceTypeForm from "./PriceTypeForm";
import PriceTypeList from "./PriceTypeList";
import ConfirmModal from "../ConfirmModal";
import PriceTypeEdit from "./PriceTypeEdit";


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
            },
            show:false,
            text: '¿Está seguro que desea eliminar el registro?',
            deleteId: null,
            editId: null,
            showPriceTypeEdit: false,
            showPriceTypeCreate: true,
            options:[
                {value:1, label:'Activo'},
                {value:0, label:'Inactivo'}
            ],
            selected: 0,

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

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
                    formEdit: {name: res.data.name, status: res.data.status},
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
            editId:id
        });
    }

    handleEditHide = (id) => {
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

                })
        }catch (e) {

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

                })
        }catch (e) {
        console.log(e);
        }
    }

    handleChangeEdit = (e) =>{
        this.setState({
            formEdit:{[e.target.name]: e.target.value}
        });
    }
    handleChange(e){
        this.setState({
            form:{[e.target.name]: e.target.value}
        });
    }



    render(){

        return (
            <div>
                { this.state.showPriceTypeCreate ? <PriceTypeForm form = {this.state.form}
                                                                onChange={this.handleChange}
                                                                onSubmit={this.handleSubmit}/> : null }


                { this.state.showPriceTypeEdit ? <PriceTypeEdit form = {this.state.formEdit}
                                                                onCancel={this.handleEditHide}
                                                                onChange={this.handleChangeEdit}
                                                                options={this.state.options} selected={this.state.selected}/> : null }

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
