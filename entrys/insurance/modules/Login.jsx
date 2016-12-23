/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/Login.css';


var Login=React.createClass({

    render:function(){

        let content=null;
        return (
            <div className='Login' ref='login'>
                {content}
            </div>);
    }
});
module.exports=Login;
