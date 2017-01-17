import React from 'react';
import {render} from 'react-dom';
import BuyPage from'../modules/BuyPage.jsx'

var ProxyQ = require('../../../components/proxy/ProxyQ');
var info={};

var CarInsurance=React.createClass({
    getInitialState: function() {
        return {
            proNum:1,
            buyName:[],
            buyCheck:[]
        }
    },
    goToOthers:function(branch){

        if(this.state.buyName!=null&&this.state.buyName!=undefined&&this.state.buyName.length!=0){
        //    this.setState({
        //    nav: branch
        //});
            alert("该部分功能暂未开放！");
        }else{
            alert("您还没有选购商品！");
        }

    },
    changeBuyState:function(num,productName) {
        var step =null;
        var items = this.refs[num];
        if(productName=='玻璃单独破碎险'||productName=='车身划痕损失险'||productName=='自燃损失险'
        ||productName=='车损险无法找到第三方'||productName=='新增设备损失险'||productName=='发动机涉水损失险'){
            if(this.state.buyName.length!=0){
                this.state.buyName.map(function(item,i){
                if(item=="车辆损失险"){
                    step=true;
                }
            });
                if(step!=true){
                    alert("此险种不可单独购买！请先购买“车损险”，谢谢！");
                }
            }else{
                alert("此险种不可单独购买！请先购买“车损险”，谢谢！");
            }

        }else{
                if(productName=='车上人员责任险（乘客）'||productName=='车上人员责任险（驾驶员）')
            {
                if(this.state.buyName.length!=0) {
                    this.state.buyName.map(function (item, i) {
                        if (item == "第三者责任险") {
                            step = true;
                        }
                    });
                    if(step!=true){
                        alert("此险种不可单独购买！请先购买“第三者责任险”，谢谢！");
                    }
                }else{
                    alert("此险种不可单独购买！请先购买“第三者责任险”，谢谢！");
                }
                }
            else{
                    step=true;
                }
            }
        if(step==true){
            //购买项
            if(this.state.buyName.length==0){
                this.state.buyName.push(productName);
            }else{
                var q=this.state.buyName;
                var ref=this;
                var op=false;
                var c=[];
                q.map(function(item,i){
                    if(item==productName) {
                        if(productName=='车辆损失险'){
                            q.map(function(item,i){
                                if(item=="玻璃单独破碎险"||item=='车身划痕损失险'||item=='自燃损失险'
                                ||item=='车损险无法找到第三方'||item=='新增设备损失险'||item=='发动机涉水损失险'){
                                    q[i]=null;
                                }
                            });
                        }else{if(productName=='第三者责任险'){
                            q.map(function(item,i){
                                if(item=="车上人员责任险（乘客）"||item=='车上人员责任险（驾驶员）'){
                                    q[i]=null;
                                }
                            });
                        }}
                        q[i]=null;
                        op=true;
                    }else{
                        if(op==false){
                            if(i==ref.state.buyName.length-1){
                                q.push(productName);
                            }
                        }
                    }
                });
                q.map(function(item,i){
                    if(item!=null) {
                        c.push(item);
                    }
                });
                this.state.buyName=c;
            }
            //购买项的不计免赔项
            if(this.state.buyCheck.length==0){
                if($(items).find(attach)[0]!=undefined){
                    var check=$(items).find(attach)[0].checked;
                    this.state.buyCheck.push([productName,check,num]);
                }else{
                    this.state.buyCheck.push([productName,'none',num]);
                }
            }else {
                var p = this.state.buyCheck;
                var a = $(items).find(attach)[0];
                var b =[];
                var operate=false;
                p.map(function (item,i) {
                    if(item[0]==productName){
                        if(productName=='车辆损失险'){
                            p.map(function(item,i){
                                if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'||item[0]=='自燃损失险'
                                    ||item[0]=='车损险无法找到第三方'||item[0]=='新增设备损失险'||item[0]=='发动机涉水损失险'){
                                    p[i][1]=null;
                                    $(ref.refs[p[i][2]]).attr("style", "");
                                    $(ref.refs[p[i][2]]).attr("value","0");
                                    ref.setState({proNum:ref.state.proNum-1});
                                }
                            });
                        }else{if(productName=='第三者责任险'){
                            p.map(function(item,i){
                                if(item[0]=="车上人员责任险（乘客）"||item[0]=='车上人员责任险（驾驶员）'){
                                    p[i][1]=null;
                                    $(ref.refs[p[i][2]]).attr("style", "");
                                    $(ref.refs[p[i][2]]).attr("value","0");
                                    ref.setState({proNum:ref.state.proNum-1});
                                }
                            });
                        }}
                        p[i]=null;
                        operate=true;
                    }else{
                        if(operate==false){
                            if(i==ref.state.buyCheck.length-1){
                                if(a!=undefined){
                                    var check=a.checked;
                                    p.push([productName,check,num]);
                                }else{
                                    p.push([productName,'none',num]);
                                }
                            }
                        }
                    }
                });
                p.map(function(item,i){
                    if(item!=null&&item[1]!=null) {
                        b.push(item);
                    }
                });
                this.state.buyCheck=b;
            }

            var val=$(items).attr("value");
            if(val=='0'){
                $(items).attr("style", "background:url(images/sign-check-icon.png)  no-repeat 6em -12em");
                $(items).attr("value","1");
                //this.setState({proNum:this.state.proNum+1});
            }else{
                $(items).attr("style", "");
                $(items).attr("value","0");
                //this.setState({proNum:this.state.proNum-1});
            }
            this.setState({proNum: this.state.buyName.length});
        }

    },
    //changeCheckbox:function(num){
    //    var item = this.refs[num*100];
    //    var state = item.checked;
    //    if(state==false){
    //        $(item).removeAttr('checked');
    //        $(item).prop('checked',false);
    //    }
    //    else{
    //        $(item).removeAttr('checked');
    //       $(item).prop('checked',true);
    //    }
    //},
    initialData:function(){

        window.setTimeout(function () {

            this.setState({
                data:info.data
            })
        }.bind(this), 300);

    },
    getCarInsurances:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceCarProductCenterPage',
            reactActionName:'getInsuranceCarProduct',
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                info=ob;
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
        render:function() {
            var container=null;
            if(this.state.data!==undefined&&this.state.data!==null) {
                var trs = [];
                var jqx = [];
                var data = this.state.data;
                var ref=this;
                data.map(function (item, i) {
                    if(item.productName=='交强险'){
                        jqx.push(
                            <div className="basic" key={i} style={{width:'98%',background: 'none',margin:'0'}}>
                                <div className="business">
                                </div>
                                <div className="value" style={{padding: '3px 0',background:'whitesmoke'}}>
                                </div>
                                <ul ref={i} value="0" style={{padding:'1em 0 1em',background: 'none',borderStyle: 'solid',borderColor: 'tan'}}>
                                    <h2 style={{color:'brown'}}>重要通告声明</h2>
                                    <li>交强险为车险基础保障险,本如若您需要在本公司购买车险产品,本公司将默认您选购交强险!您如果已在他处购买交强险,请继续您的购买,在接下订单页面中,请务必填写已购交强险订单号并自行取消订单中的交强险!谢谢合作!</li>
                                    <li><span>交强险简介:</span>{item.description}</li>
                                </ul>
                            </div>
                        )
                    }
                    else{
                        if(item.productName=='玻璃单独破碎险'||item.productName=='车损险无法找到第三方'){
                            trs.push(
                                <div className="basic" key={i} style={{marginLeft: '32px'}}>
                                    <div className="business">
                                        <h2>{item.productName}</h2>
                                        <p>{item.companyName}</p>
                                    </div>
                                    <div className="value" style={{padding: '3px 0'}}>
                                    </div>
                                    <ul ref={i} value="0"style={{padding:'1em 0 1em'}}>
                                        <li><span>简介:</span>{item.description}</li>
                                    </ul>
                                    <div className="buy-me">
                                        <a style={{cursor:'pointer'}} onClick={ref.changeBuyState.bind(this,i,item.productName)}>选择/撤销</a>
                                    </div>
                                </div>)
                        }else{
                            trs.push(
                                <div className="basic" key={i} style={{marginLeft: '32px'}}>
                                    <div className="business">
                                        <h2>{item.productName}</h2>
                                        <p>{item.companyName}</p>
                                    </div>
                                    <div className="value" style={{padding: '3px 0'}}>
                                    </div>
                                    <ul ref={i} value="0"style={{padding:'1em 0 1em'}}>
                                        <li><span>简介:</span>{item.description}</li>
                                        <li style={{ height: '35px'}}>
                                            <div className="hotel-price">
                                                <label className="check" style={{paddingLeft:'0'}}>
                                                    <input id="attach" type="checkbox"  defaultChecked={true}/>
                                                    <span className="p-day-grid">不计免赔</span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="buy-me">
                                        <a style={{cursor:'pointer'}} onClick={ref.changeBuyState.bind(this,i,item.productName)}>选择/撤销</a>
                                    </div>
                                </div>
                            )
                        }

                    }
                });
            }else{
                this.initialData();
            }
            switch (this.state.nav) {
                case 'buy':
                    container=<BuyPage info={this.state.buyName} attach={this.state.buyCheck}/>;
                    break;
                case undefined:
                    container=
                        <div>
                            <div className="carBanner" onLoad={this.getCarInsurances()}>
                            </div>
                            <div className="banner-bottom" >
                                <div className="container"style={{background: 'url(images/backgroundBigPicture.png) no-repeat',backgroundSize: '100%',padding:'0 7em'}}>
                                    <div className="faqs-top-grids">
                                        <div className=" product-left">
                                            <div className="product-grids" style={{position: 'relative'}}>
                                                <hr/>

                                                {jqx}
                                                <hr style={{marginTop: '20em'}}/>
                                            </div>
                                            <div className="product-grids" style={{background: 'url(images/backgroundBigPicture.png) no-repeat',backgroundSize: '100%',position: 'absolute',top:'24em',left:'0',padding:'0 7em 8em 7em'}}>

                                                {trs}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{position:'fixed',bottom:'45px',width:'100%',zIndex:9999,backgroundColor:'oldlace',height:'5em'}}>
                                <div className="col-md-10 " style={{marginTop: '1em'}}>
                                    <span style={{color: 'darksalmon',fontSize: 'large',paddingLeft: '1em'}}>您一共选购了 <a>{this.state.proNum}</a> 项产品,点击右侧 "购买" 以继续订单 --></span>
                                </div>
                                <div className="col-md-2" >
                                    <input className="search" onClick={this.goToOthers.bind(this,'buy')} style={{marginTop:'1em',cursor:'pointer'}} value="购买"/>
                                </div>
                            </div>

                        </div>;

                default :
                    break;
            }
            return container;
        }
    });
module.exports=CarInsurance;
