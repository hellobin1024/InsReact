/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';

var Footer=React.createClass({
    onClick:function(ob){

    },
    render:function(){

        return(
            <div>
                <span className="bottom" style={{fontSize:'1.1em', display:'block', float:'left', color:'#C0C0C0',marginLeft:'20%'}}>
                    联系电话：053-181188593
                </span>
                <span className="bottom" style={{fontSize:'1.1em', color:'#C0C0C0', paddingLeft:'10%'}}>
                    地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：济南市高新区汇展西路88号
                </span>
                <span className="bottom" style={{fontSize:'1.1em', color:'#C0C0C0', paddingLeft:'10%'}}>
                    联系邮箱：xxxxxxx@qq.com
                </span>
            </div>
        );
    }
});
module.exports=Footer;
/**
 * Created by douxiaobin on 2016/10/27.
 */
