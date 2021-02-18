import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ContentLoader from "react-content-loader";
import Moment from 'moment';
import ConfirmModal from "../ConfirmModal";
import {toast} from "react-toastify";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import DataTable from 'react-data-table-component';
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";

const ItemsLoader = () => (
    <ContentLoader width={'100%'} height={100}>
        <rect x="0%" y="4" rx="0" ry="0" width="100%" height="22" />

        <rect x="0%" y="33" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="33" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="33" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="33" rx="0" ry="0" width="20%" height="13" />
        <rect x="0%" y="55" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="55" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="55" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="55" rx="0" ry="0" width="20%" height="13" />
        <rect x="0%" y="77" rx="0" ry="0" width="34%" height="13" />
        <rect x="35%" y="77" rx="0" ry="0" width="22%" height="13" />
        <rect x="58%" y="77" rx="0" ry="0" width="24%" height="13" />
        <rect x="83%" y="77" rx="0" ry="0" width="20%" height="13" />


    </ContentLoader>
);

export default class Items extends Component {



    constructor(props){
        super(props);


        this.state = {
            items: null,
            blocking:false,
            show_update_modal:false,
            selected_rows: null

        }

        toast.configure();
    }

    notify = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);



    componentDidMount() {

        axios.get('/woocommerce/get-items')
            .then(res => {
                console.log(res.data);

                this.setState({
                    items: res.data.items
                })


            })

    }

    convertNumber = (value) =>{

        var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


        return response;
    };

    translateStatus(status){

        switch(status){
            case 'instock':
                return 'Hay existencias';
                break;
            case 'outofstock':
                return 'Agotado';
                break;

        }

    }


    showUpdateModal = (selected_rows) =>{
        this.setState({
            show_update_modal: true,
            selected_rows: selected_rows,
        })
    }

    syncProducts = () =>{

        this.setState({
            blocking: true
        }, () =>{


            axios.post('/woocommerce/sync-items')
                .then(res => {
                    console.log(res.data);

                    this.setState({
                        items: res.data.items,
                        blocking: false
                    })


                })

        })


    }


    handleUpdateItems = () =>{

        var status = document.getElementById("statusSelect");
        var status_value = status.value;



        this.setState({
            show_update_modal:false,
            blocking:true,

        },()=>{

            //Axios
            axios.post('/woocommerce/update-items', {status: status_value, items:this.state.selected_rows})
                .then(res => {
                    console.log(res.data);

                    this.setState({
                        blocking:false,
                        items:res.data.items
                    });
                    this.notify('Productos actualizados');

                })

        });


    }
    handleCloseDetailsModal = () =>{
        this.setState({
            show_update_modal:false,

        });
    }


    render(){

        const columns = [
            {
                name: "Producto",
                selector: 'name',
                sortable: true,
                maxWidth: '60%',

            },
            {
                name: "Estado",
                maxWidth: '20%',
                cell: row => this.translateStatus(row.stock_status)
            },

            {
                name:"Acciones",
                sortable: false,
                center: true,
                maxWidth: '10%',
                cell: row => ""
            },
        ];

        const customStyles = {
            rows: {
                style: {
                    fontSize: '1.1rem', // override the row height
                }
            },
            headCells: {
                style: {
                    fontSize: '1.1rem', // override the row height
                }
            },
            cells: {
                style: {
                    fontSize: '1.1rem', // override the row height
                }
            },
        };

        const items = this.state.items;

        const BasicTable = () => {
            const [filterText, setFilterText] = React.useState('');
            const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
            let filteredItems = [];
            if(items){
            filteredItems = items.filter(item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) || (item.stock_status && this.translateStatus(item.stock_status).toLowerCase().includes(filterText.toLowerCase())));
            }
            const handleClear = () => {
                if (filterText) {
                    setResetPaginationToggle(!resetPaginationToggle);
                    setFilterText('');
                    //this.setState({filterText: '', resetPaginationToggle: !this.state.resetPaginationToggle});
                }
            };

            const [selectedRows, setSelectedRows] = React.useState([]);

            const returnTableTrans =() =>
            {
                return { rowsPerPageText: "Filas por página", rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'All' }
            }

            return (
                <>
                    {selectedRows.length > 0 ?
                        <>
                            <div style={{textAlign:'right'}}> <button className="primary-button btn btn-primary" onClick={() => this.showUpdateModal(selectedRows)}> <i className=""></i> Cambiar estado</button></div>
                            <br/>
                        </>
                        : null}
                    <div style={{textAlign:'right'}}>
                        <input id="search" type="text" placeholder="Filtrar" aria-label="Search Input"
                               value={filterText} onChange={e => setFilterText(e.target.value)} />
                        <button className="ir-button" onClick={handleClear}><i className="fa fa-times"></i></button>

                    </div>
                    <br/>
                    <DataTable

                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination={true}
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                        persistTableHead
                        selectableRows
                        paginationComponentOptions={returnTableTrans()}
                        onSelectedRowsChange={rows => setSelectedRows(rows.selectedRows)}
                    />
                </>
            )

        }


        return (
            <div>

                <BlockUi tag="div" blocking={this.state.blocking}>
                    <div className="row">

                <div className="col-md-12">


                    <div className="box box-success">
                        <div className="box-header with-border">
                            <h3 className="box-title">Productos</h3>
                            <a href="#" onClick={this.syncProducts} className="btn btn-primary  pull-right">Sincronizar</a>
                        </div>
                        <div className="box-body">



                            {this.state.items ? <BasicTable /> : <ItemsLoader/>}

                        </div>
                    </div>
                </div>
                </div>
                </BlockUi>

                <Modal show={this.state.show_update_modal} bsSize='small'>
                    <Modal.Header>
                        <Modal.Title componentClass="h3">Cambiar estado</Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">


                        <select name="" id="statusSelect" className="form-control">
                            <option value="instock">Hay existencias</option>
                            <option value="outofstock">Agotado</option>
                        </select>


                    </div>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleCloseDetailsModal} bsSize="large">
                            Cerrar
                        </Button>
                        <Button bsStyle="primary" onClick={this.handleUpdateItems} bsSize="large">
                            Actualizar
                        </Button>

                    </Modal.Footer>
                </Modal>

            </div>

        );
    }
}

if (document.getElementById('woocommerceItems')) {

    ReactDOM.render(<Items/>, document.getElementById('woocommerceItems'));
}

