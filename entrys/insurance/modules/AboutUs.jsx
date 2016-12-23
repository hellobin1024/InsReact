/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';

var AboutUs=React.createClass({
    onClick:function(ob){

    },
    render:function(){

        return(

            <div className="about" style={{background:'#CCCCCC'}}>
                 <div className="about-text">
                     <p style={{marginTop:'20px',textAlign:'center',fontSize:'2.5em'}}>
                         关于我们
                     </p>
                 </div>
                 <div style={{position:'fixed',bottom:'0',width:'100%',textAlign:'center'}}>
                    <img src={App.getResourceDeployPrefix()+"/images/aboutUs_01.png"} style={{background:'no-repeat',backgroundSize:'100%',width:'100%'}}/>
                 </div>

                 <div style={{position:'fixed',top:'104px',left:'20%',width:'60%',height:'60%'}}>
                     <img src={App.getResourceDeployPrefix()+"/images/aboutUs_06.png"} style={{background:'no-repeat',backgroundSize:'100%',width:'100%'}}/>
                     <div style={{position:'absolute',width:'71%',height:'100%',zIndex:'2',left:'15%',top:'8%',fontSize:'1.5em',color:'#fff'}}>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;百度（纳斯达克：BIDU），全球最大的中文搜索引擎、最大的中文网站。
                         1999年底,身在美国硅谷的李彦宏看到了中国互联网及中文搜索引擎服务的巨大发展潜力，抱着技术改变世界的梦想，
                         他毅然辞掉硅谷的高薪工作，携搜索引擎专利技术，于 2000年1月1日在中关村创建了百度公司。
                         “百度”二字,来自于八百年前南宋词人辛弃疾的一句词：众里寻他千百度。这句话描述了词人对理想的执着追求。
                         百度拥有数万名研发工程师，这是中国乃至全球最为优秀的技术团队。这支队伍掌握着世界上最为先进的搜索引擎技术，
                         使百度成为中国掌握世界尖端科学核心技术的中国高科技企业，也使中国成为美国、俄罗斯、和韩国之外，全球仅有的4个拥有搜索引擎核心技术的国家之一。
                     </div>
                 </div>
            </div>
        );
    }
});
module.exports=AboutUs;
/**
 * Created by douxiaobin on 2016/10/27.
 */
