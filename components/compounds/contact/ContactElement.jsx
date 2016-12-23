import React from 'react';
import {render} from 'react-dom';
import '../../../css/components/compounds/contact/ContactElement.css';

/**
 * Bootstrap
 */
var Contact=React.createClass({

    commitCb:function(evt){

    },
    handleChange:function(evt){

    },
    getInitialState:function(){
        var td$complete;
        if(this.props["td-complete"]!==undefined&&this.props["td-complete"]!==null)
            td$complete=this.props["td-complete"];


        return ({td$complete:td$complete});
    },
    render:function() {




        var inputFields;
        var content;
        inputFields=new Array();
        if(this.props.inputFields!==undefined&&this.props.inputFields!==null)
        {
            content=this.props.inputFields;
        }else {
             content=[
                {
                    set: [{field: "联系电话", name: "perTelephone"}, {field: "联系电话", name: "mobilephone"}]
                }
                ,
                {
                    set:[{field:"QQ号",name:"qq"},{field:"MSN",name:"msn"}]
                }
                ,
                {
                    set:[{field:"电子邮件",name:"email"},{field:"邮政编码",name:"perPostalCode"}]
                }
                ,
                {
                    set:[{field:"通讯地址",name:"perAddress"}]
                }
            ]
        }
        //遍历inputFields,拿到所需填写的字段和名称
        //在遍历中计算表的宽度
        var maxCols=2;
        var handleChange=this.handleChange;
        var td$complete=this.state.td$complete;
        content.map(function(row,i) {
            var item=row.set;
            var tds=new Array();
            var td$index=0;

            var col=0;
            item.map(function(sim,j) {
                if(sim.col!==undefined&&sim.col!==null)
                    col+=sim.col;
                else
                    col+=2;
                tds.push(
                    <td key={td$index++}>
                        {sim.field}
                    </td>);
                if(j==item.length-1)
                {
                    //将最大的列宽赋值给maxCols
                    if(col>=maxCols)
                        maxCols=col;

                    if(col<maxCols&&td$complete==true)
                    {
                        tds.push(<td key={td$index++} colSpan={maxCols-col+1}>
                            <input type="password" name={sim.name} onChange={handleChange}/>
                        </td>)
                    }else{
                        tds.push(<td key={td$index++}>
                            <input type="password" name={sim.name} onChange={handleChange}/>
                        </td>)
                    }
                }
                else{
                    tds.push(<td key={td$index++}>
                        <input type="password" name={sim.name} onChange={handleChange}/>
                    </td>)
                }
            });
            inputFields.push(<tr key={i}>
                {tds}
            </tr>)

        });


        //表头标题
        var title;
        if(this.props.title!==undefined&&this.props.title!==null)
        {
            title=(<tr><td colSpan={maxCols} style={{textAlign:"center"}}>{this.props.title}</td></tr>);
        }



        //buttons
        var buttons;
        buttons=(<tr><td colSpan={maxCols} style={{textAlign:"center"}}>
            <button className="btn btn-default"   type="submit">提交</button>
        </td></tr>)



        return(<form name="passwordForm" className="form" method="post" action={this.props.action} style={{margin:"20px"}}>
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
        </form>)

    }
})

    export default Contact