import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/NewQuestion.css';
import Consultation from '../modules/Consultation.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');

var NewQuestion=React.createClass({

    getInitialState: function() {
        return {

           nav:'main'


        }
    },
    onSaveInput:function(event){

            this.setState({theme: event.target.value});

    },
    saveOrUpdateQuestion:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'saveOrUpdateInsuranceProblem',
            theme:this.state.theme
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                if(ob.data=='success'){
                    var successModal = this.refs['successModal'];
                    $(successModal).modal('show');
                }else{

                }

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    setNav: function() {

            this.setState({nav: 'consultation'});

    },
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

    render:function() {
        var container=null;


                switch (this.state.nav) {
                    case 'main':
                        container=
                            <div>
                                <div className='search-area-wrapper'>
                                    <div className='search-area '>
                                        <h3 className='search-header'>提出您的新问题</h3>

                                        <p className='search-tag-line'>
                                            如果没有搜索到您需要的问题，请再次进行提问然后等待回答！
                                        </p>
                                    </div>
                                </div>
                                <div className="page-container">
                                    <div className="container">
                                        <div className="row">
                                            <div className="span8 page-content">
                                                <article className="type-page hentry clearfix">
                                                    <h1 className="post-title">
                                                        <a href="#">您的问题</a>
                                                    </h1>
                                                    <hr></hr>
                                                    <p>如果您在刚刚的搜索中没有找到与您问题相符的问题及解决方案，您可以在此提交您自己的问题，我们的客服人员将会在三到五个工作日之内对您的问题进行解答，敬请谅解！</p>
                                                    <hr></hr>
                                            </article>
                                                <form  className="row"  method="post">
                                                    <div className="span2">
                                                        <label >问题/主题内容:<span>*</span> </label>
                                                    </div>
                                                    <div className="span6">
                                                        <textarea onChange={this.onSaveInput.bind(this)} name="message"  className="required span6" rows="6" title="* Please enter your message"></textarea>
                                                    </div>
                                                    <div className="span6 offset2 bm30">
                                                        <input onClick={this.saveOrUpdateQuestion}  value="Send Message" className="btn btn-inverse"/>
                                                    </div>
                                                    <div className="span6 offset2 error-container"></div>
                                                    <div className="span8 offset2" ></div>
                                                </form>
                                            </div>
                                            <aside className="span4 page-sidebar">
                                                <section className="widget" style={{position: 'fixed',marginLeft:'20%' ,height: '500px', width: '311px'}}>
                                                    <div className="support-widget">
                                                        <h3 className="title">业务支持</h3>
                                                        <p className="intro"> 如果您需要更多的业务支持，请与我们的客服取得联系！</p>
                                                        <hr/>
                                                        <h3 className="title">客服电话:</h3>
                                                        <p className="intro">231231</p>
                                                        <h3 className="title">客服邮箱:</h3>
                                                        <p className="intro">44444@163.com</p>
                                                        <hr/>
                                                        <h3 className="title">跳转支持</h3>
                                                        <hr/>
                                                        <a style={{cursor: 'pointer'}} onClick={this.Branch.bind(this,undefined)}>业务咨询</a>
                                                        <hr/>
                                                        <a style={{cursor: 'pointer'}} href=''>公司首页</a>
                                                        <hr/>
                                                    </div>
                                                </section>
                                            </aside>
                                        </div>
                                    </div>
                                </div>



                                <div className="modal fade bs-example-modal-sm login-container"
                                     tabIndex="-1"
                                     role="dialog"
                                     aria-labelledby="myLargeModalLabel"
                                     aria-hidden="true"
                                     ref='successModal'
                                    >
                                    <div className="modal-dialog modal-sm" style={{position:'absolute',top:'30%',width:'50%',marginLeft:'25%'}}>
                                        <div className="modal-content" style={{position:'relative',width:'100%',padding:'40px'}}>

                                            <div className="modal-body">
                                                <div className="form-group" style={{position:'relative'}}>
                                                    <div>{'问题已经提交，请耐心等待客服人员解答！'}</div>
                                                    <input className='search-new' value="OK"
                                                  onClick={this.Branch.bind(this,undefined)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>;
                        break;
                    case'consultation':
                        break;
                    default :
                        break;
                }
        return container;

    }
});
module.exports=NewQuestion;