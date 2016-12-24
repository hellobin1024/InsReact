/**
 * Created by douxiaobin on 2016/10/29.
 */
import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router'
import Carousel from './Carousel.jsx';
import News from '../../../components/basic/News.js';
import Nav from '../component/Navigator.jsx';
import MENU from '../data/menus.json';
import '../../../css/insurancems/components/MainPage.css';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var MainPage=React.createClass({

    getInitialState: function() {
        return {hasData:null, data:null}
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
            function(ob) {
                var data=ob.data[0]; //只有一种类型的新闻，取第一个
                this.setState({data: data});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    render:function(){
        let mainContent;
        let data;
        let newsList;
        let title=[];
        let date=[];



        if(this.state.data!==undefined && this.state.data!==null){
            data = this.state.data;
            newsList = data.newsList;
            newsList.map(function (item, i) {
                title.push(item.title);
                date.push(item.newsTimeStr);
            });

            mainContent=
                <div className='MainPage'>
                    <Nav logo={App.getResourceDeployPrefix()+"/images/logo.png"} data={MENU} splitIntoBranch={this.splitIntoBranch}/>

                    <div style={{marginTop:'1px'}}>
                        <Carousel />
                    </div>

                    <div className='container' style={{position:'static'}}>
                        <div className='row'>
                            <div className="col-sm-4" style={{padding:'20px'}}>
                                <div className="desc" style={{height:'330px',border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_6.png)',backgroundSize:'100%'}}>
                                    <h3>寿险</h3>
                                    <span>Web Design</span>
                                </div>
                            </div>

                            <div className="col-sm-4" style={{padding:'20px'}}>
                                <div style={{padding:'10px',border:'1px solid ',height:'330px'}}>
                                    <Link to={window.App.getAppRoute()+"/news"}>

                                        <div style={{marginTop:'20px',position:'relative'}}>
                                            <span style={{display:'inline-block',fontSize:'1.2em'}}>新闻资讯</span>
                                            <span style={{display:'inline-block',position:'absolute',right:'10%'}}>NEWS</span>
                                        </div>
                                        <div style={{marginTop:'20px'}}>
                                            <News
                                                data={[
                                                        {text:title[0],date:date[0]},
                                                        {text:title[1],date:date[1]},
                                                        {text:title[2],date:date[2]},
                                                        {text:title[3],date:date[3]},
                                                        {text:title[4],date:date[4]},
                                                        {text:title[5],date:date[5]}
                                                    ]}
                                                />
                                        </div>

                                    </Link>
                                    <div style={{marginTop:'20px'}}></div>
                                </div>
                            </div>

                            <div className="col-sm-4" style={{padding:'20px'}}>
                                <div className="desc" style={{height:'330px',border:'#e1e1e1 1px solid',boxShadow:'0px 3px 11px #737373',backgroundImage: 'url('+App.getResourceDeployPrefix()+'/images/image_2.png)',backgroundSize:'100%'}}>
                                    <h3>车险</h3>
                                    <span>Application</span>
                                </div>
                            </div>

                        </div>
                        <div className="footer"
                             style={{width:'100%',height:'15%',background:'url('+App.getResourceDeployPrefix()+'/images/footer.png) no-repeat',backgroundSize:'100%'
                        }}>
                            <p className="bottom" style={{color:'#fff',marginTop:'20px',textAlign:'center'}}>
                                欢迎来到捷惠宝
                            </p>
                        </div>
                        </div>
                </div>
        }else{
            this.initialData();
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

