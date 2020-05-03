import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import PriceTypeForm from "./PriceTypeForm";
import PriceTypeList from "./PriceTypeList";


export default class PriceTypes extends Component {

    constructor(props){
        super(props);
        this.state = {
            pricetypes : [],
            error : null,
        }
    }

    componentDidMount() {
        axios.get('http://storeadministrator.test/price-types')
            .then(res => {
                this.setState({
                    pricetypes: res.data
                });
            })
            .catch((error) => {
                this.setState({
                    error: error
                });
            })
    }

    render(){
        return (
            <div>
                <PriceTypeForm />
                <PriceTypeList pricetypes = {this.state.pricetypes}/>
                }
            </div>
        );
    }
}

if (document.getElementById('PriceTypes')) {

    ReactDOM.render(<PriceTypes />, document.getElementById('PriceTypes'));
}
