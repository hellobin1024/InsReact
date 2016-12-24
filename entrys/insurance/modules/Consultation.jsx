import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/Consultation.css';
import Carousel from './Carousel.jsx';
import ConsultationDetails from '../modules/ConsultationDetails.jsx';
import NewQuestion from '../modules/NewQuestion.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');
import Calendar from './Calendar.jsx';
var Page = require('../../../components/page/Page');
var SyncStore = require('../../../components/flux/stores/SyncStore');
import PageNavigator from './PageNavigator';

var info={};

var Consultation=React.createClass({



    Branch:function(branch){
        this.setState({nav: branch});
        this.initialData();
        this.getAllQuestion();

    },
    validate:function(){
        if(this.state.session!=true){

            var loginModal = this.refs['loginModal'];
            var username=$(loginModal).find("input[name='username']").val();
            var password=$(loginModal).find("input[name='password']").val();

            var url="/bsuims/bsMainFrameInit.do";
            var params={
                login_strLoginName: username,
                login_strPassword: password
            };

            ProxyQ.queryHandle(
                'post',
                url,
                params,
                null,
                function(res) {
                    var re = res.re;
                    if(re!==undefined && re!==null && (re ==1 || re =="1")){ //登陆成功
                        this.setState({session: true});
                        var loginModal = this.refs['loginModal'];
                        $(loginModal).modal('hide');
                        window.setTimeout(this.goToOthers('newQuestion'), 300);
                        SyncStore.setNote();

                    }
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },


    paginationData:function (data,pageIndex) {
        let capacity=data.length;
        var slices=null;
        Page.getInitialDataIndex(capacity,pageIndex,function(ob){
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

    goToOthers:function(branch){
        if (this.state.session != true) {
            var loginModal = this.refs['loginModal'];
            $(loginModal).modal('show');
        } else {
            this.setState({
                nav: branch,
            });
        }
    },

    getInitialState: function() {
        return {

            checked: !!this.props.checked,
            current: 'carOrder',
            startData:null,
            endDate:null,
            pageIndex:0,
            isChange:false,
            value:null,
            session:SyncStore.getNote(),
            dataTg:1


        }
    },

    initialData:function(){

        window.setTimeout(function () {

            this.setState({
                data: info.data
            })
        }.bind(this), 300);

    },
    onSaveInput:function(event){

        this.setState({value: event.target.value});

    },
    onChildChanged: function (type,date) {
        switch (type){
            case 'startDate':
                this.setState({
                    startData: date
                });
                break;
            case 'endDate':
                this.setState({
                    endData: date
                });
                break;
        }
    },
    getQuestionContent:function(item,title,personId,date,comments){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'getProblemContent',
            themeId:item
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                info=ob;

                this.state.nav='consultationDetails';
                this.initialData();

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
        this.state.title=title;
        this.state.personId=personId;
        this.state.date=date;
        this.state.comments=comments;
    },
    setDataTg:function(){
        this.state.dataTg=this.state.dataTg+1;
        if(this.state.dataTg%2==0){
            $('#lab5').attr('data-tg','只看自己');
            this.getMyQuestion();
        }else{
            $('#lab5').attr('data-tg','全部');
            this.getLimitQuestion();
        }

    },

    getMyQuestion:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'getMyProblem',
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                info=ob;
                this.state.nav=undefined;
                this.initialData();
            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getLimitQuestion:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'getLimitProblem',
            startDate:this.state.startData,
            endDate:this.state.endData,
            title:this.state.value
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                info=ob;
                this.state.nav=undefined;
                this.initialData();

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getAllQuestion:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'getProblemList'
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

    render:function(){
        var container=null;
        if(this.state.data!==undefined&&this.state.data!==null) {
            if(this.state.nav!='consultationDetails'&&this.state.nav!='newQuestion') {
                var test = this.state.data;
                var data = this.paginationData(test, this.state.pageIndex);
                var trs = [];
                var ref = this;
                data.map(function (item, i) {
                    trs.push(
                        <ul className="item-list" key={i}>
                            <li className="item clearfix">
                                <div className="what">
                                    <h3 className="theme"> {item.title}</h3>

                                </div>
                                <div className="who">
                                    {item.perName}
                                </div>
                                <div className="when">
                                    {item.createTime.month+1 + "月" + item.createTime.date + "日"
                                    + item.createTime.hours + ":" + item.createTime.minutes}
                                </div>
                                <div className="details"
                                     onClick={ref.getQuestionContent.bind(this,item.themeId,item.title,item.personId,item.createTime,item.readCount)}>
                                    <a href="javascript:void(0)"> 详情 </a>
                                </div>
                            </li>
                        </ul>
                    )
                });
            }

            switch (this.state.nav) {
                case undefined:
                    container =
                        <div>
                            <div className="detail">
                                <ul className="masthead clearfix">
                                    <li className="what">主题/问题</li>
                                    <li className="who">提问者</li>
                                    <li className="when">日期</li>
                                    <li className="details">详情</li>
                                </ul>
                                <div>
                                    {trs}
                                </div>
                                <PageNavigator
                                    capacity={this.state.data.length}
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
                    break;
                case 'consultationDetails':
                    container = <ConsultationDetails data={info} title={this.state.title} personId={this.state.personId} date={this.state.date} comments={this.state.comments}Branch={this.Branch}/>;
                    break;
                case 'newQuestion':
                    container =<NewQuestion  Branch={this.Branch}/>
                    break;
            }
        }else{

            this.initialData();
        }
        let  navbar;
        if(this.state.nav!='newQuestion') {
            navbar =
                <div className='search-area-wrapper'>
                    <div className='search-area '>
                        <h3 className='search-header'>问题咨询</h3>

                        <p className='search-tag-line'>
                            如果您有任何问题，请在此进行查询或者提问！</p>

                        <form className='search-form clearfix' method="get" action="#">
                            <input className='search-term required' type="text"
                                   placeholder="在此输入您的问题进行搜素！"
                                   title="* Please enter a search term!"
                                   onChange={this.onSaveInput.bind(this)}
                                />
                            <input className='search-btn' value="搜索"
                                   onClick={this.getLimitQuestion}/>

                            <div id="search-error-container"></div>
                            <div style={{width:'150%'}}>
                                <div className='row-50'
                                     style={{width:'37%',float:'left',paddingTop:'25px',border:'1px'}}>
                                    <div className='row-50' style={{float:'left',border:'1px ',  width:'50%' }}>
                                        <p style={{float:'left',paddingLeft:'31% ' }}>
                                            时间：
                                        </p>
                                        <Calendar data={'2016-11-10'} ctrlName={'consultation'}
                                                  callbackParent={this.onChildChanged.bind(this,'startDate')}/>
                                    </div>
                                    <div className='row-50' style={{float:'left',border:'1px ',  width:'50%' }}>
                                        <p style={{float:'left', marginLeft: '-6%' }}>
                                            起——至
                                        </p>
                                        <Calendar data={'2016-11-10'} ctrlName={'consultation'}
                                                  callbackParent={this.onChildChanged.bind(this,'endDate')}/>
                                    </div>
                                </div>
                                <div>
                                    <input className='search-new' value="新问题"
                                           onClick={this.goToOthers.bind(this,'newQuestion')}
                                        />
                                    {SyncStore.getNote() ?
                                        <span className='tg-list-item' style={{marginTeft:'34%', marginTop: '-2%'}}>
                                        <input className='tgl tgl-flip' id='cb5' type='checkbox'/>
                                            <label  style={{marginLeft: '35%', marginTop: '-2%'}}id='lab5'onClick={this.setDataTg} className='tgl-btn' data-tg='全部'data-tg-off='全部' data-tg-on='只看自己' htmlFor='cb5'></label>
                                        </span>
                                        :null}


                                </div>
                            </div>
                        </form>
                    </div>
                </div>;
        }

        return (
            <div className='Consultation' ref='consultation'>
                <div className='container' style={{position:'static',background:'#fff'}}>
                    <div className='row' style={{padding:'10px 10px 0px 10px'}}>
                        {navbar}
                    </div>
                </div>
                <div onLoad={this.getAllQuestion()}>
                {container}
                </div>


                <div className="modal fade bs-example-modal-sm login-container"
                     tabIndex="-1"
                     role="dialog"
                     aria-labelledby="myLargeModalLabel"
                     aria-hidden="true"
                     ref='loginModal'
                    >
                    <div className="modal-dialog modal-sm" style={{position:'absolute',top:'30%',width:'50%',marginLeft:'25%'}}>
                        <div className="modal-content" style={{position:'relative',width:'100%',padding:'40px'}}>

                            <div className="modal-body">

                                <div className="form-group">
                                    <input className="form-control" name="username" placeholder="用户名/手机号" type="text"/>
                                </div>
                                <div className="form-group" style={{position:'relative'}}>
                                    <input className="form-control" name="password" placeholder="密码" type="text"/>
                                </div>
                                <div className="form-options clearfix">
                                    <input className='search-new' value="登录"
                                           onClick={this.validate}
                                    />
                                    <a className="pull-right" href="#" style={{marginTop:'42px'}}>忘记密码了？</a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>



            </div>);

    }
});


module.exports=Consultation;