import React from 'react';

const ExpenseProductsEdit = ({form, onCancel, onChange, onSubmit}) => (



    <div className="col-md-12">
        <form action={"/expense-products/"+form.editId} method="PUT" onSubmit={onSubmit}>

            <div className="box box-info">
                <div className="box-header with-border">
                    <h3 className="box-title">Editar Producto o Servicio</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-8">
                            <input type="text" name="name" className="form-control" placeholder="Nombre del producto o servicio" value={form.name} onChange={onChange}
                            />
                        </div>
                        <div className="col-xs-3">
                            <input type="text" name="price" className="form-control" placeholder="Costo" value={form.price} onChange={onChange}
                            />
                        </div>


                    </div>

                    <br/>
                    <div className="row">
                        <div className="col-xs-12">
                            <input id ="productDescription" type="text" name="description" className="form-control" placeholder="Descripción"
                                   onChange={onChange} value={form.description}/>
                        </div>
                    </div>

                    <div className="box-body">
                        <div className="row">


                            <div className="col-xs-2">
                                <button type="submit" className="btn btn-block btn-primary" >Guardar</button>

                            </div>
                            <div className="col-xs-2">
                                <button type="button" className="btn btn-block" onClick={onCancel}>Cancelar</button>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </form>
    </div>

);

export default ExpenseProductsEdit;
