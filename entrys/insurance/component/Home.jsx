/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';
import HomePage from '../component/HomePage.jsx';
import Footer from '../component/Footer.jsx';

var Home=React.createClass({
    render:function(){
        return(
            <div className='container'
                 style={{paddingLeft:'0px',background:'url('+App.getResourceDeployPrefix()+'/images/background.png) no-repeat',backgroundSize:'100%'}}>
                <div className="in-container">
                    <HomePage />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </div>
        )
    }
});
module.exports=Home;



