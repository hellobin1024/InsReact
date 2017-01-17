/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router'
import '../../../css/insurancems/components/Business.css';
import PageNavigator from './PageNavigator.jsx';
import PersonInfo from '../modules/PersonInfo.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var Page = require('../../../components/page/Page');

var OrderCenter=React.createClass({

    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(10,capacity,pageIndex,function(ob){
            slices=data.slice(ob.begin,ob.end);
        });
        return slices;
    },

    previousCb:function (index,isChange) { //向前跳页,isChange为true(比如5,6,7,8变为1,2,3,4)
        this.setState({pageIndex:index,isChange:isChange});
    },

    pageCb:function(index,isChange) { //进入指定页的列表，isChange为false
        this.setState({pageIndex:index,isChange:isChange});
    },
    nextCb:function(index,isChange){ //向后跳页,isChange为true (比如1,2,3,4变为5,6,7,8)
        this.setState({pageIndex:index,isChange:isChange});
    },

    //积分tab
    scoreTabChange:function(tab){
        this.setState({scoreTabCurrent:tab});

        window.setTimeout(function(){
            var detail=this.refs.slider;
            $(detail).animate({left:'0'}); //使页面划回到最左边
        }.bind(this), 200) //等待500毫秒
    },

    tabChange:function(tab){

        var url="/insurance/insuranceReactPageDataRequest.do";
        switch (tab) {
            case 'carOrder':
                var params={
                    reactPageName:'insurancePersonalCenterCarOrderPage',
                    reactActionName:'getInsuranceCarOrder'
                };
                break;
            case 'score':
                var params={
                    reactPageName:'insurancePersonalCenterScorePage',
                    reactActionName:'getCustomerScore'
                };
                break;
            case 'lifeOrder':
                var params={
                    reactPageName:'insurancePersonalCenterLifeOrderPage',
                    reactActionName:'getInsuranceLifeOrder'
                };
                break;
            case 'serviceOrder':
                var params={
                    reactPageName:'insurancePersonalCenterCarServicePage',
                    reactActionName:'getInsuranceCarServiceOrder'
                };
                break;
        }

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                var re = ob.re;
                if(re!==undefined && re!==null && (re ==2 || re =="2")) { //登录信息为空或数据为空
                    return;
                }
                var data=ob.data;
                this.setState({data: data,current:tab,pageIndex:0});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );

        window.setTimeout(function(){
            var detail=this.refs.slider;
            $(detail).animate({left:'0'}); //使页面划回到最左边
        }.bind(this), 200) //等待500毫秒
    },

    slideClick:function(i,ob){
        var data=this.state.data; //所有订单数据
        var pageIndex=this.state.pageIndex; //页面索引
        var orderDetail;
        switch(this.state.current){
            case 'carOrder':
                orderDetail=data[pageIndex*10+i]; //得到点击的订单条目信息
                break;
            case 'lifeOrder':
                orderDetail=data[pageIndex*10+i]; //得到点击的订单条目信息
                break;
            case 'serviceOrder':
                orderDetail=data[pageIndex*10+i]; //得到点击的订单条目信息
                break;
            case 'score':
                switch(this.state.scoreTabCurrent){
                    case 'all':
                        var allList=data.carOrder;
                        allList = allList.concat(data.lifeOrder)
                        allList = allList.concat(data.serviceOrder)
                        orderDetail=allList[pageIndex*10+i];
                        break;
                    case 'income':
                        var incomeList=data.carOrder;
                        incomeList = incomeList.concat(data.lifeOrder)
                        orderDetail=incomeList[pageIndex*10+i];
                        break;
                    case 'used':
                        orderDetail=data.serviceOrder[pageIndex*10+i];
                        break;
                }
                break;
        }

        this.setState({orderDetail:orderDetail});
        var detail=this.refs.slider;
        $(detail).animate({left:'-100%'});
    },

    pay:function(){
        var url = this.state.url; //要跳转的url
        var serverAddress = window.document.location.host; //得到服务器主机前缀
        var uri = "http://" + serverAddress + url;
        return (<div > {window.location.assign(uri)}

        </div>)
    },

    modifyPersonInfo:function(ob){
        var customerId=ob;
        this.setState({customerId:customerId, isModify:true});
    },

    return:function(){
        var detail=this.refs.slider;
        $(detail).animate({left:'0'});
    },

    initialData:function(){

        //remote data 初次进入车险订单
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterCarOrderPage',
            reactActionName:'getInsuranceCarOrder'
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                var re = ob.re;
                if(re!==undefined && re!==null && (re ==2 || re =="2")) { //登录信息为空
                    return;
                }
                var data=ob.data;
                var personInfo=ob.personInfo;
                this.setState({data:data, personInfo:personInfo});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    getInitialState:function(){
        return ({current:'carOrder', data:null, personInfo:null, scoreTabCurrent:'all',
            pageIndex:0, orderDetail:null, isChange:false, customerId:null, isModify:false});
    },

    render:function(){

        let mainContent=null;
        let orders=[];
        let trs=[];
        let detail_trs=[]; //订单信息
        let insurer_trs=[]; //投保人信息（车险、寿险）
        let insuranceder_trs=[]; //被保险人信息（车险、寿险）
        let carInfo_trs=[]; //汽车详细（车险的）
        let product_trs=[]; //产品信息（车险的、寿险）
        let plan_trs=[] //计划书（寿险的）
        let benefiter_trs=[]; //受益人（寿险的）

        let carOrderList=null; //车险订单列表
        let lifeOrderList=null; //寿险订单列表
        let serviceOrderList=null; //服务订单列表
        let scoreList=null; //积分列表（明细，收入，支出）
        let data;
        let personInfo;
        let customerId;
        let perName="我的信息";
        let phone;
        let address;
        let postCode;

        let payment;

        if(this.state.personInfo!==undefined && this.state.personInfo!==null){
            personInfo = this.state.personInfo;
            customerId=personInfo.customerId;
            perName=personInfo.perName;
            phone=personInfo.phone;
            address=personInfo.address;
            postCode=personInfo.postCode;
        }

        var slideDetail=this.slideClick;
        var ins=this;  //用在map()函数里面，外面的this不能在里面用
        if(this.state.data!==undefined&&this.state.data!==null)
        {
            switch (this.state.current) {
                case 'carOrder':
                    carOrderList = this.state.data;
                    data = this.paginationData(this.state.data, this.state.pageIndex);
                    data.map(function (order, i) {
                        orders.push({orderNum: order.orderNum});
                        trs.push(
                            <tr key={i}>
                                <td>
                                    <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                </td>
                                <td>
                                    {order.insuranceNum}
                                </td>
                                <td>
                                    {order.productName}
                                </td>
                                <td>
                                    {order.orderDate}
                                </td>
                                <td>
                                    {order.orderStateStr}
                                </td>
                                <td>
                                    {order.companyName}
                                </td>
                                <td>
                                    {order.insuranceFeeTotal}
                                </td>
                            </tr>
                        );
                    });


                    if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                        var orderDetail = this.state.orderDetail;
                        var product = orderDetail.product;
                        var insurer = orderDetail.insurer;
                        var insuranceder = orderDetail.insuranceder;
                        var carInfo = orderDetail.carInfo;
                        var orderState = orderDetail.orderState;

                        if(orderState==1 || orderState=="1"){ //表示已报价
                            payment = "支付"
                        }

                        detail_trs.push( //订单信息
                            <tr key={0}>
                                <td>订单号：{orderDetail.orderNum}</td>
                                <td>保单号：{orderDetail.insuranceNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>申请时间：{orderDetail.applyTime}</td>
                                <td>缴费时间：{orderDetail.feeDate}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>订单时间：{orderDetail.orderDate}</td>
                                <td>保险公司：{orderDetail.companyName}</td>
                                <td>投保人perId：{orderDetail.insurerId}</td>
                                <td>被保险人perId：{orderDetail.insurancederId}</td>
                                <td>受益人perId：{orderDetail.benefiterId}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>客户：{orderDetail.customerName}</td>
                                <td>商业基准保费：{orderDetail.insuranceBusinessFee}</td>
                                <td>商业险折扣：{orderDetail.businessDiscount}</td>
                                <td>交强险基准保费：{orderDetail.insuranceCompulsoryFee}</td>
                                <td>交强险折扣：{orderDetail.compulsoryDiscount}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={3}>
                                <td>车船税：{orderDetail.carTax}</td>
                                <td>签单保费：{orderDetail.contractFee}</td>
                                <td>佣金：{orderDetail.commission}</td>
                                <td>积分：{orderDetail.score}</td>
                                <td>邮寄地址：{orderDetail.customerMailAddress}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={4}>
                                <td>邮编：{orderDetail.customerMailPostcode}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        );

                        if(product!==undefined && product!==null){
                            product.map(function (item, i) {
                                product_trs.push( //产品信息
                                    <tr key={i}>
                                        <td>产品编号：{item.productNum}</td>
                                        <td>产品名称：{item.productName}</td>
                                        <td>保额：{item.insuranceType}</td>
                                        <td>保费：{item.insuranceFeeTotal}</td>
                                        <td>车船税：{item.carTax}</td>
                                    </tr>
                                );
                            });
                        }
                        if(insurer!==undefined && insurer!==null){
                            insurer_trs.push( //投保人信息
                                <tr key={0}>
                                    <td>编号：{insurer.perNum}</td>
                                    <td>姓名：{insurer.perName}</td>
                                    <td>身份证号：{insurer.perIdCard}</td>
                                    <td>地址：{insurer.perAddress}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                        if(insuranceder!==undefined && insuranceder!==null){
                            insuranceder_trs.push( //被保险人信息
                                <tr key={0}>
                                    <td>编号：{insuranceder.perNum}</td>
                                    <td>姓名：{insuranceder.perName}</td>
                                    <td>身份证号：{insuranceder.perIdCard}</td>
                                    <td>地址：{insuranceder.perAddress}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                        if(carInfo!==undefined && carInfo!==null){
                            carInfo_trs.push( //行驶证信息
                                <tr key={0}>
                                    <td>车牌号：{carInfo.carNum}</td>
                                    <td>车辆类型：{carInfo.carType}</td>
                                    <td>使用性质：{carInfo.useType}</td>
                                    <td>车辆状态：{carInfo.carState}</td>
                                    <td>车主姓名：{carInfo.ownerName}</td>
                                </tr>
                            );
                            carInfo_trs.push(
                                <tr key={1}>
                                    <td>车主身份证号：{carInfo.ownerIdCard}</td>
                                    <td>车主地址：{carInfo.ownerAddress}</td>
                                    <td>品牌型号：{carInfo.factoryNum}</td>
                                    <td>车辆识别代码：{carInfo.frameNum}</td>
                                    <td>发动机号码：{carInfo.engineNum}</td>
                                </tr>
                            );
                            carInfo_trs.push(
                                <tr key={2}>
                                    <td>注册日期：{carInfo.firstRegisterDate}</td>
                                    <td>发证日期：{carInfo.issueDate}</td>
                                    <td>校验日期：{carInfo.validityDate}</td>
                                    <td>保险起期：{carInfo.startInsuranceDate}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                    }
                    break;

                case 'lifeOrder':
                    lifeOrderList = this.state.data;
                    data = this.paginationData(this.state.data, this.state.pageIndex);
                    data.map(function (order, i) {
                        orders.push({orderNum: order.orderNum});
                        trs.push(
                            <tr key={i}>
                                <td>
                                    <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                </td>
                                <td>
                                    {order.productName}
                                </td>
                                <td>
                                    {order.orderDate}
                                </td>
                                <td>
                                    {order.orderStateStr}
                                </td>
                                <td>
                                    {order.insuranceFeeTotal}
                                </td>
                            </tr>
                        );
                    });

                    if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                        var orderDetail = this.state.orderDetail;
                        var orderPlan = orderDetail.plan;
                        var insurer = orderDetail.insurer;
                        var insuranceder = orderDetail.insuranceder;
                        var benefiter = orderDetail.benefiter;
                        detail_trs.push(//订单信息
                            <tr key={0}>
                                <td>订单号：{orderDetail.orderNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>申请时间：{orderDetail.applyTime}</td>
                                <td>订单时间：{orderDetail.orderDate}</td>
                                <td>客户编号：{orderDetail.customerNum}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>客户姓名：{orderDetail.customerName}</td>
                                <td>客户电话：{orderDetail.customerPhone}</td>
                                <td>邮寄地址：{orderDetail.customerMailAddress}</td>
                                <td>邮编：{orderDetail.customerMailPostcode}</td>
                                <td>保障类型：{orderDetail.insuranceType}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>是否有社保：{orderDetail.hasSocietyInsurance}</td>
                                <td>是否有商业保险：{orderDetail.hasCommerceInsurance}</td>
                                <td>计划保费：{orderDetail.planInsuranceFee}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        );

                        if(orderPlan!==undefined && orderPlan!==null){ //计划书
                            var j=0;
                            var k=0;
                            orderPlan.map(function (item, i) {
                                var productItem = item.productItem;
                                var insuranceNum = item.insuranceNum; //保单号
                                plan_trs.push( //计划书
                                    <tr key={j++}>
                                        <td>保单号：{item.insuranceNum}</td>
                                        <td>签单日期：{item.feeDate}</td>
                                        <td>起保日期：{item.insuranceDate}</td>
                                        <td>申请时间：{item.applyTime}</td>
                                        <td>保额：{item.insuranceQuota}</td>
                                    </tr>
                                );
                                plan_trs.push(
                                    <tr key={j++}>
                                        <td>缴费年限类型：{item.feeYearType}</td>
                                        <td>保障期限类型：{item.insuranceDuringType}</td>
                                        <td>起保日期：{item.insuranceDate}</td>
                                        <td>保费金额：{item.insuranceFee}</td>
                                        <td>佣金：{item.commission}</td>
                                    </tr>
                                );
                                plan_trs.push(
                                    <tr key={j++}>
                                        <td>积分：{item.score}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );

                                if(productItem!==undefined && productItem!==null) { //产品信息
                                    productItem.map(function (item, i) {
                                        product_trs.push(
                                            <tr key={k++}>
                                                <td>保单号：{insuranceNum}</td>
                                                <td>产品编号：{item.productNum}</td>
                                                <td>产品名称：{item.productName}</td>
                                                <td>保险公司：{item.companyName}</td>
                                                <td>保额：{item.insuranceQuota}</td>
                                            </tr>
                                        );
                                    });
                                }
                            });
                        }
                        if(insurer!==undefined && insurer!==null){
                            insurer_trs.push( //投保人信息
                                <tr key={0}>
                                    <td>编号：{insurer.perNum}</td>
                                    <td>姓名：{insurer.perName}</td>
                                    <td>身份证号：{insurer.perIdCard}</td>
                                    <td>地址：{insurer.perAddress}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                        if(insuranceder!==undefined && insuranceder!==null){
                            insuranceder_trs.push( //被保险人信息
                                <tr key={0}>
                                    <td>编号：{insuranceder.perNum}</td>
                                    <td>姓名：{insuranceder.perName}</td>
                                    <td>身份证号：{insuranceder.perIdCard}</td>
                                    <td>地址：{insuranceder.perAddress}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                        if(benefiter!==undefined && benefiter!==null){
                            benefiter_trs.push( //受益人信息
                                <tr key={0}>
                                    <td>编号：{benefiter.perNum}</td>
                                    <td>姓名：{benefiter.perName}</td>
                                    <td>身份证号：{benefiter.perIdCard}</td>
                                    <td>地址：{benefiter.perAddress}</td>
                                    <td></td>
                                </tr>
                            );
                        }
                    }
                    break;

                case 'serviceOrder':
                    serviceOrderList = this.state.data;
                    data = this.paginationData(this.state.data, this.state.pageIndex);
                    data.map(function (order, i) {
                        orders.push({orderNum: order.orderNum});
                        trs.push(
                            <tr key={i}>
                                <td>
                                    <a href="javascript:void(0)" onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                </td>
                                <td>
                                    {order.serviceType}
                                </td>
                                <td>
                                    {order.orderFinishDate}
                                </td>
                                <td>
                                    {order.orderStateStr}
                                </td>
                                <td>
                                    {order.fee}
                                </td>
                            </tr>
                        );
                    });
                    if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                        var orderDetail = this.state.orderDetail;
                        detail_trs.push(//订单信息
                            <tr key={0}>
                                <td>订单编号：{orderDetail.orderNum}</td>
                                <td>订单状态：{orderDetail.orderStateStr}</td>
                                <td>服务类型：{orderDetail.serviceType}</td>
                                <td>服务项目：{orderDetail.subServiceTypeNames}</td>
                                <td>预约时间：{orderDetail.estimateTime}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={1}>
                                <td>服务地点：{orderDetail.servicePlace}</td>
                                <td>申请时间：{orderDetail.applyTime}</td>
                                <td>接单时间：{orderDetail.takeOrderDate}</td>
                                <td>服务人员编号：{orderDetail.servicePersonNum}</td>
                                <td>服务人员姓名：{orderDetail.servicePersonName}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={2}>
                                <td>客户编号：{orderDetail.customerNum}</td>
                                <td>客户姓名：{orderDetail.customerName}</td>
                                <td>订单完成时间：{orderDetail.orderFinishDate}</td>
                                <td>服务费用：{orderDetail.fee}</td>
                                <td>结算时间：{orderDetail.feeDate}</td>
                            </tr>
                        );
                        detail_trs.push(
                            <tr key={3}>
                                <td>备注：{orderDetail.remark}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        );
                    }
                    break;

                case 'score':
                    data = this.state.data;
                    var score = data.score;
                    var score_carOrderList = data.carOrder;
                    var score_lifeOrderList = data.lifeOrder;
                    var score_serviceOrderList = data.serviceOrder;
                    switch (this.state.scoreTabCurrent) {
                        case 'all':
                            scoreList = score_carOrderList;
                            scoreList = scoreList.concat(score_lifeOrderList)
                            scoreList = scoreList.concat(score_serviceOrderList)
                            //Array.prototype.push.apply(scoreList, lifeOrderList);
                            //Array.prototype.push.apply(scoreList, serviceOrderList);
                            data = this.paginationData(scoreList, this.state.pageIndex);

                            if(data!==null){
                                data.map(function (order, i) {
                                    orders.push({orderNum: order.orderNum});
                                    trs.push(
                                        <tr key={i}>
                                            <td>
                                                <a href="javascript:void(0)"
                                                   onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                            </td>
                                            <td>
                                                {order.scoreResource}
                                            </td>
                                            <td>
                                                {order.score}
                                            </td>
                                            <td>
                                                {order.applyTime}
                                            </td>
                                            <td>
                                                {order.orderStateStr}
                                            </td>
                                        </tr>
                                    );
                                });
                            }
                            break;

                        case 'income':
                            scoreList = score_carOrderList;
                            scoreList = scoreList.concat(score_lifeOrderList)

                            data = this.paginationData(scoreList, this.state.pageIndex);
                            if(data!==null){
                                data.map(function (order, i) {
                                    orders.push({orderNum: order.orderNum});
                                    trs.push(
                                        <tr key={i}>
                                            <td>
                                                <a href="javascript:void(0)"
                                                   onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                            </td>
                                            <td>
                                                {order.scoreResource}
                                            </td>
                                            <td>
                                                {order.score}
                                            </td>
                                            <td>
                                                {order.applyTime}
                                            </td>
                                            <td>
                                                {order.orderStateStr}
                                            </td>
                                        </tr>
                                    );
                                });
                            }
                            break;

                        case 'used':
                            scoreList = score_serviceOrderList;
                            data = this.paginationData(scoreList, this.state.pageIndex);
                            if(data!==null){
                                data.map(function (order, i) {
                                    orders.push({orderNum: order.orderNum});
                                    trs.push(
                                        <tr key={i}>
                                            <td>
                                                <a href="javascript:void(0)"
                                                   onClick={slideDetail.bind(ins,i)}>{order.orderNum}</a>
                                            </td>
                                            <td>
                                                {order.scoreResource}
                                            </td>
                                            <td>
                                                {order.score}
                                            </td>
                                            <td>
                                                {order.orderDate}
                                            </td>
                                            <td>
                                                {order.orderStateStr}
                                            </td>
                                        </tr>
                                    );
                                });
                            }
                            break;
                    }

                    if (this.state.orderDetail !== undefined && this.state.orderDetail !== null) {
                        var orderDetail = this.state.orderDetail;
                        var flag = orderDetail.flag;
                        switch (flag) {
                            case 'carOrder':
                                detail_trs.push( //订单信息
                                    <tr key={0}>
                                        <td>订单号：{orderDetail.orderNum}</td>
                                        <td>保单号：{orderDetail.insuranceNum}</td>
                                        <td>订单状态：{orderDetail.orderStateStr}</td>
                                        <td>申请时间：{orderDetail.applyTime}</td>
                                        <td>缴费时间：{orderDetail.feeDate}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={1}>
                                        <td>订单时间：{orderDetail.orderDate}</td>
                                        <td>保险公司：{orderDetail.companyName}</td>
                                        <td>投保人perId：{orderDetail.insurerId}</td>
                                        <td>被保险人perId：{orderDetail.insurancederId}</td>
                                        <td>受益人perId：{orderDetail.benefiterId}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={2}>
                                        <td>客户：{orderDetail.customerName}</td>
                                        <td>商业基准保费：{orderDetail.insuranceBusinessFee}</td>
                                        <td>商业险折扣：{orderDetail.businessDiscount}</td>
                                        <td>交强险基准保费：{orderDetail.insuranceCompulsoryFee}</td>
                                        <td>交强险折扣：{orderDetail.compulsoryDiscount}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={3}>
                                        <td>车船税：{orderDetail.carTax}</td>
                                        <td>签单保费：{orderDetail.contractFee}</td>
                                        <td>佣金：{orderDetail.commission}</td>
                                        <td>积分：{orderDetail.score}</td>
                                        <td>邮寄地址：{orderDetail.customerMailAddress}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={4}>
                                        <td>邮编：{orderDetail.customerMailPostcode}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );
                                break;
                            case 'lifeOrder':
                                detail_trs.push(//订单信息
                                    <tr key={0}>
                                        <td>订单号：{orderDetail.orderNum}</td>
                                        <td>订单状态：{orderDetail.orderStateStr}</td>
                                        <td>申请时间：{orderDetail.applyTime}</td>
                                        <td>订单时间：{orderDetail.orderDate}</td>
                                        <td>客户编号：{orderDetail.customerNum}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={1}>
                                        <td>客户姓名：{orderDetail.customerName}</td>
                                        <td>客户电话：{orderDetail.customerPhone}</td>
                                        <td>邮寄地址：{orderDetail.customerMailAddress}</td>
                                        <td>邮编：{orderDetail.customerMailPostcode}</td>
                                        <td>保障类型：{orderDetail.insuranceType}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={2}>
                                        <td>是否有社保：{orderDetail.hasSocietyInsurance}</td>
                                        <td>是否有商业保险：{orderDetail.hasCommerceInsurance}</td>
                                        <td>计划保费：{orderDetail.planInsuranceFee}</td>
                                        <td>保单号：{orderDetail.insuranceNum}</td>
                                        <td>起保日期：{orderDetail.insuranceDate}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={3}>
                                        <td>签单日期：{orderDetail.feeDate}</td>
                                        <td>积分：{orderDetail.score}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );
                                break;
                            case 'serviceOrder':
                                detail_trs.push(//订单信息
                                    <tr key={0}>
                                        <td>订单编号：{orderDetail.orderNum}</td>
                                        <td>订单状态：{orderDetail.orderStateStr}</td>
                                        <td>服务类型：{orderDetail.serviceType}</td>
                                        <td>服务项目：{orderDetail.subServiceTypeNames}</td>
                                        <td>预约时间：{orderDetail.estimateTime}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={1}>
                                        <td>服务地点：{orderDetail.servicePlace}</td>
                                        <td>申请时间：{orderDetail.applyTime}</td>
                                        <td>接单时间：{orderDetail.takeOrderDate}</td>
                                        <td>服务人员编号：{orderDetail.servicePersonNum}</td>
                                        <td>服务人员姓名：{orderDetail.servicePersonName}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={2}>
                                        <td>客户编号：{orderDetail.customerNum}</td>
                                        <td>客户姓名：{orderDetail.customerName}</td>
                                        <td>订单完成时间：{orderDetail.orderDate}</td>
                                        <td>积分：{orderDetail.fee}</td>
                                        <td>结算时间：{orderDetail.feeDate}</td>
                                    </tr>
                                );
                                detail_trs.push(
                                    <tr key={3}>
                                        <td>备注：{orderDetail.remark}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );
                                break;
                        }
                    }
            }

            switch (this.state.current) {

                case 'carOrder':
                    mainContent =(  <div className='carOrder' style={{position:'absolute',zIndex:'-1'}} >
                        <div className='row' style={{padding:'10px'}}>
                            <div className='main-content'>
                                <div className="page-title">
                                    <span style={{color:'#288329'}}>
                                        车险订单列表
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                            <div className="col-lg-12">
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                                <thead className="table-head">
                                                <tr>
                                                    <th width="300">订单编号</th>
                                                    <th width="300">保单号</th>
                                                    <th width="300">产品名称</th>
                                                    <th width="300">订单时间</th>
                                                    <th width="300">订单状态</th>
                                                    <th width="300">保险公司</th>
                                                    <th width="300">保费</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={7}>
                                                    <PageNavigator
                                                        capacity={carOrderList.length}
                                                        pageIndex={this.state.pageIndex}
                                                        pageBegin={1}
                                                        previousCb={this.previousCb}
                                                        pageCb={this.pageCb}
                                                        nextCb={this.nextCb}
                                                        isChange={this.state.isChange}
                                                        paginate={Page}
                                                        />
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div id="order_detail" style={{display:'inline-block',width:'98%',position:'absolute',left:'101%'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                                <tr>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                </tr>
                                            </thead>

                                            <h4 style={{marginTop:'15px'}}><strong>订单信息:</strong></h4>
                                            <tbody>
                                            {detail_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>行驶证信息:</strong></h4>
                                            <tbody>
                                            {carInfo_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>产品信息:</strong></h4>
                                            <tbody>
                                            {product_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>投保人信息:</strong></h4>
                                            <tbody>
                                            {insurer_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>被保险人信息:</strong></h4>
                                            <tbody>
                                            {insuranceder_trs}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="nav-return">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}} />
                                    <a href="#" onClick={this.return}>
                                        <div style={{display:'inline-block',fontSize:'24px'}}>
                                            <span aria-hidden="true">返回</span>
                                        </div>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>);
                    break;

                case 'score':
                    mainContent =(
                        <div className='score' style={{position:'absolute',zIndex:'-1'}}>

                            <div className="nav-collapse">
                                <ul className="nav " >

                                    <li className="all" onClick={this.scoreTabChange.bind(this,'all')} >
                                        <a href="javascript:void(0)" className='all' style={{color:'#288329', fontSize:'1.4em'}}>
                                            积分明细
                                        </a>
                                    </li>
                                    <li className="income" onClick={this.scoreTabChange.bind(this,'income')} >
                                        <a href="javascript:void(0)" className='income' style={{color:'#288329', fontSize:'1.4em'}}>
                                            积分收入
                                        </a>
                                    </li>
                                    <li className="used" onClick={this.scoreTabChange.bind(this,'used')} >
                                        <a href="javascript:void(0)" className='used' style={{color:'#288329', fontSize:'1.4em'}}>
                                            积分支出
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="score" style={{paddingtop:'8px'}}>
                                <div className="summary clearfix">
                                    <div className="item valid">
                                        <span className="desc" style={{display:'block',float:'left'}}>可用积分:</span>
                                        <span className="point">{score}</span>
                                    </div>
                                    <div className="item exchange">
                                        <a href="javascript:void(0);" target="_blank">暂不可充值</a>
                                    </div>
                                </div>
                            </div>


                            <div className="slider" ref="slider" style={{width:'100%',marginTop:'20px',position:'relative'}}>
                                <div className="col-lg-12">
                                    <div className="widget-container fluid-height">
                                        <div className="widget-content padded clearfix">
                                            <table className="table table-striped invoice-table">
                                                <thead className="table-head">
                                                    <tr>
                                                        <th width="330">订单编号</th>
                                                        <th width="330">来源/用途</th>
                                                        <th width="330">积分变化</th>
                                                        <th width="330">订单时间</th>
                                                        <th width="330">订单状态</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {trs}
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <td colSpan={5}>
                                                        <PageNavigator
                                                            capacity={scoreList.length}
                                                            pageIndex={this.state.pageIndex}
                                                            pageBegin={1}
                                                            previousCb={this.previousCb}
                                                            pageCb={this.pageCb}
                                                            nextCb={this.nextCb}
                                                            isChange={this.state.isChange}
                                                            paginate={Page}
                                                            />
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div id="order_detail" style={{display:'inline-block',width:'98%',position:'absolute',left:'101%'}}>
                                    <div className="widget-container fluid-height">
                                        <div className="widget-content padded clearfix">
                                            <table className="table table-striped invoice-table">
                                                <thead className="table-head">
                                                <tr>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                    <th width="300"></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {detail_trs}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="nav-return">
                                        <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}} />
                                        <a href="javascript:void(0)" onClick={this.return}>
                                            <div style={{display:'inline-block',fontSize:'24px'}}>
                                                <span aria-hidden="true">返回</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>);
                    break;

                case 'lifeOrder':
                    mainContent =(<div className='lifeOrder' style={{position:'absolute',zIndex:'-1'}}>
                        <div className='row' style={{padding:'10px'}}>
                            <div className='main-content'>
                                <div className="page-title">
                                    <span style={{color:'#288329'}}>
                                        寿险订单列表
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                            <div className="col-lg-12">
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                                <tr>
                                                    <th width="330">订单编号</th>
                                                    <th width="330">产品名称</th>
                                                    <th width="330">订单时间</th>
                                                    <th width="330">订单状态</th>
                                                    <th width="330">保费</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <PageNavigator
                                                        capacity={lifeOrderList.length}
                                                        pageIndex={this.state.pageIndex}
                                                        pageBegin={1}
                                                        previousCb={this.previousCb}
                                                        pageCb={this.pageCb}
                                                        nextCb={this.nextCb}
                                                        isChange={this.state.isChange}
                                                        paginate={Page}
                                                        />
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div id="order_detail" style={{display:'inline-block',width:'98%',position:'absolute',left:'101%'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                            <tr>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                            </tr>
                                            </thead>

                                            <h4 style={{marginTop:'15px'}}><strong>订单信息:</strong></h4>
                                            <tbody>
                                            {detail_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>计划书:</strong></h4>
                                            <tbody>
                                            {plan_trs}
                                            </tbody>


                                            <h4 style={{marginTop:'15px'}}><strong>产品信息:</strong></h4>
                                            <tbody>
                                            {product_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>投保人信息:</strong></h4>
                                            <tbody>
                                            {insurer_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>被保险人信息:</strong></h4>
                                            <tbody>
                                            {insuranceder_trs}
                                            </tbody>

                                            <h4 style={{marginTop:'15px'}}><strong>受益人信息:</strong></h4>
                                            <tbody>
                                            {benefiter_trs}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="nav-return">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}} />
                                    <a href="javascript:void(0)" onClick={this.return}>
                                        <div style={{display:'inline-block',fontSize:'24px'}}>
                                            <span aria-hidden="true">返回</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>);
                    break;

                case 'serviceOrder':
                    mainContent =(<div className='serviceOrder' style={{position:'absolute',zIndex:'-1'}}>
                        <div className='row' style={{padding:'10px'}}>
                            <div className='main-content'>
                                <div className="page-title">
                                    <span style={{color:'#288329'}}>
                                        服务订单列表
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="slider" ref="slider" style={{width:'100%',position:'relative'}}>
                            <div className="col-lg-12">
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                            <tr>
                                                <th width="330">订单编号</th>
                                                <th width="330">服务类型</th>
                                                <th width="330">订单完成时间</th>
                                                <th width="330">订单状态</th>
                                                <th width="330">费用</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {trs}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={5}>
                                                    <PageNavigator
                                                        capacity={serviceOrderList.length}
                                                        pageIndex={this.state.pageIndex}
                                                        pageBegin={1}
                                                        previousCb={this.previousCb}
                                                        pageCb={this.pageCb}
                                                        nextCb={this.nextCb}
                                                        isChange={this.state.isChange}
                                                        paginate={Page}
                                                        />
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div id="order_detail" style={{display:'inline-block',width:'98%',position:'absolute',left:'101%'}}>
                                <div className="widget-container fluid-height">
                                    <div className="widget-content padded clearfix">
                                        <table className="table table-striped invoice-table">
                                            <thead className="table-head">
                                            <tr>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                                <th width="300"></th>
                                            </tr>
                                            </thead>

                                            <h4><strong>订单信息:</strong></h4>
                                            <tbody>
                                            {detail_trs}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="nav-return">
                                    <hr style={{height:'2px',border:'none',borderTop:'2px dotted #185598'}} />
                                    <a href="javascript:void(0)" onClick={this.return}>
                                        <div style={{display:'inline-block',fontSize:'24px'}}>
                                            <span aria-hidden="true">返回</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>);
                    break;
            }
        }else{
            //初始化内容详情
            this.initialData();
        }

        let navbar=
            <div className="nav-collapse">

                <div style={{margin:'15% 0 0 12%'}}>
                    <ul>
                        <li className="dropdown">
                            <a data-toggle="dropdown" href="javascript:void(0)" style={{fontSize:'1.2em'}}>
                                <span aria-hidden="true" >
                                    <i className='icon-user'></i>
                                </span><strong>{perName}</strong><b className="caret"></b>
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a style={{fontSize:'1.1em'}}>电话：{phone}</a>
                                </li>
                                <li>
                                    <a style={{fontSize:'1.1em'}}>地址：{address}</a>
                                </li>
                                <li>
                                    <a style={{fontSize:'1.1em'}}>邮编：{postCode}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div style={{float:'left',marginLeft:'5%'}}>
                    <ul className="nav">

                        <li onClick={this.tabChange.bind(this,'score')}>
                            <a href="javascript:void(0)" className='current' style={{fontSize:'1.8em'}}>
                            <span aria-hidden="true" >
                                <i className='icon-credit-card'></i>
                            </span>积分
                            </a>
                        </li>

                        <li className="dropdown" onClick={this.tabChange.bind(this,'carOrder')}>
                            <a data-toggle="dropdown" href="javascript:void(0)" className="current" style={{fontSize:'1.8em'}}>
                            <span aria-hidden="true" >
                                <i className='icon-truck'></i>
                            </span>车险
                            </a>
                        </li>

                        <li className="dropdown" onClick={this.tabChange.bind(this,'lifeOrder')}>
                            <a data-toggle="dropdown" href="javascript:void(0)" className="current" style={{fontSize:'1.8em'}}>
                            <span aria-hidden="true" >
                                <i className='icon-user-md'></i>
                            </span>寿险
                            </a>
                        </li>

                        <li className="dropdown" onClick={this.tabChange.bind(this,'serviceOrder')}>
                            <a data-toggle="dropdown" href="javascript:void(0)" className="current" style={{fontSize:'1.8em'}}>
                            <span aria-hidden="true" >
                                <i className='icon-list-ul'></i>
                            </span>服务
                            </a>
                        </li>
                    </ul>
                </div>

            </div>;


        if(this.state.isModify!==undefined && this.state.isModify!==null &&
            this.state.customerId!==undefined && this.state.customerId!==null){
            return(
                <PersonInfo customerId={this.state.customerId} />
            );
        }else{
            return (
                <div className='Business' ref='business'
                     style={{background:'url('+App.getResourceDeployPrefix()+'/images/background_1.png) no-repeat',backgroundSize:'100%'}}>
                    <div className='nav_bar' style={{float:'left',width:'8%',position:'static',background:'#EEEEEE',height:'835px',borderRight:'1px #4b8ec6 solid'}}>
                        <div className='row' style={{padding:'0px 10px 0px 10px'}}>
                            {navbar}
                        </div>
                    </div>
                    <div style={{float:'left',width:'92%'}}>
                        {mainContent}
                    </div>
                </div>);
        }
    }
});
module.exports=OrderCenter;
