import React from "react";


const convertNumber = (value) =>{

    var response =  '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')


    return response;
};

const CashboxCounter = ({handleSubmit, cashbox_form, handleUpdateForm, total, buttonText, text, show_button}) => (

    <>
        <form id="" action="/" method="" onSubmit={handleSubmit}>

            <div className="box box-success">
                <div className="box-header with-border">
                    <h3 className="box-title">{text}</h3>
                </div>
                <div className="box-body">
                    <div className="">

                        <table className="table table-bordered">
                            <thead>

                            <tr>
                                <th className="text-center">Billete/Moneda</th>
                                <th className="text-center">Cantidad</th>
                                <th className="text-center">Total</th>

                            </tr>
                            </thead>
                            <tbody>
                            {cashbox_form.map((currency) => (
                                <tr key={currency.id}>
                                    <td className="text-center">{convertNumber(Math.round(currency.value))}</td>
                                    <td className="text-center"> <input type="number" name={currency.id} className="form-control currency-input" placeholder="Cantidad"
                                                                        onChange={handleUpdateForm} value={currency.quantity}/></td>
                                    <td className="text-center">{convertNumber(Math.round(currency.total))}</td>
                                </tr>
                            ))}
                            <tr><td></td><td className="text-center">TOTAL</td><td className="text-center">{convertNumber(Math.round(total))}</td></tr>

                            </tbody>

                        </table>

                    </div>
                    {show_button ?
                        <div className="col-xs-4">
                            <button type="submit" className="btn btn-block btn-primary">{buttonText}</button>
                        </div>
                        : null}


                </div>


            </div>
        </form>
    </>
);

export default CashboxCounter;

