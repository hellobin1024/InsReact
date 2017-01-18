import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router';
import '../../../css/insurancems/components/lifeDetails.css';
import Download from '../../../components/basic/Download.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');
var _val = "";
var LifeDetail=React.createClass({
    changeVal:function(type,e){
        var val = e.target.value;
        if(isNaN(val)){
            val = _val;
            alert("只能输入数字!");
        }else{
            _val = val;
            if(type=="val"){
                this.setState({"val":val});
            }else{
                this.setState({"age":val});
            }
        }
    },
    measure:function(){

        if(this.state.val!==null&&this.state.val!==undefined&&this.state.age!==null&&this.state.age!==undefined){
            if(this.state.val%this.state.insuranceQuota==0){
            var a=this.state.val/this.state.insuranceQuota;
            var sex=$('#sex option:selected').val();
            var payYears=$('#payYears option:selected').val();
            var attachPayYears=$('#attachPayYears option:selected').val();

            var url="/insurance/insuranceReactPageDataRequest.do";
            var params={
                reactPageName:'insuranceLifeProductCenterPage',
                reactActionName:'getMeasure',
                productId:this.state.productId,
                val:a,
                age:this.state.age,
                sex:sex,
                payYears:payYears,
                attachPayYears:attachPayYears//暂时未用
            };
            ProxyQ.queryHandle(
                'post',
                url,
                params,
                null,
                function(ob) {
                    this.setState({"measure":ob.data});
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }else{
            alert("保额必须是"+this.state.insuranceQuota+"的整数倍");
        }}else{
            alert("被保人年龄不可为空!");
        }

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
        var insuranceQuota=null;
        insuranceQuota=this.props.insuranceQuota;
        return {
            productId:productId,
            productName:productName,
            //briefly:briefly,
            productStar:productStar,
            insuranceQuota:insuranceQuota,
            val:insuranceQuota

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
    getProductFeeInfo:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getProductFeeInfo',
            productId:this.state.productId
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
              var a=ob;
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
            var attach=this.state.attach;
            var measure=this.state.measure;
            var characteristic=data.characteristic.split(",");
            var safeGuardRange=data.insuranceLifeProduct.safeGuardRange.split(",");
            var charact=[];
            var safeGR=[];
            var stars=[];
            var attachs=[];
            var ycAttachs=[];
            var hrf=this;
            attach.map(function(item,i){
                attachs.push(
                    <p key={"attach"+i}className="bold bzfwp text"><input style={{marginRight:"2em"}} className="fjxbox" type="checkbox"/>{item.productName}</p>
                )
            });
            attach.map(function(item,i){
                ycAttachs.push(
                    <tr key={"ycAttachs"+i}>
                        <td>{item.productName}费:</td>
                        <td>{hrf.state.val*item.pureEndowmentHigh}</td>
                        <td>（主险保险费+附加险保险费）</td>
                    </tr>
                )
            });
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
            </div>
            <ul style={{height: 'auto'}}>
                <div className="proIntro">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>产品介绍</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <h4 className="lifeTitle">{this.state.productName}</h4>
                    <p>推荐星级:</p>
                    <label className="check" style={{paddingLeft:'0px'}}>
                        {stars}
                    </label>
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
                    <table style={{border:'0', cellPadding:"0", cellSpacing:"0", width: '70%',marginLeft:'15%', borderBottom: '2px solid #ccc'}}>
                        <tbody>
                        <tr>
                            <td style={{height:"37px", width:"20%"}}>被保险人年龄：</td>
                            <td width="10%">
                                <input id="insBirthday" defaultValue="" value={this.state.age} onChange={this.changeVal.bind(this,'age')} style={{width: '100px',borderRadius:'4px'}} />
                            </td>
                            <td style={{height:"37px", width:"10%"}} >性别：</td>
                            <td style={{width:"10%"}}>
                                <select id="sex" name="ebizInsuredDto.sex" style={{width: '54px'}}>
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                </select>
                            </td>
                            <td style={{height:"37px", width:"20%"}}>交费期间：</td>
                            <td style={{width:"10%"}}>
                                <select id="payYears" name="ebizOrderInsuranceDto.payYears" style={{width:'100px'}}>
                                    <option value="2">5年</option>
                                    <option value="3">10年</option>
                                    <option value="4">15年</option>
                                    <option value="5">20年</option>
                                </select>
                            </td>

                        </tr>
                        <tr>
                            <td style={{height:"37px", width:"20%"}}>附加险交费期间：</td>
                            <td style={{width:"10%"}}>
                                <select id="attachPayYears" name="ebizOrderInsuranceDto.payYears" style={{width:'100px'}}>
                                    <option value="2">5年</option>
                                    <option value="3">10年</option>
                                    <option value="4">15年</option>
                                    <option value="5">20年</option>
                                </select>
                            </td>
                            <td style={{ height:"37px"}}>保额：</td>
                            <td>
                                <input id="amt" style={{width: '100px',borderRadius:'4px'}} defaultValue="" name="title" value={this.state.val} onChange={this.changeVal.bind(this,'val')} />
                            </td>
                            <td  >
                            </td>
                            <td  >
                                <input onClick={this.measure} className="search" style={{width: '100%',height: '90%',borderRadius: '7px',background:'brown',marginBottom: '15px'}}type="button" value="利益测算" id="showGainDemo"   />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="red bold line-height35">您的保障：</div>
                    <table style={{border:'0', cellPadding:"0", cellSpacing:"0", width: '70%',marginLeft:'15%', borderBottom: '2px solid #ccc'}}>
                        <tbody>
                            <tr>
                                <td>每期缴费:</td>
                                <td>{measure}</td>
                                <td>（主险保险费+附加险保险费）</td>
                            </tr>
                            <tr>
                                <td>身故保险金:</td>
                                <td>{this.state.val}</td>
                                <td>（主险保险费+附加险保险费）</td>
                            </tr>
                            {ycAttachs}
                        </tbody>
                    </table>

                </div>
                <div className="kfjx">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>可附加险种</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="line-height35">您可以根据自己的需要选购您所需的附加产品：</div>
                    <div className="bxj ">
                        <p className="bold bzfwp text"><input style={{marginRight:"2em"}} type="checkbox" onClick={this.getProductFeeInfo}/>非意外身故保险金</p>
                        {attachs}
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

        </div>


    }
});
module.exports=LifeDetail;