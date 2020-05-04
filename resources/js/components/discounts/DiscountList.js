import React, {Component} from 'react';

const DiscountList = ({discounts, onClick, onClickEdit}) => (



    <div className="col-md-12">
        <div className="box">
            <div className="box-header with-border">
                <h3 className="box-title">Descuentos</h3>
            </div>

            <div className="box-body col-md-offset-3 col-md-6">
                <table className="table table-bordered">
                    <thead>

                    <tr>
                        <th className="text-center">Nombre</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {discounts.map((discount) => (
                        <tr key={discount.id}>
                            <td className="text-center">{discount.name}</td>
                            <td className="text-center">{discount.quantity}%
                            </td>
                            <td className="text-center"><a href="#" className="btn btn-primary" onClick={() => onClickEdit(discount.id)}><i
                                className="fa fa-edit" ></i></a> <a
                                href="#" className="btn btn-danger" onClick={() => onClick(discount.id)}><i
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


export default DiscountList;

