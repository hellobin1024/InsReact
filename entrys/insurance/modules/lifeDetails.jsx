import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router';
import '../../../css/insurancems/components/lifeDetails.css';
import Download from '../../../components/basic/Download.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');

var LifeDetail=React.createClass({
    Branch:function(url) {

        //if (this.state.session != true) {
        //    var loginModal = this.refs['loginModal'];
        //    $(loginModal).modal('show');
        //} else {
        if(this.props.Branch!==undefined&&this.props.Branch!==null)

        {
            var successModal = this.refs['successModal'];
            $(successModal).modal('hide');
            this.props.Branch(url);
            //var state = store.get('loginState');

        }
        //}

    },
    modelHtml:function(data){
        var exam = document.getElementById("example");
        exam.innerHTML += data.example;
        var zr = document.getElementById("zrmc");
        zr.innerHTML +=data.liabilityExemption;
        var bz =document.getElementById("bzzr");
        bz.innerHTML +=data.safeGuardResponsibility;
        var sh =document.getElementById("shfw");
        sh.innerHTML +=data.afterService;
    },

getInitialState: function() {
        var productId=null;
        productId=this.props.productId;
        var productName=null;
        productName=this.props.productName;
        //var briefly=null;
        //briefly=this.props.briefly;
        var productStar=null;
        productStar=this.props.productStar;
        return {
            productId:productId,
            productName:productName,
            //briefly:briefly,
            productStar:productStar,
        }
    },
    initialData:function(){

        window.setTimeout(function () {

            this.getLifeBrief();
        }.bind(this), 300);

    },

    getLifeBrief:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getLifeBrief',
            productId:this.state.productId
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data,
                attach:ob.attach,
                image:ob.image});
                this.modelHtml(ob.data[0]);
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    render:function(){
        if(this.state.data!==undefined&&this.state.data!==null){
            var data=this.state.data[0];
            var risk=data.risk;
            var fitPeople=data.insuranceLifeProduct.fitPeople;
            var clauseId=data.insuranceLifeProduct.clauseAttachId;
            var clauseName=data.insuranceLifeProduct.productName;
            var paymentPeriod=data.paymentPeriod;
            var safeGuardPeriod=data.safeGuardPeriod;
            var paymentType=data.paymentType;
            var image=this.state.image;
            var attach=this.state.attach[0].productName;
            var characteristic=data.characteristic.split(",");
            var safeGuardRange=data.insuranceLifeProduct.safeGuardRange.split(",");
            var charact=[];
            var safeGR=[];
            var stars=[];
            characteristic.map(function(item,i){
                charact.push(
                    <li key={i}>{item}</li>
                )
            });
            safeGuardRange.map(function(item,i){
                safeGR.push(
                    <li key={i}>{item}</li>
                )
            });
            for(var s=0;s<this.state.productStar;s++) {
                stars.push(
                    <span key={"star"+s}className="glyphicon glyphicon-star"></span>
                )
            }



        }else{
            this.initialData();
        }


        return <div className="basic" style={{width:'98%'}}>
            <div className="business">
                <h2>产品详情</h2>
            </div>
            <div className="value">
                <p>推荐星级:</p>
                <label className="check" style={{paddingLeft:'0px'}}>
                    {stars}
                </label>
            </div>
            <ul style={{height: 'auto'}}>
                <div className="proIntro">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>产品介绍</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <h4 className="lifeTitle">{this.state.productName}</h4>
                    <div className="risk">
                        <span>风险提示：{risk}</span>
                    </div>
                    <div className="productIntro">
                        <div className="proleft">
                            <img  style={{height: '392px'}}src={image}/>

                        </div>
                        <div className="proright">
                            <div className="line-height25"><span className="bold">适用人群:</span>{fitPeople}</div>
                            <div className="line-height25"><span className="bold">交费期:</span> {paymentPeriod}</div>
                            <div className="line-height25"><span className="bold">保障期:</span> {safeGuardPeriod}</div>
                            <div className="line-height25"><span className="bold">交费方式:</span> {paymentType}</div>
                            <div className="pro_tese">
                                <dl>
                                    <dt>产品特色：</dt>
                                    <dd>
                                        <ul>
                                            {charact}
                                        </ul>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>保障范围：</dt>
                                    <dd>
                                        <ul>
                                            {safeGR}
                                        </ul>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="lyys">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>利益测算</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                </div>
                <div className="kfjx">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>可附加险种</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="line-height35">您可以根据自己的需要选购您所需的附加产品：</div>
                    <div className="bxj ">
                        <p className="bold bzfwp text"><input style={{marginRight:"2em"}} type="checkbox" />非意外身故保险金</p>
                        <p className="bold bzfwp text"><input style={{marginRight:"2em"}} className="fjxbox" type="checkbox"/>{attach}</p>
                    </div>
                </div>
                <div className="bzfw">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>保障范围</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="bznr">
                        <div className="line-height35">在本合同有效期内，我们承担如下保险责任：</div>
                        <div className="red bold line-height35">保障责任：</div>
                        <div className="bxj " id="bzzr">

                        </div>
                        <div className="red bold line-height35">责任免除：</div>
                        <div className="bxj" id="zrmc"></div>
                        <div className="bxj line-height35"><p className="line-height25 text" style={{float:'left'}}>具体保障责任以《</p><Download attachId={clauseId} children={clauseName}/><p className="line-height25 text" style={{float:'left'}}>》条款为准。</p></div>


                    </div>
                </div>
                <div className="jlsm">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>举例说明</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="lizi" id="example"></div>

                </div>
                <div className="shfw">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>售后服务</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="shfw_dl">
                        <div className="bjx" id="shfw"></div>
                    </div>

                </div>
            </ul>
            <div onClick={this.Branch.bind(this,undefined)} style={{cursor: 'pointer',position:'fixed',bottom:'15%',zIndex:9999,width: '140px',height: '150px',right: '30px',background: 'url('+App.getResourceDeployPrefix()+'/images/edit-undo.png) no-repeat',backgroundSize:'100%'}}>
                 <p style={{marginTop:'8em'}}>返回寿险产品中心</p>
            </div>
        </div>


    }
});
module.exports=LifeDetail;