/**
 * Created by dell on 2016/10/27.
 */
import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/Business.css';

var ProxyQ = require('../../../components/proxy/ProxyQ');

var Navigator=React.createClass({
    previousCb:function () {
        var pageBegin = this.state.pageBegin;
        var pageEnd = this.state.pageEnd;
        var threshold = this.state.threshold;
        var pageCategory = this.state.pageCategory;
        var pageIndex = null;
        var newPageBegin = null;
        if(pageBegin!==undefined && pageBegin!==null && pageEnd!==undefined && pageEnd!==null &&
            pageCategory!==undefined && pageCategory!==null && threshold!==undefined && threshold!==null){
            if(pageEnd<=pageCategory){ //当前为1至pageCategory页时则无法往前跳
                return;
            }
            newPageBegin = pageBegin-pageCategory; //新的页面下标
            pageEnd = newPageBegin+pageCategory-1;
            pageIndex = newPageBegin-1;

            var isChange = true;
            this.props.previousCb(pageIndex,isChange);
        }
    },

    nextCb:function(){
        var pageEnd = this.state.pageEnd;
        var threshold = this.state.threshold;
        var capacity = this.state.capacity;
        var pageCategory = this.state.pageCategory;
        var pageIndex = null;
        var pageBegin;
        var pageIntegral= null;
        if(pageEnd!==undefined && pageEnd!==null && capacity!==undefined && capacity!==null
            && threshold!==undefined && threshold!==null && pageCategory!==undefined && pageCategory!==null){
            pageIntegral= Math.ceil(capacity/threshold); //页数

            if(pageEnd<pageIntegral){ //pageEnd后面还有页数
                pageBegin = pageEnd+1;
                if (pageIntegral-pageEnd+1 > pageCategory) { //剩余页数大于pageCategory个页
                    pageEnd = pageBegin + pageCategory - 1;
                } else { //小于pageCategory个页
                    pageEnd = pageIntegral;
                }
                pageIndex = pageBegin-1;
                var isChange = true;
                this.props.nextCb(pageIndex,isChange);
            }
        }
    },

    pageCb:function(index){
        //调用方提供的分页实现
        var isChange = false;
        this.props.pageCb(index,isChange);
        this.setState({pageIndex:index});
    },

    getInitialState:function(){
        let capacity=null;
        if(this.props.capacity!==undefined&&this.props.capacity!==null)
            capacity=this.props.capacity;

        let threshold=5; //每页显示的订单数量
        if(this.props.threshold!==undefined&&this.props.threshold!==null)
            threshold=this.props.threshold;
        let pageIndex=0;
        if(this.props.pageIndex!==undefined&&this.props.pageIndex!==null)
            pageIndex=this.props.pageIndex;
        //TODO:calculate begin and end
        let begin=0;
        let end=0;
        //一次显示5个page按钮
        let pageCategory=5;
        if(this.props.pageCategory!==undefined&&this.props.pageCategory!==null)
            pageCategory=this.props.pageCategory;
        let pageBegin=1;
        let pageEnd=null;
        if(capacity!=null) {
            let pageIntegral=Math.ceil(capacity/threshold); //页数
            //let pageRemainder=capacity%threshold;
            if(pageIntegral>pageCategory){ //大于pageCategory个页
                pageEnd=pageBegin+pageCategory-1;
            }else{ //小于pageCategory个页
                pageEnd=pageIntegral;
            }
        }

        return ({capacity:capacity,threshold:threshold,pageCategory:pageCategory,pageIndex:pageIndex,
            pageBegin:pageBegin,pageEnd:pageEnd});
    },

    componentWillReceiveProps:function(props) {
        let capacity = null;
        let threshold = 5;
        let pageIndex = null;
        let isChange = null;
        if (props.capacity !== undefined && props.capacity !== null)
            capacity = props.capacity;
        if (props.threshold !== undefined && props.threshold !== null)
            threshold = props.threshold;
        if (props.pageIndex !== undefined && props.pageIndex !== null)
            pageIndex = props.pageIndex;
        if (props.isChange !== undefined && props.isChange !== null)
            isChange = props.isChange;
        let pageCategory = this.state.pageCategory; //一次显示8个page按钮
        let pageBegin= this.state.pageBegin; //取原来的数据
        let pageEnd = this.state.pageEnd;

        if (capacity != null) {
            if(isChange!==undefined && isChange!==null && isChange==true){ //是否更改页号列表
                let pageIntegral=Math.ceil(capacity/threshold); //页数

                pageBegin = props.pageIndex+1; //接收父组件传下来的值,pageIndex是下一个页号列表的起始值

                if (pageIntegral-pageBegin+1 > pageCategory) { //大于pageCategory个页
                    pageEnd = pageBegin + pageCategory - 1;
                } else { //小于pageCategory个页
                    pageEnd = pageIntegral;
                }
            }else{
                if(pageIndex==0){ //pageIndex为0 页号则从1开始，否则与上次一样
                    pageBegin = 1;
                }
                let pageIntegral=Math.ceil(capacity/threshold); //页数
                if(pageIntegral-pageBegin+1 > pageCategory){ //大于pageCategory个页
                    pageEnd=pageBegin + pageCategory-1;
                }else{ //小于pageCategory个页
                    pageEnd=pageIntegral;
                }
            }
        }

        this.setState({capacity:capacity,threshold:threshold,pageCategory:pageCategory,pageIndex:pageIndex,
            pageBegin:pageBegin,pageEnd:pageEnd});
    },

    render:function(){

        let navigator=null;

        if(this.state.pageBegin!==undefined&&this.state.pageBegin!==null&&this.state.pageEnd!==undefined&&this.state.pageEnd!==null)
        {
            let lis=[];
            lis.push(<li key={-1} style={{marginLeft:'8px'}}><a onClick={this.previousCb}>&laquo;</a></li>);
            for(let i=this.state.pageBegin;i<=this.state.pageEnd;i++)
            {
                if(i==this.state.pageIndex+1){
                    lis.push(<li key={i} style={{marginLeft:'8px'}}><a onClick={this.pageCb.bind(this,i-1)} style={{color:'#000000'}}>{i}</a></li>);
                }
                else{
                    lis.push(<li key={i} style={{marginLeft:'8px'}}><a onClick={this.pageCb.bind(this,i-1)}>{i}</a></li>);
                }
            }
            lis.push(<li key={-2} style={{marginLeft:'8px'}}><a onClick={this.nextCb}>&raquo;</a></li>);
           navigator=
               <ul className="pagination">
                   {lis}
               </ul>;
        }else{
        }


        return (
            <div className='Navigator' ref='navigator' style={{textAlign:'center'}}>
                <div style={{position:'static'}}>
                    <div className='pagination' style={{padding:'10px 10px 0px 10px'}}>
                        {navigator}
                    </div>
                </div>
            </div>);
    }
});
module.exports=Navigator;
