/**
 * Created by dandi_000 on 2016/2/25.
 */

import React from 'react';
import TrElement from './TrElement.jsx';
import ButtonElement from '../basic/ButtonElement.jsx';
import DropDownButtonElement from '../basic/DropDownButtonElement.jsx';
import ComboBox from  '../basic/ComboBox.jsx';
import InputElement from '../basic/InputElement.jsx';
import TodoStore from '../_event/TodoStore.js';
import '../../css/components/forms/Table/Table.css';

var ProxyQ = require('../proxy/ProxyQ');

/**
 * Table,表格组件，请使用&lt;Table /&gt;进行实例化
 * @author danding001
 * @constructor Table
 * @example
 *
 */
var Table=React.createClass({
    initialData:function(){
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            null,
            function(data) {
                if(data!==undefined&&data!==null&&data.length>0) {
                    this.setProps({data: data, data$initialed: true})
                }
            }.bind(this));
    },
    checkCb:function(ob) {
       console.log("select index="+ob);
        if(this.state.checked.multiCheck!==undefined&&this.state.checked.multiCheck!==null&&
            this.state.checked.multiCheck!==false)
        {
            var checkedIndex=this.state.checkedIndex;
            var checkedMap=this.state.checkedMap;
            if(checkedIndex!==-1)//此时已有项选中
            {
                var pos=$.inArray(parseInt(ob.rowIndex),checkedIndex);
                var _pos=$.inArray(parseInt(ob.index),checkedMap);
                if(pos==-1)
                {
                    checkedIndex.push(parseInt(ob.rowIndex));
                    checkedMap.push(parseInt(ob.index));
                }
                else
                {
                    checkedIndex.splice(pos,1);
                    checkedMap.splice(_pos,1);
                }
            }
            else{
                checkedIndex=new Array();
                checkedIndex.push(parseInt(ob.rowIndex));
                checkedMap=new Array();
                checkedMap.push(parseInt(ob.index));
            }
            this.setState({checkedIndex:checkedIndex,checkedMap:checkedMap});
        }else{
            this.setState({checkedIndex:parseInt(ob.rowIndex),checkedMap:parseInt(ob.index)});
        }
    },
    checkHandle:function() {
        var data=this.state.data;
        var checkedIndex=this.state.checkedIndex;
        var checkedMap=this.state.checkedMap;
        if(checkedIndex!==undefined&&checkedIndex!==null&&checkedIndex!==-1&&data!==undefined&&data!==null)
        {
            if(this.state.checked.multiCheck!==undefined&&this.state.checked.multiCheck!==null&&
                this.state.checked.multiCheck!==false)
            {
                if(checkedMap==undefined||checkedMap==null)
                    return ;


                var record=new Array();
                checkedMap.map(function(item,i) {
                    record.push(data[item]);
                });
                var ob={
                    content:record,
                    method:'addHandle',//if you want other component to invoke this method,you can pass it over
                    index:this.props.index,
                    checkedIndex:checkedIndex,
                    multiCheck:true
                };
                TodoStore.emit('fire',ob);
                //给所有需要删除的位置标记
                checkedMap.map(function(item,i) {
                    data[item]=null;
                });
                for(var i=data.length-1;i>=0;i--)
                {
                    if(data[i]==null)
                    data.splice(i,1);
                }
                var titles;
                              if(data[0]!==undefined&&data[0]!==null)
                {
                    titles=new Array();
                    for(var field in data[0])
                    {
                        titles.push(field);
                    }
                }

                if(titles==undefined||titles==null)
                    titles=null
                this.setState({data:data,checkedIndex:-1,checkedMap:null,titles:titles});
            }else{
                if(checkedIndex>-1)
                {
                    var record=data[checkedIndex];
                    if(record==undefined||record==null)
                        return ;
                    var ob={
                        content:record,
                        method:'addHandle',//if you want other component to invoke this method,you can pass it over
                        index:this.props.index,
                        checkedIndex:checkedIndex,
                        multiCheck:false
                    };
                    TodoStore.emit('fire',ob);
                    this.setState({data:data,checkedIndex:-1});
                }

            }

        }
    },
    opHandle:function(ob){
        if(ob!==undefined&&ob!==null)
        {

            var task=ob.content;//教学任务
            var plan=this.props.data[ob["data-index"]];
            var reverge={plan:plan,task:task};
            var params=this.state.op.query.params;
            params["plan"]=JSON.stringify(plan);
            params["task"]=JSON.stringify(task);
            //操作提交后台
            if(this.state.op.query!==undefined&&this.state.op.query!==null)
            {
                this.queryHandle({url:this.state.op.query.url,
                    params:params,callback:  this.props.initialDatas});
            }

        }
    },
    queryHandle:function(ob){
        var query;
        if(ob!==null&&ob!==undefined)
            query=ob;
        else
            query=this.state.query;
        console.log();
        ProxyQ.queryHandle(
            null,
            query.url,
            query.params,
            null,
            function(data) {
                if(this.props.handle!==null&&this.props.handle!==undefined)
                    this.props.handle(data);

                if(ob.callback!==undefined&&ob.callback!==null)
                    ob.callback();
            }.bind(this));
    },
    queryCallBack:function(ob){
        var data=ob.data;
        var titles=new Array();
        for(var field in ob.data[0])
        {
            titles.push(field);
        }

        var cols=titles.length;
        if(cols!==undefined&&cols!==null) {
            if(cols<1)
                cols=1;
        }
        else
            cols=1;
        this.setState({data:ob.data,cols:cols,titles:titles});
    },
    getInitialState:function() {
        //data optional,table component will be renderd when data first be injected if null
        var data = this.props.data;
        //1.columns（title，width，field,tdBasic) required data-option option
        //
        //2.columns
        //TODO:search for duplicate field

        //tdBasic是否单态
        var tdBasic = this.props.tdBasic;
        if (tdBasic === null || tdBasic === undefined || tdBasic === true)
            tdBasic = true;
        else
            tdBasic = false;
        //
        var multiEnable = this.props.multiEnable;
        if (multiEnable === undefined || multiEnable === null || multiEnable === false || isNaN(parseInt(multiEnable)))
            multiEnable = 1;


        //width,表格总长
        var width = this.props.width;
        if (width !== undefined && width !== null) {
            if (!isNaN(width))
                width += "px";
            var pattern = /px$/g;
            var patt = /%$/g;
            if (!patt.test(width))

                throw "width invalid,you should pass a number or a string like .px";
        }
        //auto initialData enable
        var auto;
        //cell width customer
        var widths;
        //components list
        var components;
        //stripped style enable
        var stripped=false;
        //checkbox enable
        var checked;
        //checkedIndex ,this checkbox will be checked when first-render
        var checkedIndex;
        //group type
        var group;
        //event subscribe enable
        var subscribe;
        //text-align set
        var align;
        //data inital-status
        var data$initialed;
        //property query,is used to descript the url and params when data-inital is allowed
        var query;
        //property op,enable to add operation control at the last column
        var op;
        if(this.props["data-options"]!==null&&this.props["data-options"]!==undefined)
        {
            var options=this.props["data-options"];
            //widths fetch
            if(options.widths!==null&&options.widths!==undefined)
            {
                widths=options.widths;
            }
            //components fetch
            if(options.components!==null&&options!==undefined)
            {
                components=options.components;
            }
            //style stripped
            if(options.stripped!==null&&options.stripped!==undefined)
            {
                stripped=true;
            }
            //property checked,indicate where the table should be filled with checkbox
            if(options.checked!==null&&options.checked!==undefined) {
                checked=options.checked;
                if(options.checked.index!==undefined&&options.checked.index!==null&&!isNaN(parseInt(options.checked.index)))
                    checkedIndex=parseInt(options.checked.index);
                else
                    checkedIndex=-1;
            }
            //groupType options,rows would be groupd with groupType
            if(options.group!==null&&options.group!==undefined)
            {
                group=options.group;
            }

            //event subscript enable
            if(options.subscribe!==undefined&&options.subscribe!==null) {
                subscribe=options.subscribe;
            }

            //initial-data automaticaly
            if(options.auto!==undefined&&options.auto!==null&&options.auto!==false)
                auto=true;

            //this property is only effective when options.auto==true
            if(options.query!==undefined&&options.query!==null)
                query=options.query;

            //property op,this append a control at the last of column
            if(options.op!==undefined&&options.op!==null)
                op=options.op;
        }

        //cols should be changed since data injected every time
        var cols;
        var titles;
        if(this.props.data!==undefined&&this.props.data!==null&&this.props.data.length>0)
        {
            var injected=this.props.data;
             titles=new Array();
            for(var field in injected[0])
            {
                titles.push(field);
            }
            cols=titles.length;
            data$initialed=true;
        }
        else
        {
            cols=1;
            data$initialed=false;
        }


        if(this.props.align!==undefined&&this.props.align!==null) {
            switch(this.props.align)
            {
                case "left":
                    align={textAlign:"left"};
                    break;
                case "right":
                    align={textAlign:"right"};
                    break;
                case "center":
                    align={textAlign:"center"};
                    break;
                default:
                    align=null;
                    break;
            }

        }

        //property title-color,indicate the color of th in tbody
        //1.we use '$' to replace - in string
        var title$color;
        if(this.props["title-color"]!==undefined&&this.props["title-color"]!==null) {
            title$color ={backgroundColor:this.props["title-color"]};
        }
        //property tr-color,indicate the color of td in tbody
        var tr$color;
        if(this.props["tr-color"]!==undefined&&this.props["tr-color"]!==null) {
            tr$color = this.props["tr-color"];
        }

        //property title-font-color ,indicate the color of font of th in tbody
        var title$font$color;
        if(this.props["title-font-color"]!==undefined&&this.props["title-font-color"]!==null) {
            title$font$color = {color: this.props["title-font-color"]};
        }

        //property checkedMap,mapping rowIndex to real-index in data
        var checkedMap;
        return {
            width: width, widths:widths,cols:cols,components:components,
            multiEnable: multiEnable, tdBasic: tdBasic, data: data,titles:titles,
            align:align,title$color:title$color,tr$color:tr$color,title$font$color:title$font$color,
            stripped:stripped,checked:checked,
            checkedIndex:checkedIndex,checkedMap:checkedMap,group:group,subscribe:subscribe,
            data$initialed:data$initialed,auto:auto,query:query,
            op:op
        };
    },
    componentDidMount:function(ob){
        //注册订阅
        if(this.state.subscribe!==undefined&&this.state.subscribe!==null)
        {
            var subscribe=this.state.subscribe;
            var instance=this;
            subscribe.map(function(item,i) {
                if(item['type']!==undefined&&item['type']!==null) {
                    TodoStore.addChangeListener(item['type'],item['callback'].bind(instance));
                }
            });
        }
    },
    componentWillUnmount:function(ob)
    {
        //销毁订阅
       if(this.state.subscribe!==undefined&&this.state.subscribe!==null) {
            var subscribe=this.state.subscribe;
           subscribe.map(function(item,i) {
               if(item['type']!==undefined&&item['type']!==null) {
                   TodoStore.removeChangeListener(item['type'],item['callback']);
               }
           });
       }
    },
    componentWillReceiveProps:function(props)
    {

        if(props["data-options"].op!==undefined&&props["data-options"].op!==null) {
            this.setState({op:props["data-options"].op});
            console.log();
        }
        if(props.data!==undefined&&props.data!==null) {
            this.setState({data: props.data});
            this.setState({data$initialed:true});
            var data=props.data;
            var titles;
            if(data[0]!==undefined&&data[0]!==null)
            {
                titles=new Array();
                for(var field in data[0])
                {
                    titles.push(field);
                }
                this.setState({titles:titles});
                var cols=titles.length;
                if(cols!==undefined&&cols!==null) {
                    if(cols<1)
                        cols=1;
                }
                else
                    cols=1;
                this.setState({cols:cols});
            }
        }
    },
    render:function(){
        {/*css style width*/}
        var w=this.state.width;
        var widthStyle=null;
        if(w!==undefined&&w!==null)
        {
            widthStyle={width:w }
        }else
        {
            widthStyle = {width: "100%"}
        }

        {/*css style center*/}
        var center;
        if(this.props.center===true)
            center=true;
        var centerStyle={
            textAlign: "center",
            marginLeft:"auto",
            marginRight:"auto"
        }

        var data=this.state.data;

        var data=this.state.data;

        //表格数据未初始化
        if(this.state.data$initialed!==true)
        {
            if(this.state.auto===true)
            this.initialData();
            //显示已配置的组件
            var querycb=this.queryCallBack;
            var components;
            if(this.state.components!==undefined&&this.state.components!==null)
            {

                var queryHandle=this.queryHandle;
                var queryExist=false;
                var queryType;
                //广播事件的命名以publish的type属性为标准
                var publish=new Object();
                var broadcastCount=0;
                this.state.components.map(function(item,i) {
                    if(item.type=="query")
                    {
                        if(queryExist==false)
                        {
                            queryExist=true;
                            var type='query'+item.id;
                            var feedbackType='feedback'+item.id;
                            var feedback={type:feedbackType};
                            publish={cb:queryHandle,type:type,
                                feedback:feedback};
                        }
                        else
                            throw "query component duplicate!"
                    }
                    else{
                        if(item.type=="dropdown")
                        {
                            broadcastCount++;
                        }
                        else if(item.type=="input")
                        {
                            broadcastCount++;
                        }
                    }
                });
                publish.broadcastCount=broadcastCount;


                components=this.state.components.map(function(item,i) {
                    if (item.type == "query")//查询组件
                    {

                        return (<ButtonElement  type="button"
                                                buttonClass="btn btn-default" title={item.name}
                                                query={item} handle={querycb} key={i}
                                                publish={publish}/>)
                    }
                    if(item.type=="dropdown")//下拉组件
                    {
                        var subscribe;
                        if(queryExist==true)
                        {
                            var emit=function emit(){
                                var selectedIndex=this.state.selectedIndex;
                                var content;
                                if(selectedIndex!==undefined&&selectedIndex!==null)
                                {
                                    content=data[selectedIndex]['value'];
                                }else
                                    content=null;
                                var record={id:this.props.id,content:content};
                                TodoStore.emit(publish.feedback.type,record);
                            }
                            subscribe=[{type:publish.type,callback:emit}];
                        }
                        return(<DropDownButtonElement
                            title={item.name}
                            data={item.data} key={i}
                            id={item.id}
                            subscribe={subscribe}
                            />)
                    }
                    if(item.type=="input")//输入框组件
                    {
                        var subscribe;
                        if(queryExist==true)
                        {
                            var emit=function emit(){
                                var record={id:this.props.id,content:this.state.content};
                                TodoStore.emit(publish.feedback.type,record);
                            }
                            subscribe=[{type:publish.type,callback:emit}];
                        }
                        return(<InputElement
                            type="text"
                            placeholder="Search"
                            id={item.id}
                            className="inline"
                            subscribe={subscribe}
                            key={i}/>)
                    }
                });
            }
            //表头工具行
            var th$head;
                th$head=( <tr>
                    <th colSpan={1}
                        style={this.state.align}>
                        {components}
                    </th>
                </tr>);


            return(
                <table className="table table-bordered center" style={Object.assign(centerStyle,widthStyle)}>
                    <thead>
                    {th$head}
                    </thead>
                    <tbody>
                    <tr><td></td></tr>
                    </tbody>
                </table>
            );
        }else{//表格数据已初始化

            var isLineNumberVisible=this.props.isLineNumberVisible
            if(isLineNumberVisible===undefined||isLineNumberVisible===null)
                isLineNumberVisible=false;
            else
                isLineNumberVisible=true;

            //tbody表头
            var titles;
            var ths;
            if(this.state.titles!==null&&this.state.titles!==undefined&&this.state.titles.length>0)
            {
                var group=this.state.group;
                titles=new Array();
                this.state.titles.map(function(item,i) {
                    if(group!==undefined&&group!==null&&group.property!==undefined&&group.property!==null)
                    {
                        if(item!=group.property)
                            titles.push(<th key={i}>{item}</th>);
                    }else
                        titles.push(<th key={i}>{item}</th>);
                });
            }
            if(titles!==null&&titles!==undefined&&titles.length>1)
            {
                if(this.state.checked!==undefined&&this.state.checked!==null)
                {
                    if(this.state.group!==undefined&&this.state.group!==null)
                    {
                        //如果允许进行op操作
                        if(this.state.op!==undefined&&this.state.op!==null)
                        {
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                <th>{this.state.group.property}</th><th>选择</th>{titles}<th>操作</th>
                            </tr>);
                        }else{//如果没有进行op操作
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                <th>{this.state.group.property}</th><th>选择</th>{titles}
                            </tr>);
                        }


                    }
                    else{
                        ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                            <th>选择</th>{titles}</tr>);
                    }
                }else{//用户未设置checked选项
                    if(this.state.group!==undefined&&this.state.group!==null)//用户设置了group
                    {
                        //如果允许进行op操作
                        if(this.state.op!==undefined&&this.state.op!==null)
                        {
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                <th>{this.state.group.property}</th>{titles}<th>操作</th>
                            </tr>);
                        }else{//如果没有进行op操作
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                <th>{this.state.group.property}</th>{titles}
                            </tr>);
                        }


                    }
                    else{//用户未设置group
                        //如果用户设置了op操作
                        if(this.state.op!==undefined&&this.state.op!==null)
                        {
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                {titles}<th>操作</th></tr>);
                        }else{
                            ths=(<tr style={Object.assign(this.state.title$font$color,this.state.title$color)}>
                                {titles}</tr>);
                        }
                    }
                }
            }



            if(isLineNumberVisible===true)
                titles.splice(0,0,"<th>#<th>");
            var multiEnable=this.state.multiEnable;
            var tdBasic=this.state.tdBasic;

            var widths=this.state.widths;


            //tr$color indicate the color in th in tbody
            var tr$color;
            var checkCb;
            var checkButton;
            if(this.state.tr$color!==undefined&&this.state.tr$color!==null)
                tr$color=this.state.tr$color;
            var appendForOp=this.state.op!==undefined&&this.state.op!==null?1:0;
            if(this.state.checked!==undefined&&this.state.checked!==null)
            {
                checkCb=this.checkCb;
                checkButton=(<tr className="un-render"><td colSpan={this.state.cols+1+appendForOp}>
                    <ButtonElement  type="button"
                                    buttonClass="btn btn-default" title={this.state.checked.name}
                                    handle={this.checkHandle}/>
                </td></tr>);
            }

            //group field
            var group;
            var groupTypes;
            var groupFields;
            //如果表格允许排序
            if(this.state.group!==undefined&&this.state.group!==null)
            {

                groupTypes=new Array();
                groupFields=new Array();
                var property=this.state.group.property;
                data.map(function(item,i) {
                    if($.inArray(item[property], groupTypes)==-1)//如果groupTypes未包含对应type
                    {
                        groupTypes.push(item[property]);
                        var json={};
                        json["field"]=item[property];
                        json["count"]=1;
                        groupFields.push(json);
                    }else{
                        groupFields.map(function(record,i){
                            if(record["field"]==item[property])
                            {
                                record["count"]++;
                            }
                        });
                    }
                });
            }


            //checked indicate whether checkbox should be placed in first column
            var checkedIndex;
            var rows;

            if(data!==undefined&&data!==null){
                var checked=this.state.checked;

                var multiCheck;
                //initial checkedIndex,this prop indicate which row had been checked
                if(checked!==undefined&&checked!==null&&checked!==false)
                {
                    checkedIndex=this.state.checkedIndex;
                    multiCheck=checked.multiCheck;
                }

                //op如果不为空即视选项有效
                var op=this.state.op;
                //进行分组,根据groupTypes的值集合进行数据添加
                if(groupTypes!==null&&groupTypes!==undefined&&groupTypes.length>0)
                {
                    var rowIndex=0;
                    rows=new Array();
                    var property=this.state.group.property;
                    var preField=null;
                    var opHandle=this.opHandle;

                    groupTypes.map(function(field,i) {
                        var updateFlag=false;

                        if(field!==preField)
                        {
                            updateFlag=true;
                            preField=field;
                        }
                        data.map(function(item,j) {
                            if(item[property]==field)
                            {
                                var rowSpan;
                                if(updateFlag==true)
                                {
                                    rowSpan=0;
                                    groupFields.map(function(record,k) {
                                        if(record["field"]==field)
                                            rowSpan=record["count"];
                                    });
                                }
                                var opConfig;
                                if(op!==undefined&&op!==null)
                                {
                                    opConfig={};
                                    opConfig.trend=op.trend;
                                    if(op.contract!==undefined&&op.contract!==null) {

                                        opConfig.data = op.contract[j].data;
                                        opConfig.type=op.contract[j].type;
                                    }
                                }
                                console.log();
                                //如果当前存选中项
                                if(checkedIndex!==undefined&&checkedIndex!==null&&checkedIndex!==-1)
                                {
                                    //允许多选
                                    if(multiCheck!==undefined&&multiCheck!==null&&multiCheck!==false)
                                    {
                                        if($.inArray(rowIndex,checkedIndex)!==-1)//如果当前行选中
                                        {
                                            rows.push(<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={rowIndex}
                                                                 multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                                 widths={widths}  key={rowIndex}  checkCb={checkCb}  insertCheck={true}
                                                                 checked={true} groupType={property} updateFlag={updateFlag} data-index={j}
                                                                 rowSpan={rowSpan} op={opConfig}
                                                                 opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/> );
                                        }
                                        else{
                                            rows.push(<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={rowIndex}
                                                                 multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                                 widths={widths}  key={rowIndex}  checkCb={checkCb}  insertCheck={true}
                                                                 groupType={property} updateFlag={updateFlag}
                                                                 rowSpan={rowSpan} data-index={j} op={opConfig}
                                                                 opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                        }
                                    }else{//只允许单选
                                        if(checkedIndex>-1&&checkedIndex==rowIndex)
                                            rows.push(<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={rowIndex}
                                                                 multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                                 widths={widths}  key={rowIndex}  checkCb={checkCb}  insertCheck={true}
                                                                 checked={true} groupType={property} updateFlag={updateFlag}
                                                                 rowSpan={rowSpan} data-index={j} op={opConfig}
                                                                 opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                    }
                                }else{//如果当前不存在选中项
                                    if(checked!==undefined&&checked!==null)
                                    {
                                        rows.push(<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={rowIndex}
                                                             multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                             widths={widths}  key={rowIndex} checkCb={checkCb}
                                                             insertCheck={true} groupType={property} updateFlag={updateFlag}
                                                             rowSpan={rowSpan} data-index={j} op={opConfig}
                                                             opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                    }
                                    else
                                        rows.push(<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={rowIndex}
                                                             multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                             widths={widths} key={rowIndex} groupType={property} data-index={j}
                                                             updateFlag={updateFlag} rowSpan={rowSpan} op={opConfig}
                                                             opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                }
                                updateFlag=false;
                                rowIndex++;
                            }
                        });

                    });
                }else{//如果不进行分组,则行号与该行数据所在data的下标是一致的
                    var opHandle=this.opHandle;
                    rows=data.map(function(item,i) {
                        var opConfig;
                        if(op!==undefined&&op!==null)
                        {
                            opConfig={};
                            opConfig.type=op.type;
                            if(op.contract!==undefined&&op.contract!==null)
                                opConfig.contract=op.contract[i];
                        }
                        if(checkedIndex!==undefined&&checkedIndex!==null)
                        {
                            if(multiCheck!==undefined&&multiCheck!==null&&multiCheck!==false)
                            {
                                if($.inArray(i,checkedIndex)!==-1)
                                {
                                    return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                       multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                       widths={widths}  key={i}  checkCb={checkCb}
                                                       insertCheck={true} checked={true} op={opConfig}
                                                       opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                }else{
                                    return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                       multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                       widths={widths}  key={i}  checkCb={checkCb}
                                                       insertCheck={true} op={opConfig}
                                                       opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                }
                            }else{
                                if(checkedIndex>-1 &&checkedIndex==i)
                                    return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                       multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                       widths={widths}  key={i}  checkCb={checkCb}
                                                       insertCheck={true} checked={true} op={opConfig}
                                                       opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                                else
                                    return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                       multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                       widths={widths}  key={i}  checkCb={checkCb}
                                                       insertCheck={true} op={opConfig}
                                                       opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                            }
                        }else{
                            if(checked!==undefined&&checked!==null)
                            {
                                return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                   multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                   widths={widths}  key={i} checkCb={checkCb} insertCheck={true} op={opConfig}
                                                   opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                            }
                            else
                                return (<TrElement tr-color={tr$color} tdBasic={tdBasic} rowData={item} rowIndex={i}
                                                   multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                                   widths={widths}  key={i}  op={opConfig}
                                                   opHandle={opConfig!==undefined&&opConfig!==null?opHandle:null}/>);
                        }

                    });
                }

            }
            else{
                rows=<TrElement tr-color={tr$color}  tdBasic={tdBasic}
                                multiEnable={multiEnable} isLineNumberVisible={isLineNumberVisible}
                                widths={widths}   checkCb={checkCb} op={op}
                                opHandle={op!==undefined&&op!==null?opHandle:null}/>
            }


            var querycb=this.queryCallBack;
            var components;
            if(this.state.components!==undefined&&this.state.components!==null)
            {

                var queryHandle=this.queryHandle;
                var queryExist=false;
                var queryType;
                //广播事件的命名以publish的type属性为标准
                var publish;
                var broadcastCount=0;
                this.state.components.map(function(item,i) {
                    if(item.type=="query")
                    {
                        if(queryExist==false)
                        {
                            queryExist=true;
                            var type='query'+item.id;
                            var feedbackType='feedback'+item.id;
                            var feedback={type:feedbackType};
                            publish={cb:queryHandle,type:type,
                                feedback:feedback};
                        }
                        else
                            throw "query component duplicate!"
                    }
                    else{
                        if(item.type=="dropdown")
                        {
                            broadcastCount++;
                        }
                        else if(item.type=="input")
                        {
                            broadcastCount++;
                        }
                    }
                });
                publish.broadcastCount=broadcastCount;


                components=this.state.components.map(function(item,i) {
                    if (item.type == "query")//查询组件
                    {

                        return (<ButtonElement  type="button"
                                                buttonClass="btn btn-default" title={item.name}
                                                query={item} handle={querycb} key={i}
                                                publish={publish}/>)
                    }
                    if(item.type=="dropdown")//下拉组件
                    {
                        var subscribe;
                        if(queryExist==true)
                        {
                            var emit=function emit(){
                                var selectedIndex=this.state.selectedIndex;
                                var content;
                                if(selectedIndex!==undefined&&selectedIndex!==null)
                                {
                                    content=data[selectedIndex]['value'];
                                }else
                                    content=null;
                                var record={id:this.props.id,content:content};
                                TodoStore.emit(publish.feedback.type,record);
                            }
                            subscribe=[{type:publish.type,callback:emit}];
                        }
                        return(<DropDownButtonElement
                            title={item.name}
                            data={item.data} key={i}
                            id={item.id}
                            subscribe={subscribe}
                            />)
                    }
                    if(item.type=="input")//输入框组件
                    {
                        var subscribe;
                        if(queryExist==true)
                        {
                            var emit=function emit(){
                                var record={id:this.props.id,content:this.state.content};
                                TodoStore.emit(publish.feedback.type,record);
                            }
                            subscribe=[{type:publish.type,callback:emit}];
                        }
                        return(<InputElement
                            type="text"
                            placeholder="Search"
                            id={item.id}
                            className="inline"
                            subscribe={subscribe}
                            key={i}/>)
                    }
                })
            }


            //标题
            var title;
            if(this.props["data-options"].title!==undefined&&this.props["data-options"].title!==null)
            {
                if(this.state.checked!==undefined&&this.state.checked!==null)
                {

                    title=( <tr>
                        <th colSpan={this.state.cols+1+appendForOp}
                            style={this.state.align}>
                            {this.props["data-options"].title}
                        </th>
                    </tr>);
                }
                else{
                    title=( <tr>
                        <th colSpan={this.state.cols+appendForOp}
                            style={this.state.align}>
                            {this.props["data-options"].title}
                        </th>
                    </tr>);
                }
            }


            var th$head;
            if(this.state.checked!==undefined&&this.state.checked!==null)
            {

                th$head=( <tr>
                    <th colSpan={this.state.cols+1+appendForOp}
                        style={this.state.align}>
                        {components}
                    </th>
                </tr>);
            }
            else{
                th$head=( <tr>
                    <th colSpan={this.state.cols+appendForOp}
                        style={this.state.align}>
                        {components}
                    </th>
                </tr>);
            }




            return(
                <table className="table table-bordered center" style={Object.assign(centerStyle,widthStyle)}>
                    <thead>
                    {title}
                    {th$head}
                    </thead>
                    <tbody>
                    {ths}
                    {rows}
                    {checkButton}
                    </tbody>
                </table>
            );
        }//match to data$initialed===true

    }
});

export default Table