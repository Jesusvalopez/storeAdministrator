import React, {Component} from 'react';

const PaymentMethodList = ({payment_methods, onClick, onClickEdit}) => (



    <div className="col-md-12">
        <div className="box">
            <div className="box-header with-border">
                <h3 className="box-title">Medio de pago</h3>
            </div>

            <div className="box-body col-md-offset-3 col-md-6">
                <table className="table table-bordered">
                    <thead>

                    <tr>
                        <th className="text-center">Nombre</th>
                        <th className="text-center">Comisión</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payment_methods.map((payment_method) => (
                        <tr key={payment_method.id}>
                            <td className="text-center">{payment_method.name}</td>
                            <td className="text-center">{payment_method.comission}%
                            </td>
                            <td className="text-center"><a href="#" className="btn btn-primary" onClick={() => onClickEdit(payment_method.id)}><i
                                className="fa fa-edit" ></i></a> <a
                                href="#" className="btn btn-danger" onClick={() => onClick(payment_method.id)}><i
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


export default PaymentMethodList;

