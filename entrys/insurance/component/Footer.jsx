/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/homepage.css';

var Footer=React.createClass({
    onClick:function(ob){

    },
    render:function(){

        return(
            <div className="footer"
                style={{width:'100%',height:'15%',background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%'}}>
                <p className="bottom" style={{color:'#fff',marginTop:'20px',textAlign:'center'}}>
                    欢迎来到捷惠宝
                </p>
            </div>
        );
    }
});
module.exports=Footer;
/**
 * Created by douxiaobin on 2016/10/27.
 */
