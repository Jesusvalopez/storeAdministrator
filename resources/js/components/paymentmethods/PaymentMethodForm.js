import React from 'react';

const PaymentMethodForm = ({form, onChange, onSubmit}) => (

    <div className="col-md-12">
        <form action="/payment-methods/" method="POST" onSubmit={onSubmit}>

            <div className="box box-success">
                <div className="box-header with-border">
                    <h3 className="box-title">Nuevo medio de pago</h3>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-3">
                            <input type="text" name="name" className="form-control" placeholder="Nombre del medio de pago" value={form.name}
                                   onChange={onChange}/>
                        </div>
                        <div className="col-xs-3">
                            <input type="text" name="comission" className="form-control" placeholder="Comisión del medio de pago" value={form.comission}
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

export default PaymentMethodForm;

