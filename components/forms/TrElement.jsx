import React from 'react';
import TdWrapper from './wrapper/TdWrapper.jsx';
import CheckBoxElement from '../basic/CheckBoxElement.jsx';
/**
 * @author,danding001
 * @property,rowData(*)
 * @property,rowIndex(typeof *===number)
 * @property,isLineNumberVisible(true|false)
 * @property,multiEnable(false|number)
 * @example
 *
 */
var TrElement =React.createClass({
    checkCb:function(ob){
        if(this.props.checkCb!==undefined&&this.props.checkCb!==null) {
            if(this.props["data-index"]!==undefined&&this.props["data-index"]!==null)
            {
                var ob={rowIndex:this.props.rowIndex,index:this.props["data-index"]};
                this.props.checkCb(ob);
            }
            else
                this.props.checkCb(ob);
        }
    },
    opHandle:function(ob){
        var content=ob;
        if(this.props.opHandle!==undefined&&this.props.opHandle!==null)
        {
            var rowIndex=this.props.rowIndex;
            var data$index=this.props["data-index"];
            this.props.opHandle({rowIndex:rowIndex,"data-index":data$index,content:content});

        }
    },
    render:function(){
        //TODO:urgent config un-support
        //1.var dw=React.createClass(className,classProps,child1,child2,...,childN)

        //是否行号可见
        var isLineNumberVisible=this.props.isLineNumberVisible;
        //是否匀许多选
        var multiEnable=this.props.multiEnable;
        var tdBasic=this.props.tdBasic;
        var widths=this.props.widths;
        //分组类型设置
        var groupType;
        if(this.props.groupType!==undefined&&this.props.groupType!==null)
        {
            groupType=this.props.groupType;
        }
        //行数据设置
        var rowData=this.props.rowData;
        var tds;
        var tgroups;
        if(rowData!==null&&rowData!==undefined)
        {
            tds=new Array();
            if(groupType!==undefined&&groupType!==null)
                tgroups=new Array();
            var index=0;
            var rowSpan=0;
            if(this.props.rowSpan!==undefined&&this.props.rowSpan!==null&&this.props.rowSpan>=1)
                rowSpan=this.props.rowSpan;
            var updateFlag=this.props.updateFlag;
            for(var field in rowData)
            {
                var width=null;
                if(widths!==false&&widths!==undefined&&widths!==null&&index<widths.length)
                    width=widths[index];
                var item=rowData[field];
                if(item===false||item===true)
                    item=""+item;
                //exclude the group field
                if(groupType!==null&&groupType!==undefined&&groupType==field)
                {
                    if(updateFlag!==undefined&&updateFlag!==null&&updateFlag==true)
                    tgroups.push(<TdWrapper width={width} tdBasic={tdBasic}
                                            updateFlag={true}      tdData={item} multiEnable={multiEnable} key={index++} rowSpan={rowSpan}/>);
                }
                else{
                    tds.push(<TdWrapper   width={width} tdBasic={tdBasic}
                                          tdData={item} multiEnable={multiEnable} key={index++}/>);
                }
            }
        }
        else{
           tds=(<TdWrapper  tdBasic={tdBasic}
                             multiEnable={multiEnable} />)
        }


        //op$ele,
        //if parent component has pass op down,the op$ele will store the infomation
        var op$ele;
        if(this.props.op!==undefined&&this.props.op!==null)
        {
            op$ele=<TdWrapper  tdBasic={"op"} op={this.props.op}
                               multiEnable={1} opHandle={this.opHandle}/>
        }



        var tr$color;
        if(this.props["tr-color"]!==undefined&&this.props["tr-color"]!==null) {
            tr$color = {backgroundColor:this.props["tr-color"]};
        }
        //是否需要显示序号
        if(isLineNumberVisible===true)
        {
            if(this.props.insertCheck===true)
            {
                if(this.props.groupType!==undefined&&this.props.groupType!==null)
                {
                    return (<tr  style={tr$color} >
                            {tgroups}
                        <td>
                            <CheckBoxElement data-index={this.props.rowIndex} checkCb={this.checkCb} checked={this.props.checked}/>
                        </td>
                        <td>{this.props.rowIndex}</td>
                        {tds}
                        {op$ele}
                    </tr>);
                }else{
                    return (<tr  style={tr$color} >
                        <td>
                            <CheckBoxElement data-index={this.props.rowIndex} checkCb={this.checkCb} checked={this.props.checked}/>
                        </td>
                        <td>{this.props.rowIndex}</td>
                        {tds}
                        {op$ele}
                    </tr>);
                }

            }
            else{
                if(this.props.groupType!==undefined&&this.props.groupType!==null)
                {
                    return (<tr  style={tr$color} >
                        {tgroups}
                        <td>{this.props.rowIndex}</td>
                        {tds}
                        {op$ele}
                    </tr>);
                }else{
                    return (<tr  style={tr$color} >
                        <td>{this.props.rowIndex}</td>
                        {tds}
                        {op$ele}
                    </tr>);
                }

            }

        }else{
            if(this.props.insertCheck===true)
            {
                if(this.props.groupType!==null&&this.props.groupType!==undefined)
                {
                    return (<tr style={tr$color} >
                        {tgroups}
                        <td>
                            <CheckBoxElement data-index={this.props.rowIndex} checkCb={this.checkCb} checked={this.props.checked}/>
                        </td>
                        {tds}
                        {op$ele}
                    </tr>)
                }else{
                    return (<tr style={tr$color} >
                        <td>
                            <CheckBoxElement data-index={this.props.rowIndex} checkCb={this.checkCb} checked={this.props.checked}/>
                        </td>
                        {tds}
                        {op$ele}
                    </tr>)
                }

            }
            else{
                return (<tr style={tr$color} >
                    {tgroups}
                    {tds}
                    {op$ele}
                </tr>)
            }

        }

    }
});
export default TrElement