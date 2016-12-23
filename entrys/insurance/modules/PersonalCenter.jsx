/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import OrderCenter from './OrderCenter.jsx';

var ProxyQ = require('../../../components/proxy/ProxyQ');
var SyncStore = require('../../../components/flux/stores/SyncStore');

var PersonalCenter=React.createClass({

    validate:function(){ //登录模态框处理
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
                        var loginModal = this.refs['loginModal'];
                        $(loginModal).modal('hide');
                        SyncStore.setNote(); //设置全局登录状态为true
                        this.setState({session: true}); //局部会话
                    }
                }.bind(this),
                function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            );
        }
    },

    login:function() { //先登录
        if (this.state.session != true) {
            var loginModal = this.refs['loginModal'];
            $(loginModal).modal('show');
        }
    },

    getInitialState:function(){
        return ({session: SyncStore.getNote()}); //取初始登录状态
    },

    render:function(){
        if(this.state.session == true){
            return(
                <OrderCenter/>
            )
        }else{
            return(
                <div>
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
                                        <span style={{display:'inline-block',fontSize:'1.2em'}}>用户名/手机号：</span>
                                    <span style={{display:'inline-block'}}>
                                        <input className="form-control" name="username" placeholder="" type="text" style={{width:'200%'}}/>
                                    </span>
                                    </div>
                                    <div className="form-group" style={{position:'relative'}}>
                                    <span style={{display:'inline-block',fontSize:'1.2em'}}>
                                        密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</span>
                                    <span style={{display:'inline-block'}}>
                                        <input className="form-control" name="password" placeholder="" type="password" style={{width:'200%'}}/>
                                    </span>

                                    <span className='icon-right' onClick={this.validate} ><i className='icon-chevron-right'></i>
                                    </span>

                                    </div>
                                    <div className="form-options clearfix">
                                        <a className="pull-right" href="#" style={{marginTop:'25px'}}>忘记密码了？</a>

                                        <div className="text-left">
                                            <input type="submit" value="登录" onClick={this.validate}
                                                   style={{width:'265px',height:'40px',background:'#2F8DBC',borderRadius:'5px',
                                                        outline:'none',color:'#fff',fontSize:'20px',border:'0',marginTop:'25px'}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },

    componentDidMount:function(){
        if(this.state.session == false){
            this.login();
        }
    },
});
module.exports=PersonalCenter;
/**
 * Created by douxiaobin on 2016/12/08.
 */
