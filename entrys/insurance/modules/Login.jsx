/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/Login.css';


var Login=React.createClass({

    render:function(){
        return (
            <div className="modal fade bs-example-modal-sm login-container"
                 tabIndex="-1"
                 role="dialog"
                 aria-labelledby="myLargeModalLabel"
                 aria-hidden="true"
                 ref='loginModal'
                >
                <div className="modal-dialog modal-sm" style={{position:'absolute',top:'30%',width:'50%',marginLeft:'25%'}}>
                    <div className="modal-content" style={{position:'relative',width:'100%',padding:'50px',
                                background:'url('+App.getResourceDeployPrefix()+'/images/login.png) no-repeat',backgroundSize:'100%'}}>

                        <div className="modal-body">

                            <div className="form-group">
                                <span style={{display:'inline-block',fontSize:'1.2em',margin:'0 0 0 60px'}}>用户名/手机号：</span>
                                        <span style={{display:'inline-block'}}>
                                            <input className="form-control" name="username" placeholder="" type="text" style={{width:'200%',borderBottom:'3px solid #878787'}}/>
                                        </span>
                            </div>
                            <div className="form-group" style={{position:'relative'}}>
                                        <span style={{display:'inline-block',fontSize:'1.2em',margin:'0 0 0 60px'}}>
                                            密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：
                                        </span>
                                        <span style={{display:'inline-block'}}>
                                        <input className="form-control" name="password" placeholder="" type="password" style={{width:'200%',borderBottom:'3px solid #878787'}}/>
                                        </span>

                                        <span className='icon-right' onClick={this.validate} >
                                            <i className='icon-chevron-right'></i>
                                        </span>
                            </div>
                            <div className="form-options clearfix">

                                <div className="text-left">
                                    <input type="submit" value="登录" onClick={this.validate}
                                           style={{width:'265px',height:'40px',background:'seagreen',borderRadius:'5px',
                                                        outline:'none',color:'#fff',fontSize:'20px',border:'0',margin:'30px 0 0 120px'}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports=Login;
