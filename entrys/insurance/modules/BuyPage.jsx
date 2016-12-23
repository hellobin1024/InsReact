import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/BuyPage.css'
var ProxyQ = require('../../../components/proxy/ProxyQ');


var info={};
var cars={};
var relatives=null;

var BuyPage=React.createClass({

test:function(){
    //$(window).on('load', function () {
    //    $('#carCompany').selectpicker({
    //        //'selectedText': 'cat'
    //    });
    //});
    $(this.refs['companyButton']).remove();
    $('#carCompany').selectpicker();

},

    getInitialState: function() {
        var info='';
        for(var i=0;i<this.props.info.length;i++){
            info+=this.props.info[i]+',';
        }
        var attach=[];
        attach=this.props.attach;
        return {
            info:info,
            attach:attach,
            remove:[],
            insuranceType:[],
            typeNum:0,
            selectCarCompany:0,
            selectCar:0,
            selectRelative:0,
            load:null
        }
    },
    initialData:function(){

        window.setTimeout(function () {

            this.setState({
                company:info,
                myCar:cars,
                myRelatives:relatives

            })
        }.bind(this), 300);

    },

    getSelectCompany:function(){
        var selected=$('#carCompany').val();
        var select=selected.toString();
        this.state.selectCarCompany=select;
    },
    getSelectCar:function(){
        var selected=$('#myCar option:selected').val();
        this.state.selectCar=selected;
    },
    getSelectRelative:function(){
        var selected=$('#myRelative option:selected').val();
        this.state.selectRelative=selected;
    },
    getSelectInsuranceType:function(num,name){
        var itm=this.refs['radio'+name+num];
        var fd=false;
        this.state.insuranceType.map(function(item,i){
            if(item[0]==name){
                item[1]=itm.value;
                fd=true;
            }
        });
        if(fd==false){
            this.state.insuranceType.push([itm.name,itm.value]);
        }


    },
    updateOrderInfo:function(){
        if(this.state.insuranceType.length==this.state.typeNum){
            if(this.state.selectCar!==0||this.state.selectCarCompany!==0){
            var ref=this;
            var att=[];
            this.state.attach.map(function(item,i){
                att.push(item);
            });
            var c=[];
            att.map(function(item,i){
                for(var v=0;v<ref.state.remove.length;v++){
                    if(ref.state.remove[v]==item[0]){
                        att[i]=null;
                    }
                }
                if(att[i]!=null) {
                    c.push([item[0],item[1],null]);
                }
            });
            c.map(function(item,i){
                for(var z=0;z<ref.state.insuranceType.length;z++){
                    if(ref.state.insuranceType[z][0]==item[0]){
                        c[i][2]=ref.state.insuranceType[z][1];
                    }else{
                        c[i][2]='none';
                    }
                }
            });
            this.state.update=c;
            var b= c.join("-");
            var url="/insurance/insuranceReactPageDataRequest.do";
            var params={
                reactPageName:'insurancePersonalCenterScorePage',
                reactActionName:'createInsuranceCarOrder',
                update:b,
                carId:this.state.selectCar,
                companyId:this.state.selectCarCompany,
                insurancederId:this.state.selectRelative

            };

            ProxyQ.queryHandle(
                'post',
                url,
                params,
                null,
                function(ob) {

                }.bind(this),

                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
            }else{
                alert('您未选择公司或车辆！请选择！');
            }
        }else{
            alert('请选择产品类型！');
        }
    },
    getCarInsurancesInfo:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceCarProductCenterPage',
            reactActionName:'getInsuranceCarProductInfo',
            productName:this.state.info
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.state.data=ob.data;
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    closeItem:function(num,name){
        //$(document).ready(function(c) {
           // $('.close1').on('click', function(c){
        var ref=this;
        if(name=='车辆损失险'){
           this.state.attach.map(function(item,i){
               if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'||item[0]=='自燃损失险'
                   ||item[0]=='车损险无法找到第三方'||item[0]=='新增设备损失险'||item[0]=='发动机涉水损失险'){
                   $(ref.refs['cart-header'+i]).fadeOut('slow', function(c){
                       $( ref.refs['cart-header'+i]).remove();
                   });
                   ref.state.remove.push(item[0]);
                   if(item[0]=="玻璃单独破碎险"||item[0]=='车身划痕损失险'){
                       ref.state.typeNum=ref.state.typeNum-1;
                   }
               }
           });
        }
        else{
            if(name=='第三者责任险'){
                this.state.attach.map(function(item,i){
                if(item[0]=="车上人员责任险（乘客）"||item[0]=='车上人员责任险（驾驶员）'){
                $(ref.refs['cart-header'+i]).fadeOut('slow', function(c){
                    $( ref.refs['cart-header'+i]).remove();
                });
                    ref.state.remove.push(item[0]);
                    ref.state.typeNum=ref.state.typeNum-1;
            }
            });
            }

        }
        var item=this.refs['cart-header'+num];
        $(item).fadeOut('slow', function(c){
            $(item).remove();
            if(name=="车上人员责任险（乘客）"||name=='车上人员责任险（驾驶员）'||
                name=="玻璃单独破碎险"||name=='车身划痕损失险'||name=='第三者责任险'){
                ref.state.typeNum=ref.state.typeNum-1;
            }
        });
        this.state.remove.push(name);
        setTimeout(function(){
            var len=$('.cart-header2').length;
            if(len==0){
                ref.setState({insurance:0});
            }
        },1000);


         //   });
       // });
    },
    getMyRelative:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterScorePage',
            reactActionName:'getMyRelative'
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
               relatives=ob.data;

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getMyCar:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterScorePage',
            reactActionName:'getMyCar'
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                cars=ob.data;
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    getCarCompanies:function(){
        this.getMyRelative();
        this.getMyCar();
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceProductCenterPage',
            reactActionName:'getCarInsuranceCompany'
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                info=ob.data;
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );

    },
    render:function(){
        if(this.state.company!==null&&this.state.company!==undefined
            &&this.state.myCar!==null&&this.state.myCar!==undefined
            &&this.state.myRelatives!==null&&this.state.myRelatives!==undefined){
            var trs=[];
            var company=this.state.company;
            company.map(function(item,i){
                trs.push(
                    <option key={i} value={item.companyId}>{item.companyName}</option>
                )

            });


            var crs = [];
            var myCar=this.state.myCar;
            myCar.map(function(item,i){
                crs.push(
                    <option key={i} value={item[0]}>{item[1]}</option>
                )
            });

            var rrs=[];
            var myRelative=this.state.myRelatives;
            myRelative.map(function(item,i){
                rrs.push(
                    <option key={i} value={item.personId}>{item.perName}</option>
                )
            });
            if(this.state.data!==null&&this.state.data!==undefined){
                var lrs = [];
                var data=this.state.data;
                var ref=this;
                data.map(function (item, i) {
                    if(item.insuranceType!=null&&item.insuranceType.length!=0){
                        ref.state.typeNum=ref.state.typeNum+1;
                        var strs=item.insuranceType.split(",");
                        var nrs =[];
                        var name=item.productName;
                        strs.map(function(item,i){
                            if(item!=null&&item.length!=0){
                                nrs.push(
                                <li key={name+i} >
                                    <label className="check"  onChange={ref.getSelectInsuranceType.bind(ref,i,name)}>
                                        <input type="radio" ref={'radio'+name+i} name={name} value={item}/>
                                        <p>{item}</p>
                                    </label>
                                </li>
                            )}

                        });
                    }
                    var ath=null;
                    var nam=item.productName;
                    ref.state.attach.map(function(opt,i){
                        if(opt[0]==nam){
                            ath=opt[1];
                        }
                    });
                    if(ref.state.insurance==undefined){
                        lrs.push(

                            <div className="cart-header2" ref={"cart-header"+i} key={i}>
                                <div className="close2"  onClick={ref.closeItem.bind(this,i,item.productName)}> </div>
                                <div className="cart-sec simpleCart_shelfItem">
                                    <div className="cart-item-info">
                                        <h3><a >{item.productName}</a>
                                            <span>Pickup time:</span>
                                        </h3>
                                        <ul className="qty" ref="insuranceType">
                                            <li><p>产品类型:</p></li>
                                            {strs ? nrs :"暂无可选"}
                                        </ul>
                                        <div className="delivery">
                                            <p>附加险:</p>
                                            <span>{ath=="none" ? "无":"不计免赔"}</span>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        )
                    }else{
                        if(i==data.length-1){
                            ref.state.typeNum=0;
                            lrs.push(
                                <div className="cart-header" key={i+1}>
                                    <div className="cart-sec simpleCart_shelfItem">
                                        <div className="cart-item-info" style={{width:'100%'}}>
                                            <h3 style={{textAlign:'center'}}>
                                                <span>您没有任何选购项,请返回选够！</span>
                                            </h3>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            )
                        }

                    }

                });
            }

        }else{
            this.initialData();

        }

        return(
            <div>
                <div className="cart-items">
                    <div className="container" onLoad={this.getCarInsurancesInfo()} style={{width: '70%',left: '15%',border: '1px solid #F0F0F0',height: 'auto',borderRadius:'18px',background: 'cadetblue',boxShadow: '#666 0px 0px 10px'}}>
                        <h3 className="tittle">您的购买清单</h3>
                        <div className="sect_company"style={{height: '95px',width:'100%'}} >
                            <p style={{textAlign:'center',color: 'orangered',fontSize:'large',width: '104px',float: 'left'}}>选择公司:</p>
                                <select  style={{width:'200px'}}onLoad={this.getCarCompanies()} onChange={this.getSelectCompany}id="carCompany" name="usertype" className="selectpicker show-tick form-control" multiple data-live-search="true">
                                <option value={0}>无(请至少选择一个公司!)</option>
                                    {trs}
                                </select>
                            <input className="search" ref="companyButton"onClick={this.test} style={{marginTop:'4em', marginLeft: '-100px',cursor: 'pointer',float: 'left'}} value="点击选择！"/>
                        </div>
                        <div  className="sect_company" style={{}}>
                            <p style={{textAlign:'center',color: 'orangered',fontSize:'large',width: '158px',float:'left'}}>选择被保车辆:</p>
                            <select style={{margin:'7px',width:'176px',float:'left'}}id="myCar"  onChange={this.getSelectCar}className="buy-field required">
                                <option value={0}>无(必须选择一辆汽车!)</option>
                                {crs}
                            </select>
                            <div className="date_btn" style={{height: '28px',float:'left'}}>
                                <form style={{margin: '6px 0 22px'}}>
                                    <input className="Input" value="新增车辆"/>
                                </form>
                            </div>
                        </div>
                        <div className="insurance">
                            {lrs}
                        </div>
                        <div className="sect_company" style={{height: '60px'}}>
                            <div className="date_btn" style={{height: '28px',float:'right'}}>
                                <form style={{margin: '6px 0 22px'}}>
                                    <input  onClick={this.test}className="Input" value="新增人员"/>
                                </form>
                            </div>
                            <select  onChange={this.getSelectRelative}style={{margin:'7px',float:'right',width:'120px'}}id="myRelative" className="buy-field required">
                                <option value={0}>自己</option>
                                {rrs}
                            </select>
                            <p style={{textAlign:'center',color: 'orangered',fontSize:'large',width: '158px',float: 'right'}}>选择被保险人:</p>
                        </div>
                        <div style={{width: '130px',height: '65px',margin: '0 auto'}}>
                            <input className="search" onClick={this.updateOrderInfo} style={{marginTop:'0em',cursor:'pointer'}} value="提交订单"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

module.exports=BuyPage;