import React from 'react';

const DiscountEdit = ({form, onCancel, onChange, options, onSubmit}) => (



    <div className="col-md-12">
        <form action={"/discounts/"+form.editId} method="PUT" onSubmit={onSubmit}>

            <div className="box box-info">
                <div className="box-header with-border">
                    <h3 className="box-title">Editar descuento</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-3">
                            <input type="text" name="name" className="form-control" placeholder="Nombre del descuento" value={form.name} onChange={onChange}
                            />
                        </div>
                        <div className="col-xs-3">
                            <input type="text" name="quantity" className="form-control" placeholder="Cantidad de descuento" value={form.quantity} onChange={onChange}
                            />
                        </div>
                        <div className="col-xs-2">
                            <button type="submit" className="btn btn-block btn-primary" >Guardar</button>

                        </div>
                        <div className="col-xs-2">
                            <button type="button" className="btn btn-block" onClick={onCancel}>Cancelar</button>

                        </div>

                    </div>
                </div>
            </div>
        </form>
    </div>

);

export default DiscountEdit;
