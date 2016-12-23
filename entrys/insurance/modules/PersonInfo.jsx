/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/personInfoBase.css';
import '../../../css/insurancems/components/personInfoLayout.css';

import Upload from '../../insurance/component/Upload.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var PersonInfo=React.createClass({

    //显示提示框，目前三个参数(txt：要显示的文本；time：自动关闭的时间（不设置的话默认1500毫秒）；status：默认0为错误提示，1为正确提示；)
    showTips:function(txt,time,status) {
        var htmlCon = '';
        if(txt != ''){
            if(status != 0 && status != undefined){
                htmlCon = '<div class="tipsBox" style="width:220px;padding:10px;background-color:#4AAF33;border-radius:4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;color:#fff;box-shadow:0 0 3px #ddd inset;-webkit-box-shadow: 0 0 3px #ddd inset;text-align:center;position:fixed;top:25%;left:50%;z-index:999999;margin-left:-120px;">'+txt+'</div>';
            }else{
                htmlCon = '<div class="tipsBox" style="width:220px;padding:10px;background-color:#D84C31;border-radius:4px;-webkit-border-radius: 4px;-moz-border-radius: 4px;color:#fff;box-shadow:0 0 3px #ddd inset;-webkit-box-shadow: 0 0 3px #ddd inset;text-align:center;position:fixed;top:25%;left:50%;z-index:999999;margin-left:-120px;">'+txt+'</div>';
            }
            $('body').prepend(htmlCon);
            if(time == '' || time == undefined){
                time = 1500;
            }
            setTimeout(function(){ $('.tipsBox').remove(); },time);
        }
    },

    //切换步骤（通过添加类名 产生效果）
    switchBox:function(ob){
        var i = ob;
        var selfInfo=this.refs.selfInfo;
        var relativeInfo=this.refs.relativeInfo;
        var carInfo=this.refs.carInfo;
        switch(i){
            case 1:
                $(selfInfo).addClass('current');
                $(relativeInfo).removeClass('current');
                $(carInfo).removeClass('current');
                this.setState({current:'selfInfo'});
                break;
            case 2:
                $(relativeInfo).addClass('current');
                $(selfInfo).removeClass('current');
                $(carInfo).removeClass('current');
                this.setState({current:'relativeInfo'});
                break;
            case 3:
                $(carInfo).addClass('current');
                $(selfInfo).removeClass('current');
                $(relativeInfo).removeClass('current');
                this.setState({current:'carInfo'});
                break;
        }
    },

    doSave:function(ob){
        var customerId=ob;
        var selfPersonInfo = this.refs['selfPersonInfo'];
        var perName=$(selfPersonInfo).find("input[name='perName']").val();
        //var phoneNum=$(selfPersonInfo).find("input[name='phoneNum']").val(); 不可修改
        var address=$(selfPersonInfo).find("input[name='address']").val();
        var postCode=$(selfPersonInfo).find("input[name='postCode']").val();

        if (perName == '') {
            this.showTips('请填写您的姓名~');
        } else if (address == '') {
            this.showTips('请填写您的地址~');
        } else if (postCode == '') {
            this.showTips('请再次输入您的邮编~');
        } else {
            //this.showTips('提交成功~', 2500, 1);

            var url="/insurance/insuranceReactPageDataRequest.do";
            var params={
                reactPageName:'insurancePersonalCenterPersonInfo',
                reactActionName:'setInsuranceCustomerInfo',
                customerId:customerId,
                perName:perName,
                address:address,
                postCode:postCode
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
        }
    },

    onChildChanged:function (ob,imgData) {
        switch(ob){
            case 'frontImg':
                this.setState({frontImg: imgData});
                break;
            case 'backImg':
                this.setState({backImg: imgData});
                break;
            case 'driveLicenseImg':
                this.setState({driveLicenseImg: imgData});
                break;
            default:
                break;
        }
    },

    handleChange:function(ob,event){
        switch(ob){
            case 'perName':
                this.setState({perName:event.target.value})
                break;
            case 'address':
                this.setState({address:event.target.value})
                break;
            case 'postCode':
                this.setState({postCode:event.target.value})
                break;
            case 'relativeName':
                this.setState({relativeName:event.target.value})
                break;
            default :
                break;
        }
    },

    uploadRelativeInfo:function(){
        var relativePersonInfo = this.refs['relativePersonInfo'];
        var relativeName=$(relativePersonInfo).find("input[name='relativeName']").val();
        var relative=$('#relative option:selected').val();

        if (relativeName == '') {
            this.showTips('请填写关联人的姓名~');
        } else if (relative == '-1' || relative == -1) {
            this.showTips('请选择关联人和你的关系~');
        } else if (this.state.frontImg == undefined || this.state.frontImg == null) {
            this.showTips('请上传关联人身份证正面照片~');
        } else if (this.state.backImg == undefined || this.state.backImg == null) {
            this.showTips('请上传关联人身份证反面照片~');
        } else {

            var url="/insurance/insuranceReactPageDataRequest.do";
            var params={
                reactPageName:'insurancePersonalCenterPersonInfo',
                reactActionName:'addInsuranceRelativeInfo',
                customerId:this.state.customerId,
                relativeName:relativeName,
                relType:relative,

                fileData1:this.state.frontImg,
                fileData2:this.state.backImg
            };

            ProxyQ.queryHandle(
                'post',
                url,
                params,
                null,
                function(ob) {
                    this.initialData;
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },

    initialData:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterPersonInfo',
            reactActionName:'getInsuranceCustomerInfo',
            customerId:this.state.customerId
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
                var personInfo=data.selfInfo;
                var relativeInfo=data.relativeInfo;
                var carInfo=data.carInfo;
                this.setState({
                    data:data,
                        selfInfo:personInfo,
                        perName:personInfo.perName,
                        phoneNum:personInfo.phoneNum,
                        address:personInfo.address,
                        postCode:personInfo.postCode,
                    relativeInfo:relativeInfo,
                    carInfo:carInfo,
                });
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    getInitialState:function(){
        var customerId;
        if(this.props.customerId!==undefined && this.props.customerId!==null){
            customerId = this.props.customerId;
        }
        return ({customerId:customerId, current:'selfInfo', data:null,
            selfInfo:null, perName:null, phoneNum:null, address:null, postCode:null,
            relativeInfo:null, relativeName:null, frontImg:null, backImg:null,
            carInfo:null, driveLicenseImg:null
        });
    },

    render:function(){
        let mainContent;
        let selfInfo;
        let relativeInfo;
        let carInfo;

        let relative_trs=[];
        let relative_add_trs=[];
        let car_trs=[];

        if(this.state.data!==undefined&&this.state.data!==null) {
            relativeInfo=this.state.data.relativeInfo;
            relativeInfo.map(function (item, i) {
                relative_trs.push(
                    <tr key={i}>
                        <td>
                            {item.relativeName}
                        </td>
                        <td>
                            {item.relTypeStr}
                        </td>
                    </tr>
                );
            });

            carInfo=this.state.data.carInfo;
            carInfo.map(function (item, i) {
                car_trs.push(
                    <tr key={i}>
                        <td>
                            {item.carNum}
                        </td>
                        <td>
                            {item.ownerName}
                        </td>
                        <td>
                            {item.firstRegisterDate}
                        </td>
                        <td>
                            {item.factoryNum}
                        </td>
                        <td>
                            {item.engineNum}
                        </td>
                        <td>
                            {item.frameNum}
                        </td>
                    </tr>
                );
            });


            relative_add_trs.push(<option key={0} value={2}>{"父母"}</option>); //下拉列表
            relative_add_trs.push(<option key={1} value={3}>{"子女"}</option>);
            relative_add_trs.push(<option key={2} value={4}>{"配偶"}</option>);

        }else{
            //初始化内容详情
            this.initialData();
        }


        switch(this.state.current){
            case 'selfInfo':
                mainContent=
                    <div ref="selfPersonInfo">
                        <div className="self_control_group">
                            <label className="self_label">姓名</label>
                            <div className="self_controls">
                                <input name="perName" value={this.state.perName || ""} onChange={this.handleChange.bind(this,"perName")} className="self_input"/>
                            </div>
                        </div>
                        <div className="self_control_group">
                            <label className="self_label">电话</label>
                            <div className="self_controls">
                                <input name="phoneNum" value={this.state.phoneNum || ""} disabled="true" className="self_input" />
                            </div>
                        </div>
                        <div className="self_control_group">
                            <label className="self_label">地址</label>
                            <div className="self_controls">
                                <input name="address" value={this.state.address || ""} onChange={this.handleChange.bind(this,"address")} className="self_input"/>
                            </div>
                        </div>
                        <div className="self_control_group">
                            <label className="self_label">邮编</label>
                            <div className="self_controls">
                                <input name="postCode" value={this.state.postCode || ""} onChange={this.handleChange.bind(this,"postCode")} className="self_input"/>
                            </div>
                        </div>
                        <div className="toolBar">
                            <a className="saveBtn btn_primary" href="javascript:;" onClick={this.doSave.bind(this,this.state.customerId)}>保存</a>
                        </div>
                    </div>
                break;

            case 'relativeInfo':
                mainContent=
                    <div ref="relativePersonInfo">
                        <div className="self_control_group">
                            <table className="table table-striped invoice-table">
                                <thead>
                                <tr>
                                    <th width="300">姓名</th>
                                    <th width="300">亲属关系</th>
                                </tr>
                                </thead>
                                <tbody>
                                {relative_trs}
                                </tbody>
                            </table>
                            <hr style={{height:'2px',width:'100%',border:'none',borderTop:'2px dotted #185598'}} />
                        </div>

                        <div>
                            <div style={{float:'left',width:'100%'}}>
                                <div className="self_control_group" style={{float:'left'}}>
                                    <label className="self_label">姓名</label>
                                    <div className="self_controls">
                                        <input name="relativeName" defaultValue={this.state.relativeName || ""} onChange={this.handleChange.bind(this,"relativeName")} className="self_input"/>
                                    </div>
                                </div>

                                <div className="self_control_group">
                                    <label className="self_label">关系</label>
                                    <div className="self_controls">
                                        <select style={{width:'300px',height:'35px'}} id="relative" className="buy-field required">
                                            <option value={-1}>请选择亲属关系</option>
                                            {relative_add_trs}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="self_control_group" style={{float:'left',width:'100%'}}>
                                <label className="self_label" style={{width:'7em'}}>身份证正面:</label>
                                <div style={{marginTop:'5px'}}>
                                    <Upload ctrlName={'test'} callbackParent={this.onChildChanged.bind(this,"frontImg")} />
                                </div>
                            </div>
                            {this.state.frontImg ?
                                <div className="thumb-box" style={{height:'200px',width:'300px'}}>
                                    <img style={{marginLeft:'40%', marginTop:'3%'}} src={this.state.frontImg}/>
                                </div> : null}

                            <div className="self_control_group" style={{float:'left',marginTop:'150px',width:'100%'}}>
                                <label className="self_label" style={{width:'7em'}}>身份证反面:</label>
                                <div style={{marginTop:'5px'}}>
                                    <Upload ctrlName={'test'} callbackParent={this.onChildChanged.bind(this,"backImg")} />
                                </div>
                            </div>
                            {this.state.backImg ?
                                <div className="thumb-box" style={{height:'200px',width:'300px'}}>
                                    <img style={{marginLeft:'40%', marginTop:'3%'}} src={this.state.backImg}/>
                                </div> : null}

                            <div className="save_control" style={{float:'left', marginLeft: '40%', marginTop:'30%',width:'100%'}}>
                                <a className="saveBtn btn_primary" href="javascript:;"onClick={this.uploadRelativeInfo}>添加</a>
                            </div>

                        </div>
                    </div>
                break;

            case 'carInfo':
                mainContent=
                    <div>
                        <div className="self_control_group">
                            <table className="table table-striped invoice-table">
                                <thead>
                                <tr>
                                    <th width="300">车牌</th>
                                    <th width="300">车主姓名</th>
                                    <th width="300">注册日期</th>
                                    <th width="300">厂牌型号</th>
                                    <th width="300">发动机型号</th>
                                    <th width="300">车架号</th>
                                </tr>
                                </thead>
                                <tbody>
                                {car_trs}
                                </tbody>
                            </table>
                            <hr style={{height:'2px',width:'100%',border:'none',marginTop:'20px',borderTop:'2px dotted #185598'}} />
                        </div>

                        <div style={{float:'left',width:'100%'}}>
                            <div className="self_control_group">
                                <label className="car_label">用车城市:</label>
                                <div className="self_controls">
                                    <input type="text" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">车牌:</label>
                                <div className="self_controls">
                                    <input name="" type="text" className="self_input passwd" />
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">姓名:</label>
                                <div className="self_controls verifycode">
                                    <input type="text" name="" className="self_input verifyCode" maxLength="4"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">注册日期:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">是一年内过户的二手车吗:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">过户日期:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">厂牌型号:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">发动机号:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>
                            <div className="self_control_group">
                                <label className="car_label">车架号:</label>
                                <div className="self_controls">
                                    <input type="text" name="" className="self_input email"/>
                                </div>
                            </div>

                            <div className="self_control_group" style={{float:'left',width:'100%'}}>
                                <label className="car_label" style={{width:'7em'}}>上传行驶证:</label>
                                <div style={{marginTop:'5px'}}>
                                    <Upload ctrlName={'test'} callbackParent={this.onChildChanged.bind(this,"driveLicenseImg")} />
                                </div>
                            </div>
                            {this.state.driveLicenseImg ?
                                <div className="thumb-box" style={{height:'200px',width:'300px'}}>
                                    <img style={{marginLeft:'40%', marginTop:'3%'}} src={this.state.driveLicenseImg}/>
                                </div> : null}


                            <div className="toolBar">
                                <a id="nextBtn" className="saveBtn btn_primary" href="javascript:;">保存</a>
                            </div>
                        </div>
                    </div>
                break;
        }


        return(
            <div id="wrapper">
                <header id="header">
                    <div id="headBox">
                        <div id="loginBar">
                            <div className="w960 tr">
                                <a href="#">信息中心</a>
                            </div>
                        </div>

                        <div id="headBox">
                            <div className="w960 oh">
                                <span aria-hidden="true" style={{display:'inline-block',width:'20px', height:'40px'}}>
                                    <i className='icon-user-md'></i>
                                </span>
                                <span style={{display:'inline-block', fontSize:'1.4em', color:'#ffffff', marginTop:'20px'}}>
                                    <p>个人信息维护</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-info w960 mt20">
                    <div id="processor" >
                        <ol className="processorBox oh">
                            <li className="current" ref="selfInfo" onClick={this.switchBox.bind(this,1)}>
                                <div className="step_inner_f1">
                                    <span className="icon_step">1</span>
                                    <h4>个人基本信息</h4>
                                </div>
                            </li>
                            <li ref="relativeInfo" onClick={this.switchBox.bind(this,2)}>
                                <div className="step_inner">
                                    <span className="icon_step">2</span>
                                    <h4>关联人员信息</h4>
                                </div>
                            </li>
                            <li ref="carInfo" onClick={this.switchBox.bind(this,3)}>
                                <div className="step_inner fr">
                                    <span className="icon_step">3</span>
                                    <h4>关联车辆信息</h4>
                                </div>
                            </li>
                        </ol>
                        <div className="step_line"></div>
                    </div>
                    <div className="content_info">
                        {mainContent}
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {

    }
});
module.exports=PersonInfo;
/**
 * Created by douxiaobin on 2016/10/27.
 */
