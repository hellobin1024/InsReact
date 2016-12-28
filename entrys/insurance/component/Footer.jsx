/**
 * Created by douxiaobin on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/homepage.css';

var Footer=React.createClass({
    onClick:function(ob){

    },
    render:function(){

        return(
            <div>
                <p className="bottom" style={{fontSize:'1.1em', display:'block', float:'left', color:'#C0C0C0',margin:'5px 0 0 20%'}}>
                    联系电话：053-181188593
                </p>
                <p className="bottom" style={{fontSize:'1.1em', color:'#C0C0C0',margin:'5px 0px 0 60%'}}>
                    联系邮箱：xxxxxxx@qq.com
                </p>
                <p className="bottom" style={{fontSize:'1.1em', color:'#C0C0C0',marginTop:'20px',margin:'5px 0px 0 20%'}}>
                    地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：济南高新区舜华路1500号，邮编:250101
                </p>

            </div>
        );
    }
});
module.exports=Footer;
/**
 * Created by douxiaobin on 2016/10/27.
 */
