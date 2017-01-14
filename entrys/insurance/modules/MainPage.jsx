/**
 * Created by douxiaobin on 2016/10/29.
 */
import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router'
import Carousel from './Carousel.jsx';
import NewsList from '../../../components/basic/News.js';
import Nav from '../component/Navigator.jsx';
import NewsInfo from '../modules/News.jsx';
import MENU from '../data/menus.json';
import Footer from '../component/Footer.jsx';

import '../../../css/insurancems/components/MainPage.css';
import '../../../css/insurancems/components/Product.css';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var MainPage=React.createClass({

    getInitialState: function() {
        return {hasData:null, data:null}
    },

    clickCb:function(data,detail,contentMapping){
        this.setState({data:data,hiddenInfo:detail,contentMapping:contentMapping,isEnter:true})
    },

    initialData:function() {
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:"groupNewsReactPage",
            reactActionName:"getInsuranceNewsList"
        };

        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(response) {
                var data;
                if(Object.prototype.toString.call(response)!='[object Array]')
                    if(response.data!==undefined&&response.data!==null)
                        if(Object.prototype.toString.call(response.data)=='[object Array]')
                            data=response.data;
                        else
                            data=response;
                this.setState({data: data});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    render:function(){
        let mainContent;

        if(this.state.data!==undefined && this.state.data!==null){
            mainContent=
                <div className='MainPage'>
                    <Nav logo={window.App.getResourceDeployPrefix()+"/images/logo.png"} data={MENU} />

                    <div style={{marginTop:'1px'}}>
                        <Carousel />
                    </div>

                    <div className='container' style={{position:'static'}}>
                        <div className='row'>
                            <Link to={window.App.getAppRoute()+"/lifeInsurance"}>
                                <div className="col-sm-4" style={{padding:'20px',paddingRight:'0px'}}>
                                    <a  className="featured-grid" style={{height:'330px',border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_6.png)'}}>
                                        <div className="desc">
                                            <h3>寿险</h3>
                                            <span>Web Design</span>
                                        </div>
                                    </a>
                                </div>
                            </Link>

                            <div className="col-sm-4" style={{padding:'20px'}}>
                                <div style={{padding:'10px',border:'1px solid ',height:'330px'}}>
                                        <div style={{marginTop:'10px',position:'relative'}}>
                                            <span style={{display:'inline-block',fontSize:'1.3em'}}>新闻资讯</span>

                                            <Link to={window.App.getAppRoute()+"/news"}>
                                                <span style={{display:'inline-block',position:'absolute',right:'10%',fontSize:'1.3em'}}>more</span>
                                            </Link>

                                        </div>
                                        <div style={{marginTop:'20px'}}>
                                            <NewsList
                                                data={this.state.data}
                                                clickCb={this.clickCb}
                                                />
                                        </div>
                                    <div style={{marginTop:'20px'}}></div>
                                </div>
                            </div>
                            <Link to={window.App.getAppRoute()+"/carInsurance"}>
                                <div className="col-sm-4" style={{padding:'20px',paddingLeft:'0px'}}>
                                    <a className="featured-grid featured-grid-2" style={{height:'330px',border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_2.png)'}}>
                                        <div className="desc">
                                            <h3>车险</h3>
                                            <span>Application</span>
                                        </div>
                                    </a>
                                </div>
                            </Link>
                            </div>

                        </div>
                        <div className="footer" style={{width:'100%',height:'15%',background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%'}}>
                            <Footer/>
                    </div>
                </div>
        }else{
            this.initialData();
        }

        if(this.state.isEnter!=undefined && this.state.isEnter!=null){
            return(
                <NewsInfo
                    data={this.state.data}
                    auto={true}
                    hiddenInfo={this.state.hiddenInfo}
                    contentMapping={this.state.contentMapping}
                    display="content"
                    />
            );
        }

        return(
            <div>
                {mainContent}
            </div>
        );
    }
});
module.exports=MainPage;
/**
 * Created by douxiaobin on 2016/10/27.
 */

