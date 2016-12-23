import React from 'react';
import ListElement from '../basic/ListElement.jsx';

var ContractElement=React.createClass({
    applyHandle:function(ob){
        if(ob!==undefined&&ob!==null) {
            if(this.props.type=='text')//当契约为文本类型时,认定用户就文本型列表进行选择
            {
                var index = ob.index;
                var record = this.state.contract[index];
                //将记录回传
                if (this.props.opHandle !== undefined && this.props.opHandle !== null)
                    this.props.opHandle(record);

            }

        }
    },
    cancelHandle:function()
    {
        if(this.props.opHandle!==undefined&&this.props.opHandle!==null)
            this.props.opHandle();
    },
    getInitialState:function() {

        var contract;
        if(this.props.contract !== undefined && this.props.contract !== null) {
            contract = this.props.contract;
        }
        var type;
        if(this.props.type!==undefined&&this.props.type!==null&&this.props.type!=="none")
            type=this.props.type;
        return {contract: contract,type:type};
    }
    ,
    render:function(){
        if(this.state.type!==undefined&&this.state.type!==null)
        {
            if(this.state.type=='text')
            {
                //如果契约类没有数据
                if(this.state.contract==undefined||this.state.contract==null)
                {
                    return (
                        <div>
                            <button className="btn btn-default" onClick={this.props.opHandle}>返回</button>
                        </div>);
                }
                var components=[
                    {type:"apply",name:"添加"},
                    {type:"cancel",name:"返回"}
                ];
                var list=new Array();
                this.state.contract.map(function(item,i) {
                    var content="";
                  for(var field in item)
                  {
                      content+=field+":"+item[field]+"\n";
                  }
                    list.push(content);
                });

                var data$options={
                    components:components,
                    params:list
                }
                return (
                    <div>
                    <ListElement  data-options={data$options} applyCb={this.applyHandle}
                        cancelCb={this.cancelHandle}/>
                        </div>
                );

            }
        }else{
            return (
                <div>
                    <button className="btn btn-default" onClick={this.props.opHandle}>返回</button>
                </div>);
        }


    }
});

export default ContractElement;