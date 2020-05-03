import React from 'react';

const PriceTypeEdit = ({form, onCancel, onChange, options, onSubmit}) => (



    <div className="col-md-12">
        <form action={"/price-types/"+form.editId} method="PUT" onSubmit={onSubmit}>

            <div className="box box-info">
                <div className="box-header with-border">
                    <h3 className="box-title">Editar tipo de precio</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-3">
                            <input type="text" name="name" className="form-control" placeholder="Rappi, Pedidos Ya, Local, etc" value={form.name} onChange={onChange}
                                  />
                        </div>
                        <div className="col-xs-2">
                            <select name="status"  className="form-control" value={form.status} onChange={onChange}>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value} >{option.label}</option>
                                ))}

                            </select>
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

export default PriceTypeEdit;
