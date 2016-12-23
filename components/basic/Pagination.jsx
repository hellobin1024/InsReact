import React from 'react';
import {render} from 'react-dom';

var Pagination=React.createClass({
    getInitialState:function(){
        var perSize=40;
        if(this.props.perSize!==undefined&&this.props.perSize!==null)
            perSize=this.props.perSize;

        var size=0;
        if(this.props.size!==undefined&&this.props.size!==null)
            size=this.props.size;
        return({activePage:1,perSize:perSize,size:size});
    },
    pageCb:function(evt){
        var target=evt.target;
        var $target=$(target);
        var index=$target.attr("data-index");
        if(index!==undefined&&index!==null&&!isNaN(parseInt(index)))
        {

            var pages=$(this.refs["pages"]).find("li.active");
            for(var i=0;i<pages.length;i++)
            {
                $(pages[i]).removeClass("active");
            }
            var selectedP = $(this.refs["pages"]).find("li")[index];
            $(selectedP).addClass("active");

            this.setState({selected:parseInt(index)});
            var ob=new Object();
            ob.selected=parseInt(index);
            ob.perSize=this.state.perSize;
            if(this.props.pageCb!==undefined&&this.props.pageCb!==null)
                this.props.pageCb(ob);
        }

    },
    componentWillReceiveProps:function(props)
    {
        var op=new Object();
        if(props.perSize!==undefined&&props.perSize!==null)
            op.perSize=props.perSize;
        if(props.size!==undefined&&props.size!==null)
            op.size=props.size;
        this.setState(op);
    },
    render:function(){

        if(this.state.size!==undefined&&this.state.size!==null)
        {
            var lis=new Array();
            var total=Math.ceil(this.state.size/this.state.perSize);
            for(var i=0;i<total;i++)
            {
                if(i==this.state.selected)
                    lis.push(<li key={i} className="active">
                        <a role="button" onClick={this.pageCb} data-index={i}>{i+1}</a>
                    </li>);
                else
                    lis.push(<li key={i}>
                        <a role="button" onClick={this.pageCb} data-index={i}>{i+1}</a>
                    </li>);
            }
        }

        return (
            <div>
                <ul className="pagination pagination-lg" ref="pages" style={{marginLeft:"50%"}}>
                    {lis}
                </ul>
            </div>
        );
    }
});
export default Pagination;