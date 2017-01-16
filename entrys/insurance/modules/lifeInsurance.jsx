import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import '../../../css/insurancems/components/lifeInsurance.css';
import Detail from '../modules/lifeDetails.jsx';
import PageNavigator from './PageNavigator';
var Page = require('../../../components/page/Page');
var ProxyQ = require('../../../components/proxy/ProxyQ');

var info=null;
var LifeInsurance=React.createClass({
    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(8,capacity,pageIndex,function(ob){
                slices=data.slice(ob.begin,ob.end);
            }
        );
        return slices;
    },
    previousCb:function (index,isChange) { //向前跳页
        this.setState({pageIndex:index,isChange:isChange});
    },

    pageCb:function(index,isChange) { //进入指定页的列表
        this.setState({pageIndex:index,isChange:isChange});
    },
    nextCb:function(index,isChange){ //向后跳页,isChange为true
        this.setState({pageIndex:index,isChange:isChange});
    },
    Branch:function(branch){
        this.setState({nav: branch});

    },
    getInitialState: function() {
        return {
            InputCompany:null,
            InputCompanyType:null,
            InputStarLevel:null,
            InputIncrement:null,
            pageIndex:0,
            isChange:false,
        }
    },
    initialData:function(){

        window.setTimeout(function () {

            this.setState({
                company:info
            })
        }.bind(this), 300);

    },
    goToOthers:function(branch,num,name,star,briefly,quota){
        //if (this.state.session != true) {
        //    var loginModal = this.refs['loginModal'];
        //    $(loginModal).modal('show');
        //} else {
        if(num!==null){
            this.state.propProductId=num;
            this.state.propProductName=name;
            this.state.propBriefly=briefly;
            this.state.propStar=star;
            this.state.propQuota=quota;
        }
        this.setState({
            nav: branch,
        });
        //}
    },
    getInfoBySlide:function(type){
        var store=[];
        switch (type){
            case 'inputCompany':
                $("#inputCompany input:checkbox:checked").each(function (index, domEle) {
                var a=$(domEle).val();
                store.push(a);
                });
                this.state.InputCompany=store;
                break;
            case 'inputCompanyType':
                $("#inputCompanyType input:checkbox:checked").each(function (index, domEle) {
                var a=$(domEle).val();

                store.push(a);
                });
                this.state.InputCompanyType=store;
                break;
            case 'inputStarLevel':
                $("#inputStarLevel input:checkbox:checked").each(function (index, domEle) {
                var a=$(domEle).val();
                store.push(a);
                });
                this.state.InputStarLevel=store;
                break;
            case 'inputIncrement':
                var a=$("input[name='hideRegionId']:checked").val();
                this.state.InputIncrement=a;
                break;
        }
        var InputCompany=null;
        var InputCompanyType=null;
        var InputStarLevel=null;
        if(this.state.InputCompany!==null&&this.state.InputCompany.length!==0){
            InputCompany= this.state.InputCompany.join(",");
        }
        if(this.state.InputCompanyType!==null&&this.state.InputCompanyType.length!==0){
            InputCompanyType= this.state.InputCompanyType.join(",");
        }
        if(this.state.InputStarLevel!==null&&this.state.InputStarLevel.length!==0){
            InputStarLevel= this.state.InputStarLevel.join(",");
        }
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getInsuranceLifeProductListBySlide',
            InputCompany:InputCompany,
            InputCompanyType:InputCompanyType,
            InputStarLevel:InputStarLevel,
            InputIncrement:this.state.InputIncrement
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data});
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getSelectCompany:function(){
        var selected=$('#company option:selected').val();
        this.state.selectCompanyId=selected;
    },
    getSelectLifeInsuranceType:function(){
        var selected=$('#lifeInsuranceType option:selected').val();
        this.state.selectLifeInsuranceType=selected;
    },
    slidePage:function(type){
        if(type=='right'){
            var detail=this.refs.slider;
            $(detail).animate({left:'-100%'});
        }else{
            var detail=this.refs.slider;
            $(detail).animate({left:'0'}); //使页面划回到最左边
        }
    },
    onSaveInput:function(event){

        this.setState({value: event.target.value});

    },
    getCompanies:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceProductCenterPage',
            reactActionName:'getInsuranceCompany'
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
    getInsurancesList:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getInsuranceLifeProductList',
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
    getLimitInsurancesList:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getLimitInsuranceLifeProductList',
            title:this.state.value,
            company:this.state.selectCompanyId,
            insuranceType:this.state.selectLifeInsuranceType
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data});

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    render:function() {
        var container=null;
        var len=null;
        if(this.state.company!==undefined&&this.state.company!==null&&this.state.data!==undefined&&this.state.data!==null) {
            var trs = [];
            var company=this.state.company;
            company.map(function (item, i) {
                trs.push(
                    <option value={item.companyId} key={i}>{item.companyName}</option>
                )
            });
            var lrs = [];
            var test=this.state.data;
            len = test.length;
            var data = this.paginationData(test, this.state.pageIndex);
            //var data=;
            var ref=this;
            data.map(function (item, i) {
                var stars=[];
                var star=parseInt(item.productStar);
                for(var s=0;s<star;s++){
                    stars.push(
                        <span className="glyphicon glyphicon-star" ></span>
                    )
                }
                var type=null;
                switch (item.insuranceType){
                    case '1':
                        type="重疾险";
                        break;
                    case '2':
                        type="意外险";
                        break;
                    case '3':
                        type="养老险";
                        break;
                    case '4':
                        type="理财险";
                        break;
                    case '5':
                        type="医疗险";
                        break;
                }
                lrs.push(
                    <div className="basic" key={i}>
                        <div className="lifeBusiness" style={{background:'rgba(17, 17, 17, 0.6)'}}>
                            <h3>{item.productName}</h3>
                            <p>{item.companyName}</p>
                        </div>
                        <div className="value" style={{padding: '0em 0',background:'tan'}}>
                            <p>
                                {stars}
                            </p>
                        </div>
                        <ul style={{height:'130px'}}>
                            <li>保额:<span>{item.insuranceQuota}</span></li>
                            <li>险种类型:<span>{type}</span></li>
                        </ul>
                        <div className="buy-me">
                            <a onClick={ref.goToOthers.bind(this,'detail',item.productId,item.productName,item.productStar,item.briefly,item.insuranceQuota)}style={{cursor: 'pointer',borderRight:'1px',borderStyle:'outset',borderRightColor:'currentColor',background:'tan'}}>了解</a>
                        </div>

                    </div>
                    )
                });
        }else{
            this.initialData();
        }

        switch (this.state.nav) {
            case 'buy':
                break;
            case 'detail':
                //container=<Detail Branch={this.Branch} productId={this.state.propProductId} productName={this.state.propProductName} productStar={this.state.propStar} briefly={this.state.propBriefly}/>
                container=<Detail  productId={this.state.propProductId} productName={this.state.propProductName} productStar={this.state.propStar} insuranceQuota={this.state.propQuota}/>
                break;
            case undefined:
                container=
                    <div  ref="slider"  style={{position:'relative'}}>

                    <div>
                        <div className="lifeBanner" onLoad={this.getCompanies()}>
                            <div style={{padding:'0 5em 0 5em'}}>
                                <div className="col-md-8 banner-left" style={{width:'85%',paddingLeft: '8%',paddingTop:'10px'}}>
                                    <div className="reservation">
                                        <ul>
                                            <li  className="span1_of_1 desti" style={{width:'22em'}}>
                                                <h4>产品名:</h4>
                                                <div className="book_date">
                                                    <form>
                                                        <input type="text" onChange={this.onSaveInput.bind(this)} className="typeahead1 input-md form-control tt-input" required=""/>
                                                    </form>
                                                </div>
                                            </li>
                                            <li className="span1_of_1 left " style={{paddingLeft: '6em'}}>
                                                <h4>公司选择:</h4>
                                                <div className="section_room" >
                                                    <select id="company" onChange={this.getSelectCompany} className="frm-field required">
                                                        <option value="null">{"无"}</option>
                                                        {trs}
                                                    </select>
                                                </div>
                                            </li>
                                            <li className="span1_of_1 right "  >
                                                <h4>险种类型:</h4>
                                                <div className="section_room">
                                                    <select onChange={this.getSelectLifeInsuranceType}id="lifeInsuranceType" style={{width: '80px'}} className="frm-field required">
                                                        <option value="0">无</option>
                                                        <option value="1">重疾险</option>
                                                        <option value="2">意外险</option>
                                                        <option value="3">养老险</option>
                                                        <option value="4">理财险</option>
                                                        <option value="5">医疗险</option>
                                                    </select>
                                                </div>
                                            </li>
                                            <li className="span1_of_3" style={{ paddingRight: '10em',marginTop: '-5px',float:'right'}}>
                                                <div className="date_btn">
                                                    <form>
                                                        <input className="search" style={{borderRadius:'3px',height:'3em',marginTop: '11%',background:'gray'}}onClick={this.getLimitInsurancesList} value="查询" />
                                                    </form>
                                                </div>
                                            </li>
                                            <div className="clearfix"></div>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-8 banner-left" onClick={this.slidePage.bind(this,'right')} style={{width: '15%',cursor:'pointer',paddingTop:'10px'}}>
                                            <h2 style={{ color: 'darkblue'}}>定制产品</h2>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>

                            <div className="container"style={{background: 'url(images/backgroundBigPicture.png) no-repeat',backgroundSize: '100%',height:'auto'}}>
                                <div className="faqs-top-grids" style={{ padding:'1em 5em 4em 5em'}}>
                                    <div className="product-grids">
                                        <div className="col-md-3 product-left" style={{paddingTop:'15px',paddingLeft: '7em'}}>
                                            <div className="h-class" id="inputStarLevel"onClick={this.getInfoBySlide.bind(this,'inputStarLevel')}>
                                                <h4 style={{fontWeight:'bold'}}>推荐星级</h4>
                                                <div className="hotel-price" >
                                                    <label className="check">
                                                        <input type="checkbox" value="5"/>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="starTextLabel">5 星</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"  value="4"/>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="starTextLabel">4 星</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"value="3"/>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="starTextLabel">3 星</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"value="2"/>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="starTextLabel">2 星</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"value="1"/>
                                                        <span className="glyphicon glyphicon-star" ></span>
                                                        <span className="starTextLabel">1 星</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="h-class p-day" id="inputCompany" onClick={this.getInfoBySlide.bind(this,'inputCompany')} >
                                                <h4 style={{fontWeight:'bold'}}>推荐公司</h4>
                                                <div className="hotel-price">
                                                    <label className="check"  >
                                                        <input id="price1" type="checkbox"  value="8"/>
                                                        <span className="p-day-grid">中国人寿</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check" >
                                                        <input id="price2" type="checkbox" value="9"/>
                                                        <span className="p-day-grid">中国平安</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check" >
                                                        <input id="price3" type="checkbox" value="13"/>
                                                        <span className="p-day-grid">新华保险</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check" >
                                                        <input id="price4" type="checkbox" value="10"/>
                                                        <span className="p-day-grid">太平洋保险</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check" >
                                                        <input id="price5" type="checkbox" value="18"/>
                                                        <span className="p-day-grid">中国国华</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="h-class" id="inputCompanyType" onClick={this.getInfoBySlide.bind(this,'inputCompanyType')}>
                                                <h4 style={{fontWeight:'bold'}}>公司类型</h4>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox" value="1"/>
                                                        <span className="p-day-grid">中资公司</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"  value="2"/>
                                                        <span className="p-day-grid">外资公司</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="checkbox"  value="3"/>
                                                        <span className="p-day-grid">合资公司</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="h-class" id="inputIncrement" onClick={this.getInfoBySlide.bind(this,'inputIncrement')}>
                                                <h4 style={{fontWeight:'bold'}}>增值服务</h4>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="radio" name="hideRegionId"  value="all"/>
                                                        <span className="p-day-grid">全部</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="radio" name="hideRegionId"  value="1"/>
                                                        <span className="p-day-grid">有增值服务</span>
                                                    </label>
                                                </div>
                                                <div className="hotel-price">
                                                    <label className="check">
                                                        <input type="radio" name="hideRegionId"  value="0"/>
                                                        <span className="p-day-grid">无增值服务</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div onLoad={this.getInsurancesList()} className="col-md-9 product-right">

                                            <div className="container" style={{height: 'auto',paddingLeft:'0px'}}>
                                                {lrs}

                                                <div style={{float:'left',width:'100%'}}>
                                                    <PageNavigator style={{marginTop:'100%'}}
                                                        capacity={len}
                                                        threshold={5}
                                                        pageIndex={this.state.pageIndex}
                                                        pageBegin={1}
                                                        previousCb={this.previousCb}
                                                        pageCb={this.pageCb}
                                                        nextCb={this.nextCb}
                                                        isChange={this.state.isChange}
                                                        paginate={Page}
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="clearfix"> </div>
                                    </div>
                                </div>


                            </div>

                    </div>


                    <div style={{display:'inline-block',top:'0px',width:'100%',position:'absolute',left:'100%'}}className="lifeBanner">

                    </div>
                    <div className="banner-bottom" style={{display:'inline-block',top: '0em',width:'100%',position:'absolute',left:'100%'}}>
                        <div className="container" style={{height: 'auto',background: 'url(images/backgroundBigPicture.png) no-repeat',backgroundSize: '100%'}}>
                            <div className="faqs-top-grids" style={{padding:'0px'}}>
                                <div className="product-grids">
                                    <div className="basic" style={{width:'98%'}}>
                                        <div className="business">
                                            <h2>产品定制</h2>
                                            <p style={{color:'black'}}>填写如下信息，选择最适合您的产品！</p>
                                        </div>
                                        <div className="value" style={{background:'rgba(17, 17, 17, 0.6)'}}>
                                            <p>计划保费:</p>
                                            <input type="text" style={{width:'25%',height: 'auto',margin:'0 auto',textAlign:'center', fontSize:'20px'}}className="typeahead1 input-md form-control tt-input" required=""/>
                                        </div>
                                        <ul style={{height: 'auto'}}>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">投保人:</p>
                                                    <select className="selfSelect">
                                                    </select>
                                                    <div className="date_btn" style={{height: '28px',float:'left'}}>
                                                        <form>
                                                            <input className="selfInput" value="新增"/>
                                                        </form>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">被投保人:</p>
                                                    <select className="selfSelect">
                                                    </select>
                                                    <div className="date_btn" style={{height: '28px',float:'left'}}>
                                                        <form>
                                                            <input className="selfInput" value="新增"/>
                                                        </form>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">受益人:</p>
                                                    <select className="selfSelect">
                                                    </select>
                                                    <div className="date_btn" style={{height: '28px',float:'left'}}>
                                                        <form>
                                                            <input className="selfInput" value="新增"/>
                                                        </form>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">险种类型:</p>
                                                    <select className="selfSelect" style={{width: '24%'}}>
                                                        <option value="1">重疾险</option>
                                                        <option value="2">意外险</option>
                                                        <option value="3">养老险</option>
                                                        <option value="4">理财险</option>
                                                        <option value="5">医疗险</option>
                                                    </select>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">有无社保:</p>
                                                    <select className="selfSelect"style={{width: '24%'}}>
                                                        <option value="1">有</option>
                                                        <option value="0">无</option>
                                                    </select>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="self">
                                                    <p className="selfp">有无商业保险:</p>
                                                    <select className="selfSelect"style={{width: '24%'}}>
                                                        <option value="1">有</option>
                                                        <option value="0">无</option>
                                                    </select>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="buy-me">
                                            <a href="#">定制</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={this.slidePage.bind(this,'left')} style={{cursor: 'pointer',position:'absolute',top:'52em',zIndex:9999,width: '140px',height: '150px',right: '20px',background: 'url('+App.getResourceDeployPrefix()+'/images/edit-undo.png) no-repeat',backgroundSize:'100%'}}>
                        <p style={{marginTop:'8em'}}>返回寿险产品中心</p>
                    </div>
                    </div>



                </div>;
                break;
        }
        return container;
    }
});
module.exports=LifeInsurance;