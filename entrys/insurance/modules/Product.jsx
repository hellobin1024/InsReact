import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/Product.css';
import LifeInsurance from'../modules/lifeInsurance.jsx';
import CarInsurance from'../modules/CarInsurance.jsx';


var ProxyQ = require('../../../components/proxy/ProxyQ');

var Product=React.createClass({
    getInitialState: function() {
        return {

            nav:undefined
        }
    },
    goToOthers:function(branch){
        //if (this.state.session != true) {
        //    var loginModal = this.refs['loginModal'];
        //    $(loginModal).modal('show');
        //} else {
            this.setState({
                nav: branch,
            });
        //}
    },
    render:function(){

    var container=null;
        switch (this.state.nav) {
            case 'lifeInsurance':
                container=<LifeInsurance/>;
                break;
            case 'carInsurance':
                container=<CarInsurance/>;
                break;
            case undefined:
                container=
                    <div >

                            <div className="container" style={{background: 'url(images/background.png) no-repeat',backgroundSize:'100%'}} >
                                <div className="row" style={{marginTop: '25%'}}>
                                    <div className="col-md-6">
                                        <a onClick={this.goToOthers.bind(this,'lifeInsurance')} className="featured-grid" style={{border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_6.png)'}}>
                                            <div className="desc">
                                                <h3>寿险</h3>
                                                <span>Web Design</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-md-6">
                                        <a onClick={this.goToOthers.bind(this,'carInsurance')} className="featured-grid featured-grid-2" style={{border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_2.png)'}}>
                                            <div className="desc">
                                                <h3>车险</h3>
                                                <span>Application</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>;
                break;
            default :
                break;
        }
        return container;
    }
});
module.exports=Product;