/**
 * Created by douxiaobin on 2016/10/29.
 */
import React from 'react';
import { render } from 'react-dom';
import Carousel from './Carousel.jsx';
import News from '../../../components/basic/News.js';
import Nav from '../component/Navigator.jsx';
import MENU from '../data/menus.json';
import '../../../css/insurancems/components/MainPage.css';

var MainPage=React.createClass({

    render:function(){
        return(
            <div className='MainPage'>
                <Nav logo={App.getResourceDeployPrefix()+"/images/logo.png"} data={MENU} splitIntoBranch={this.splitIntoBranch}/>

                <div style={{marginTop:'1px'}}>
                    <Carousel />
                </div>

                <div className='container' style={{position:'static'}}>
                    <div className='row'>
                        <div className="col-sm-4" style={{padding:'20px'}}>
                            <div style={{textAlign:'center',padding:'10px',background:'url('+App.getResourceDeployPrefix()+'/images/background_1.png) no-repeat',backgroundSize:'100%'}}>
                                <div style={{marginTop:'20px'}}>
                                    <h3>财产险</h3>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <h4>企业    个人</h4>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <h5>车险    意外伤害保险    其他</h5>
                                    <h5>家庭财产损失险</h5>
                                </div>
                                <div style={{marginTop:'90px'}}>
                                    <button type="button" className="btn btn-default">

                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4" style={{padding:'20px'}}>
                            <div style={{textAlign:'center',padding:'10px',background: 'rgb(142, 246, 216)'}}>
                                <div style={{marginTop:'20px'}}>
                                    <h3>寿险</h3>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <h4>企业    个人</h4>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <h5>团体健康险    企业年金</h5>
                                    <h5>团体意外伤害保险</h5>
                                </div>
                                <div style={{marginTop:'90px'}}>
                                    <button type="button" className="btn btn-default">

                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4" style={{padding:'20px'}}>
                            <div style={{padding:'10px',border:'1px solid '}}>
                                <div style={{marginTop:'20px',position:'relative'}}>
                                    <span style={{display:'inline-block',fontSize:'1.2em'}}>新闻资讯</span>
                                    <span style={{display:'inline-block',position:'absolute',right:'10%'}}>NEWS</span>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <News
                                        data={[
                                        {text:'保险新闻1',date:'2016-10'},
                                        {text:'保险新闻2',date:'2016-10'},
                                        {text:'保险新闻3',date:'2016-11'},
                                        {text:'保险新闻4',date:'2016-11'},
                                        {text:'保险新闻5',date:'2016-12'},
                                        {text:'保险新闻6',date:'2016-12'}
                                        ]}
                                        />
                                </div>
                                <div style={{marginTop:'20px'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container' style={{position:'static',background:'#5e6d73',color: 'rgba(255, 255, 255, 0.7)'}}>
                    <div className='row' style={{padding:'10px',textAlign:'center',background:'url('+App.getResourceDeployPrefix()+'/images/problemBackground.png) no-repeat',backgroundSize:'100%'}}>
                        <div style={{marginTop:'30px'}}>
                            <h3>联系我们</h3>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <span>让我们知道你的反馈和问题</span>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <input
                                style={{width:'38%',padding:'10px',background:'transparent',border:'1px solid'}}
                                type="text"
                                defaultValue="姓名..."
                                name='name'
                                required=""/>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <input
                                style={{width:'38%',padding:'10px',background:'transparent',border:'1px solid'}}
                                type="text"
                                defaultValue="邮箱..."
                                name='email'
                                required=""/>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <textarea
                                style={{minHeight:'150px',width:'38%',padding:'10px',background:'transparent',border:'1px solid #fff'}}
                                name='message'
                                type="text"
                                defaultValue='内容...'
                                >
                            </textarea>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <button
                                type="button"
                                className="btn btn-danger"
                                style={{width:'18%'}}
                                >
                               <span>
                                   <i className="fa fa-paper-plane" aria-hidden="true"></i>
                               </span>
                                发送
                            </button>
                        </div>
                    </div>
                </div>

                <div className='container' style={{position:'static',marginBottom:'80px'}}>
                    <div className='row' style={{padding:'10px',marginTop:'40px'}}>
                        <div className='fleft' style={{width:'60%',marginLeft:'10%'}}>
                            <div>http://www.topwellsoft.com</div>
                            <div>地址:....</div>
                            <div>电话:0531-88690770</div>
                            <div>E-mail:...</div>
                        </div>
                        <div className='fright' style={{width:'30%'}}>
                            <ul>
                                <li>
                                    <span><i className="fa fa-facebook" aria-hidden="true"></i></span>
                                </li>
                                <li>
                                    <span><i className="fa fa-twitter" aria-hidden="true"></i></span>
                                </li>
                                <li>
                                    <span><i className="fa fa-twitter" aria-hidden="true"></i></span>
                                </li>
                                <li>
                                    <span><i className="fa fa-tencent-weibo" aria-hidden="true"></i></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports=MainPage;
/**
 * Created by douxiaobin on 2016/10/27.
 */

