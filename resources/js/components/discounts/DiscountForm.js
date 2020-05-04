import React from 'react';

const DiscountForm = ({form, onChange, onSubmit}) => (

    <div className="col-md-12">
        <form action="/discounts/" method="POST" onSubmit={onSubmit}>

            <div className="box box-success">
                <div className="box-header with-border">
                    <h3 className="box-title">Nuevo descuento</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-3">
                            <input type="text" name="name" className="form-control" placeholder="Nombre del descuento" value={form.name}
                                   onChange={onChange}/>
                        </div>
                        <div className="col-xs-3">
                            <input type="text" name="quantity" className="form-control" placeholder="Cantidad del descuento" value={form.quantity}
                                   onChange={onChange}/>
                        </div>
                        <div className="col-xs-2">
                            <button type="submit" className="btn btn-block btn-primary" >Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

);

export default DiscountForm;

