import React from 'react';

const PriceTypeForm = () => (

        <div className="col-md-12">
            <form action="/price-types/" method="POST">

                <div className="box box-success">
                    <div className="box-header with-border">
                        <h3 className="box-title">Nuevo tipo de precio</h3>
                    </div>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-xs-3">
                                <input type="text" className="form-control" placeholder="Rappi, Pedidos Ya, Local, etc"/>
                            </div>
                            <div className="col-xs-2">
                                <button type="submit" className="btn btn-block btn-primary">Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

);

export default PriceTypeForm;

