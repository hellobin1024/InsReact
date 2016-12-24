/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import { render } from 'react-dom';
import Footer from '../component/Footer.jsx';

var App=React.createClass({
    render:function(){
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
});
module.exports=App;



