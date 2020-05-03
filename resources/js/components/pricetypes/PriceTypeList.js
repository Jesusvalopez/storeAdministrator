import React from 'react';

const PriceTypeList = ({pricetypes}) => (

    <div className="col-md-12">
        <div className="box">
            <div className="box-header with-border">
                <h3 className="box-title">Tipos de precios</h3>
            </div>

            <div className="box-body">
                <table className="table table-bordered">
                    <thead>

                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pricetypes.map((pricetype) => (
                        <tr key={pricetype.id}>
                            <td>{pricetype.name}</td>
                            <td><span className={pricetype.status ? 'badge bg-green' : 'badge bg-red' }>{pricetype.status ? 'Activo' : 'Inactivo' }</span></td>
                            <td></td>

                        </tr>
                    ))}

                    </tbody>

                </table>
            </div>

            <div className="box-footer clearfix">
                <ul className="pagination pagination-sm no-margin pull-right">
                    <li><a href="#">&laquo;</a></li>
                    <li><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">&raquo;</a></li>
                </ul>
            </div>
        </div>

    </div>

);

export default PriceTypeList;

