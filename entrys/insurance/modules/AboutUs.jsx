/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';

import Footer from '../../insurance/component/Footer.jsx'
var AboutUs=React.createClass({
    onClick:function(ob){

    },
    render:function(){

        return(

            <div className="about" style={{background:'#CCCCCC'}}>
                <div style={{width:'100%'}}>
                    <div className="about-text">
                        <p style={{textAlign:'center',fontSize:'2.5em'}}>
                            关于我们
                        </p>
                    </div>
                    <div style={{position:'fixed',bottom:'0',width:'100%',textAlign:'center'}}>
                        <img src={App.getResourceDeployPrefix()+"/images/aboutUs_01.png"} style={{background:'no-repeat',backgroundSize:'100%',width:'100%'}}/>
                    </div>

                    <div style={{position:'fixed',top:'104px',left:'25%',width:'50%',height:'50%'}}>
                        <img src={App.getResourceDeployPrefix()+"/images/aboutUs_06.png"} style={{background:'no-repeat',backgroundSize:'100%',width:'100%'}}/>
                        <div style={{position:'absolute',width:'71%',height:'100%',zIndex:'2',left:'15%',top:'8%',fontSize:'1.2em',color:'#fff'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            捷惠保：立足于客户立场，深度发掘客户需求，客观分析，在众多保险产品中为客户选择适合的产品；与保险主体公司深度合作，依据已有客户需求研发更多，保障全，保费低的优质产品；为客户提供咨询，理赔，资料代管，车驾管服务等与保险相关的一站式服务
                        </div>
                    </div>
                </div>
                <div className="footer"
                     style={{background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%',
                        position:'fixed',bottom:'0',width:'100%',height:'8%'}}>
                    <Footer/>
                </div>
            </div>
        );
    }
});
module.exports=AboutUs;
/**
 * Created by douxiaobin on 2016/10/27.
 */
