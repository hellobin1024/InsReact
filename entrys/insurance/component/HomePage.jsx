/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import { Link } from 'react-router'
import '../../../css/insurancems/components/homepage.css';
import Footer from '../component/Footer.jsx';

var HomePage=React.createClass({

    render:function(){

            return(

            <div className='container'
                 style={{paddingLeft:'0px',position:'absolute',width:'100%',top:'0',height:'92%',background:'url('+App.getResourceDeployPrefix()+'/images/background.png) no-repeat',backgroundSize:'100%'}}>
                <div className="in-container">
                    <div className="topAndCenter">
                        <div className="topMain" style={{position:'relative',margin:'30px auto auto 20px'}}>
                        <span style={{display:'inline-block', fontSize:'2em', fontWeight:'bold'}}>
                             <h2 style={{fontSize:'1.5em', fontWeight:'bold'}}>山东泓信信息股份有限公司</h2>
                        </span>
                            <div className='enterHomePage'
                                 style={{display: 'inline-block',height: '100%',position: 'absolute',right: '10%',top: '30%',cursor:'pointer'}}>
                                <img src={App.getResourceDeployPrefix()+"/images/enterHomePage.png"} style={{maxHeight:'23px'}}/>
                            <span style={{fontSize:'1.4em',verticalAlign:'middle'}} >

                                <Link to={window.App.getAppRoute()+"/mainPage"}>进入主页</Link>

                            </span>
                            </div>
                        </div>
                        <div style={{width:'100%',minHeight:'400px',position:'relative'}}>
                            <div className='grid' style={{right: '18%',position: 'absolute',top: '85%'}}>
                                <ul style={{listStyle:'none'}}>
                                    <li style={{float:'left',marginRight:'50px'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/iosQRCode.jpg"} />
                                    </span>
                                        <div style={{textAlign:'center'}}>
                                            <a
                                                type="button"
                                                className=""
                                                href={App.getDownloadDeployDeployPrefix() + "/downloads/android-release-unaligned.apk"}
                                                style={{width:'100%',fontSize:'18px'}}
                                                >iPhone 下载
                                            </a>
                                        </div>
                                    </li>

                                    <li style={{float:'left'}}>
                                    <span style={{display:'block',marginBottom:'20px'}}>
                                        <img src={App.getResourceDeployPrefix()+"/images/androidQRCode.jpg" }/>
                                    </span>
                                        <div style={{textAlign:'center'}}>
                                            <a
                                                type="button"
                                                className=""
                                                href={App.getDownloadDeployDeployPrefix() + "/downloads/android-release-unaligned.apk"}
                                                style={{width:'100%',fontSize:'18px'}}
                                                > Android 下载
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer"
                     style={{background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%',
                        position:'fixed',bottom:'0',width:'100%',height:'8%'}}>
                    <Footer/>
                </div>
            </div>

            );
    }
});
module.exports=HomePage;
