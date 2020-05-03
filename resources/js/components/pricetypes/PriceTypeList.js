import React, {Component} from 'react';

const PriceTypeList = ({pricetypes, onClick, onClickEdit}) => (



            <div className="col-md-12">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Tipos de precios</h3>
                    </div>

                    <div className="box-body col-md-offset-3 col-md-6">
                        <table className="table table-bordered">
                            <thead>

                            <tr>
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pricetypes.map((pricetype) => (
                                <tr key={pricetype.id}>
                                    <td className="text-center">{pricetype.name}</td>
                                    <td className="text-center"><span
                                        className={pricetype.status ? 'badge bg-green' : 'badge bg-red'}>{pricetype.status ? 'Activo' : 'Inactivo'}</span>
                                    </td>
                                    <td className="text-center"><a href="#" className="btn btn-primary" onClick={() => onClickEdit(pricetype.id)}><i
                                        className="fa fa-edit" ></i></a> <a
                                        href="#" className="btn btn-danger" onClick={() => onClick(pricetype.id)}><i
                                        className="fa fa-times"></i></a></td>

                                </tr>
                            ))}

                            </tbody>

                        </table>
                    </div>

                    <div className="box-footer clearfix">

                    </div>
                </div>

            </div>
        )


export default PriceTypeList;

