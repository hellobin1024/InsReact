import React from 'react';
import {render} from 'react-dom';
import '../../../css/components/compounds/password/PasswordElement.css';


/**
 * Bootstrap
 */
var Password=React.createClass({
    commitCb:function(evt){
        //validate newPwd
        var valueBinding=this.state.valueBinding;
        if(valueBinding["enterNewPwd"]!==valueBinding["enterRepeatNewPwd"])
        {
            alert("两次输入的密码有误,请重新输入");
            return;
        }
        //validate oldPwd

        var form=document.getElementsByName("passwordForm")[0];
        form.submit();
    },
    handleChange:function(evt){
        var value=evt.target.value;
        var name=evt.target.name;
        var valueBinding=this.state.valueBinding;
        valueBinding[name]=value;
        this.setState({valueBinding});
    },
    getInitialState:function() {
        //twSpan,代表通过计算获得的表宽,不设置即为2
        var twSpan;
        if(this.props.twSpan!==undefined&&this.props.twSpan!==null)
            twSpan=this.props.twSpan;
        else
            twSpan=2;

        var valueBinding=new Object();
        return ({twSpan:twSpan,valueBinding:valueBinding})
    }
    ,
    render:function(){



        //表头标题
        var title;
        if(this.props.title!==undefined&&this.props.title!==null)
        {
            title=(<tr><td colSpan={this.state.twSpan} style={{textAlign:"center"}}>{this.props.title}</td></tr>);
        }



        var inputFields;
        var tdStyle_f={width:"40%"};
        var tdStyle_b={width:"50%"};
        var content;
        inputFields=new Array();
        if(this.props.inputFields!==undefined&&this.props.inputFields!==null)
        {
            content=this.props.inputFields;
        }else {
             content=[
                {
                field:"旧密码:",name:"enterOldPwd"
                },
                {
                        field:"输入新密码:",name:"enterNewPwd",contract:"密码长度最大为12位"
                },
                {
                    field:"重复输入新密码:",name:"enterRepeatNewPwd",contract:"密码长度最大为12位"
                }];
        }
        //遍历inputFields,拿到所需填写的字段和填写该字段所需满足的规则
        var handleChange=this.handleChange;
        content.map(function(item,i) {
            var contract;
            if(item.contract!==undefined&&item.contract!==null)
            {
                var contract_content="*(";
                contract_content+=item.contract;
                contract_content+=")";
                contract=(<span style={{color:"#f00"}}>{contract_content}</span>)
            }

            inputFields.push(
                <tr key={i}>
                    <td style={tdStyle_f}>{item.field}</td>
                    <td style={tdStyle_b}>
                        <input type="password" name={item.name} onChange={handleChange}/>
                        {contract}
                    </td>

                </tr>
            )
        });
        //buttons
        var buttons;
        buttons=(<tr><td colSpan={this.state.twSpan} style={{textAlign:"center"}}>
            <button className="btn btn-default"  onClick={this.commitCb}>提交</button>
            <button className="btn btn-default"  type="reset">重置</button>
        </td></tr>)
        var hightLight = this.props.highLight;
        var gradient = this.props.gradient;
    return (
        <form name="passwordForm"
              className={"form password "+(hightLight!==undefined&&hightLight!==null?"highLight":gradient!==undefined&&gradient!==null?"gradient":"")}
              method="post" action={this.props.action}
              style={{margin:"20px",width:"1024px",marginLeft:"auto",marginRight:"auto"}}>
            <div className="row">
                <div className="col-lg-12">
                        <table className="table table-bordered center">
                            <thead>
                            {title}
                            </thead>
                            <tbody>
                            {inputFields}
                            </tbody>
                            <tfoot className="foot">
                            {buttons}
                            </tfoot>
                        </table>
                </div>
            </div>
        </form>);
    }
})

module.exports = Password