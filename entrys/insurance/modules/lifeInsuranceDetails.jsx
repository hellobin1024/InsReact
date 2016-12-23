import React from 'react';
import {render} from 'react-dom';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var LifeInsuranceDetail=React.createClass({
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
    getInitialState: function() {
        var productId=null;
        productId=this.props.productId;
        var productName=null;
        productName=this.props.productName;
        var briefly=null;
        briefly=this.props.briefly;
        var productStar=null;
        productStar=this.props.productStar;
        return {
            productId:productId,
            productName:productName,
            briefly:briefly,
            productStar:productStar
        }
    },
    initialData:function(){

        window.setTimeout(function () {

            this.getProductFeeInfo();
        }.bind(this), 300);

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
                this.setState({data:ob});
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    render:function(){
        if(this.state.data!==undefined&&this.state.data!==null){
            var feeYear=this.state.data.feeYearType;
            var insuranceDuringType=this.state.data.insuranceDuringType[0].label;
            var info=this.state.data.info;
            var trs=[];
            var wd=40/feeYear.length;
            var width=wd.toString()+"%";
            feeYear.map(function(item,i){
                trs.push(
                    <div key={i} style={{border: '1px',borderStyle:' solid',width:width,float:'left'}}>
                        {item.label}
                    </div>
                )
            });
            var age=[];
            var len=feeYear.length*2;
            info.map(function(item,i){
                if(i%len==0) {
                    age.push(
                        <div key={i+'age'} style={{border: '1px',borderStyle:' solid',width: '20%',float:'left'}}>
                            {item.age}
                        </div>
                    );
                }
                age.push(
                    <div key={i+'fee'} style={{border: '1px',borderStyle:' solid',width:width,float:'left'}}>
                        {item.insuranceFee}
                    </div>
                );

            });
            var star=this.state.productStar;
            var stars=[];
            for(var s=0;s<star;s++){
                stars.push(
                    <span key={s+'star'} className="glyphicon glyphicon-star" ></span>
                )
            }
        }else{
            this.initialData();
        }


        return (
            <div className="basic" style={{width:'98%'}}>
            <div className="business">
                <h2>产品介绍</h2>
            </div>
            <div className="value">
                <p>推荐星级:</p>
                <label className="check" style={{paddingLeft:'0px'}}>
                    {stars}
                </label>
            </div>
            <ul style={{height: 'auto'}}>
                <li className="item clearfix">
                    <div>
                        <h2>{this.state.productName}</h2>
                        <h4 style={{marginTop:'1em'}}>
                            <p>保障期限:</p>
                            <span>{insuranceDuringType}</span>
                        </h4>
                        <h4 style={{marginTop:'2em'}}>
                            <p>保险简介:</p>
                            <span>{this.state.briefly}</span>
                        </h4>
                    </div>
                </li>
                <li className="item clearfix">
                    <div>
                        <p>保险缴费对照表：</p>
                    </div>
                    <div style={{border: '1px',borderStyle:' solid',width: '20%',float:'left',height:'90px'}}>
                       <p style={{marginTop:'10%'}}> 年龄</p>
                    </div>
                    <div style={{border: '1px',borderStyle:' solid',width: '80%',float:'left'}}>
                        缴费年限
                    </div>
                    <div style={{border: '1px',borderStyle:' solid',width: '40%',float:'left'}}>
                        男
                    </div>
                    <div style={{border: '1px',borderStyle:' solid',width: '40%',float:'left'}}>
                        女
                    </div>
                    {trs}
                    {trs}
                    {age}
                </li>
            </ul>
            <div className="buy-me">
                <a onClick={this.Branch.bind(this,undefined)}>return</a>
            </div>
        </div>
        );
    }

});
module.exports=LifeInsuranceDetail;