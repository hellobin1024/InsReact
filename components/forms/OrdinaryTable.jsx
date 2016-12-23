import React from 'react';
import {render} from 'react-dom';
import Download from '../../components/basic/Download.jsx';
import LinkElement from '../../components/basic/LinkElement.jsx';
import OrdinaryTr from '../../components/forms/OrdinaryTr.jsx';
import Hide from '../../components/basic/Hide.jsx';
import Panel from '../../components/panel/Panel.jsx';
import EmbedTable from '../../components/forms/EmbedTable.jsx';
import Operation from '../../components/basic/Operation.jsx';
import '../../css/components/forms/ordinaryTable/OrdinaryTable.css';
var ProxyQ=require('../proxy/ProxyQ');
var SyncActions=require('../flux/actions/SyncActions');

/**
 *
 * 1.dataField,本组件支持多数据源注入,由dataField的field映射至各表数据源所对应的键
 * 2.link组件开始支持单字段复数
 * 3.目前分组可以识别filterField
 * 4.增加表尾控件,tail
 */
var OrdinaryTable =React.createClass({
    combineRemainTd:function(out$param,in$param,prefix,start,count,p$index){
        if(Object.prototype.toString.call(out$param)=='[object Array]')
        {
            var state=this.state;
            var existedInArray=this.existedInArray;

            for(var i=start;i<start+count;i++)
            {
                var tds=prefix.slice(0,prefix.length);

                var td$index;
                if(i!==start)
                {
                    td$index=0;
                    tds=new Array();
                }
                else
                    td$index = p$index;

                var row=in$param[i];

                //如果过滤字段存在
                if(state.filterField!==undefined&&state.filterField!==null&&Object.prototype.toString.call(state.filterField)=='[object Object]')
                {
                    var linkCb=this.linkCb;
                    for(var field in state.filterField)
                    {
                        if(existedInArray(field,state.group$field)===false)
                        {
                            switch(field)
                            {
                                case 'attachs':

                                    var downloads=null;
                                    var ids=null;
                                    if(row[field]!==undefined&&row[field]!==null&&row[field]!='')
                                        ids=row[field].split("|");
                                    if(ids!=null&&ids.length>=1)
                                    {
                                        downloads=new Array();
                                        ids.map(function(item,i) {
                                            downloads.push(<Download attachId={item} key={i}/>);
                                        });
                                    }
                                    tds.push(<td key={td$index++}>{downloads}</td>);
                                    break;
                                case 'link':
                                    if(row[field]!==undefined&&row[field]!==null)
                                    {
                                        var ids=null;
                                        var comps=null;
                                        try{
                                            comps=eval(row[field]);
                                        }catch(e)
                                        {
                                            ids=row[field].split('|');
                                        }

                                        if(comps!==null)
                                        {
                                            var links=new Array();
                                            comps.map(function(comp,i){
                                                var confs=comp.split('|');
                                                if(confs[1]!==undefined&&confs[1]!==null&&confs[2]!==undefined&&confs[2]!==null)
                                                {
                                                    links.push(
                                                        <LinkElement linkCb={linkCb} data-comp={confs[1]} data-query={confs[2]} key={i}>{confs[0]}</LinkElement>
                                                    );
                                                }
                                            });
                                            if(links.length>=1)
                                            {
                                                tds.push(
                                                    <td key={td$index++}>
                                                        {links}
                                                    </td>);
                                            }
                                        }else{
                                            if(ids!==null)
                                            {
                                                if(ids[1]!==undefined&&ids[1]!==null&&ids[2]!==undefined&&ids[2]!==null)
                                                {
                                                    tds.push(
                                                        <td key={td$index++}>
                                                            <LinkElement linkCb={linkCb} data-comp={ids[1]} data-query={ids[2]}>{ids[0]}</LinkElement>
                                                        </td>);
                                                }
                                                else{
                                                    tds.push(
                                                        <td key={k++}>
                                                            <LinkElement>{ids[0]}</LinkElement>
                                                        </td>);
                                                }
                                            }
                                        }
                                    }
                                    else{
                                        tds.push(<td key={td$index++}></td>);
                                    }
                                    break;
                                default:
                                    tds.push(<td key={td$index++}>{row[field]}</td>);
                                    break;
                            }
                        }
                    }



                }else{
                    for(var field in row)
                    {
                        //分组算法中,只压入非分组范围字段
                        if(existedInArray(field,state.group$field)===false)
                        {

                            tds.push(<td key={td$index++}>{row[field]}</td>);
                        }
                    }
                }

                out$param.push(<tr key={i}>{tds}</tr>);

            }
        }
    },
    combine:function(ob,in$param,out$param,group$field,prefix,td$index,row$index){
        var pool=ob;
        if(pool!==undefined&&pool!==null) {
            if(Object.prototype.toString.call(pool)=='[object Array]')
            {


                var leaf=(!(pool[0].r!==undefined&&pool[0].r!==null));
                console.log();
                console.log();
                for(var i=0;i<pool.length;i++)
                {
                    var tds;
                    console.log();
                    console.log();
                    console.log();
                    if(i==0&&prefix!==null&&prefix!==undefined)
                    {
                        tds=prefix.slice(0,prefix.length);
                    }else{
                        tds=new Array();
                    }
                    //代表td的键值
                    var index=td$index;
                    tds.push(<td rowSpan={pool[i].c} key={index++} style={{verticalAlign:"inherit"}}>{pool[i].v}</td>);
                    //分组非叶结点
                    if(leaf==false)
                    {
                        this.combine(pool[i].r,in$param,out$param,group$field,tds,index,row$index);
                    }else{//分组叶结点

                        this.combineRemainTd(out$param,in$param,tds,row$index.i,pool[i].c,index);
                        row$index.i+=pool[i].c;
                    }
                }


            }
        }
    },
    recurse:function(pool,rule,in$param,out$param,group$field){
        if(pool!==undefined&&pool!==null)
        {
            if(Object.prototype.toString.call(pool)=='[object Array]')
            {
                for(var i=0;i<pool.length;i++)
                {
                    var prefix=rule;
                    prefix+=pool[i].v;
                    if(pool[i].r!==undefined&&pool[i].r!==null)
                    {
                        prefix+='|';
                        this.recurse(pool[i].r,prefix,in$param,out$param,group$field);
                    }else{
                        //当递归至叶结点时,重新压入数据

                        in$param.map(function(row,j) {
                            var matchs='';
                            group$field.map(function(field,k) {
                                matchs+=row[field];
                                if(k!=group$field.length-1)
                                    matchs+='|';
                            });
                            if(matchs==prefix)
                                out$param.push(row);
                        });
                    }
                }
            }
        }

    },
    existedInArray:function(d2,arr)
    {
        var existed=false;
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i]==d2)
            {
                existed=i;
                break;
            }
        }
        return existed;
    },
    //该方法返回false或该键在数组的下标
    existedIn:function(d2,pool){
        var existed=false;
        for(var i=0;i<pool.length;i++)
        {
            if(pool[i].v==d2)
            {
                existed=i;
                break;
            }
        }
        return existed;
    },
    group:function(data,group$field) {

        var pool=new Array();
        var existedIn=this.existedIn;
        data.map(function(row,i) {
            var ob;
            var re;
            var p=pool;
            //初始化pool
            group$field.map(function(field,j) {
                //如果该分组字段不位于队尾
                if(j!=group$field.length-1)
                {
                    re=existedIn(row[field],p);
                    if(re===false)//如果pool中没有此键
                    {
                        ob=new Object();
                        ob.v=row[field];
                        ob.c=1;
                        ob.r=new Array();
                        p.push(ob);
                    }else{
                        ob=p[re];
                        ob.c++;
                    }
                    p=ob.r;
                }else{
                    re=existedIn(row[field],p);
                    if(re===false)
                    {
                        ob=new Object();
                        ob.v=row[field];
                        ob.c=1;
                        p.push(ob);
                    }else{
                        ob=p[re];
                        ob.c++;
                    }
                }
            });
        });

        //重新生成数据
        var gen=new Array();
        this.recurse(pool,'',data,gen,group$field);
        //根据重新生成的数据源gen进行pool的i设置

        return [pool,gen];
    },
    groupCombine:function(pool,in$param,out$param,group$field){
        var row$index=new Object();
        row$index.i=0;
        this.combine(pool,in$param,out$param,group$field,null,0,row$index);
    },
    clickCb:function(ob){
        if(ob!==undefined&&ob!==null)
        {
            var dataField=ob.field;
            var index=ob.index;
            if(index===null||index===undefined||dataField==null||dataField==undefined)
            {}
            else{
                if(dataField==this.state.sideField.field&&!isNaN(parseInt(index)))
                {
                    var row=this.state.data[this.state.sideField.field][index];
                    var params=Object.assign(this.state.sideField.query.params,row);
                    ProxyQ.queryHandle(
                        null,
                        this.state.sideField.query.url,
                        params,
                        'json',
                        function(response){
                            console.log();
                            console.log();
                            this.setState({data:response.arr});
                        }.bind(this)
                    )

                }
            }
        }
    },

    linkCb:function(evt){
        if(evt!==undefined&&evt!==null)
        {
            var target=evt.target;
            var query;
            if(target.getAttribute('data-comp')!==undefined&&target.getAttribute('data-comp')!==null)
            {
                var comp=target.getAttribute("data-comp");
                var hiddenInfo=new Object();
                if(Object.prototype.toString.call(target.getAttribute('data-query')=='[object String]'))
                    hiddenInfo.data=eval('('+target.getAttribute('data-query')+')');
                else
                    hiddenInfo.data=target.getAttribute('data-query');
                hiddenInfo.comp=target.getAttribute('data-comp');

                this.setState({hiddenInfo:hiddenInfo});
                $(this.refs.contentDiv).slideUp();
            }

        }
    },
    inputCb: function(evt){
        var target=evt.target;
        var value=target.value;
        if(target.getAttribute('data-index')!==undefined&&target.getAttribute('data-index')!==null)
        {
            var index=target.getAttribute('data-index');
            var data=this.state.data;
            var datai=data[index];
            if(value!==null&&value!==undefined){
                datai.input=value;
            }
            this.setState({data:data})
        }
    },
    checkCb:function(evt){
        var target=evt.target;
        var $target=$(target);
        switch($target.attr("data-type"))
        {
            case 'checkM':
                var k=$target.attr("data-index");
                var checkingMap=this.state.checkingMap;
                //if hit by single check
                if(k!==null&&k!==undefined&&!isNaN(parseInt(k))&&k!=="-1")
                {
                    k=parseInt(k);
                    if(this.state.checkingMap==null||this.state.checkingMap==undefined)
                    {
                        this.state.checkingMap=new Object();
                    }

                    if(checkingMap[k]!==undefined&&checkingMap[k]!==null)
                        delete checkingMap[k];
                    else
                        checkingMap[k]=true;
                    this.setState({chekingMap:checkingMap});
                }
                else{
                    //check all
                    if(checkingMap[-1]==true||checkingMap[-1]=='true'){
                        delete checkingMap[-1];
                        for(var i=0;i<this.state.data.length;i++) {
                            delete checkingMap[i];
                        }
                    }
                    else{
                        checkingMap[-1]=true;
                        for(var i=0;i<this.state.data.length;i++) {
                            checkingMap[i] = true;
                        }
                    }
                    this.setState({chekingMap:checkingMap});
                }
                break;
            default:
                break;
        }

    },
    returnCb:function()
    {
        this.setState({hiddenInfo:null});
        $(this.refs.contentDiv).slideDown();
    },
    operationCb: function (ob) {
        if (ob !== undefined && ob !== null) {
            ob.params.data = this.state.data[ob.params.index];
            ProxyQ.queryHandle(
                null,
                ob.url,
                ob.params,
                'json',
                function(response){
                    //pronounce
                    SyncActions.pronounce();
                }.bind(this)
            )
        }
    },

    clickHandle:function(evt)
    {
        var target=evt.target;
        var $target=$(target);
        switch($target.attr("data-type"))
        {
            case 'checkQuery':
                if($target.attr("data-query")!==undefined&&$target.attr("data-query")!==null)
                {
                    var query = eval('(' + $target.attr("data-query") + ')');
                    var backType=$target.attr("data-backtype");
                    //取出选中数据的url,params,filter
                    /**
                     * filter,指定你想要check的数据列名
                     */

                    var data=this.state.data;

                    var checkingMap=this.state.checkingMap;
                    var squash;
                    if(checkingMap!==undefined&&checkingMap!==null) {
                        squash = new Array();
                        if (checkingMap[-1] == true || checkingMap[-1] == 'true') {
                            delete checkingMap[-1];
                        }
                        for (var index in checkingMap) {
                            if (Object.prototype.toString.call(query.filter) == '[object Array]') {
                                var json = new Object();
                                query.filter.map(function (field, i) {
                                    json[field] = data[index][field];
                                });
                                squash.push(json);
                            }
                            else
                                squash.push(data[index]);
                        }

                        var squashed = new Object();
                        squashed.squashed = JSON.stringify(squash);

                        var params = Object.assign(query.params == null || query.params == undefined ? {} : query.params
                            , squashed !== null && squashed !== undefined ? squashed : '');

                        if (backType !== undefined && backType !== null) {
                            var cmd = query.url;
                            var prefix = ProxyQ.getPrefix();
                            var QueryA = this.refs["QueryA"];
                            var $QueryA = $(QueryA);
                            $QueryA.attr("src", prefix + cmd + "?squashed=" + JSON.stringify(squash));
                        } else {


                            ProxyQ.queryHandle(
                                null,
                                query.url,
                                params,
                                'json',
                                function (response) {

                                }.bind(this)
                            )
                        }
                    }
                    else{

                        squash = new Array();
                        for(var index=0;index<data.length;index++) {
                            if (Object.prototype.toString.call(query.filter) == '[object Array]') {
                                var json = new Object();
                                query.filter.map(function (field, i) {

                                        json[field] = data[index][field];

                                });
                                squash.push(json);
                            }
                            else
                                squash.push(data[index]);
                        }
                        var squashed = new Object();
                        squashed.squashed = JSON.stringify(squash);
                        var params = Object.assign(query.params == null || query.params == undefined ? {} : query.params
                                , squashed !== null && squashed !== undefined ? squashed : '');
                            ProxyQ.queryHandle(
                                null,
                                query.url,
                                params,
                                'json',
                                function (response) {
                                    this.fetch();
                                }.bind(this)
                            )
                        }

                    }
                break;
            default:
                break;
        }


    },
    fetch:function(){
        ProxyQ.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function(response){
                var data;
                var ob=new Object();
                if(Object.prototype.toString.call(response)!='[object Array]')
                    if(response.arr!==undefined&&response.arr!==null)
                        if(Object.prototype.toString.call(response.arr)=='[object Array]')
                            data=response.arr;
                else
                    data=response;



                if(this.state.group$field!==undefined&&this.state.group$field!==null)
                {
                    //对数据进行分组
                    var arr=this.group(data,this.state.group$field);
                    ob.data=arr[1];
                    ob.pool=arr[0];
                }else{
                    ob.data=data;
                }
                ob.data$initialed=true;
                if(response.tail!==undefined&&response.tail!==null&&Object.prototype.toString.call(response.tail)=='[object Array]')
                {
                    ob.tail=response.tail;
                }
                if(response.translation!==undefined&&response.translation!==null){
                    ob.translation=response.translation;
                }
                this.setState(ob);
            }.bind(this)
        )
    },
    queryHandle:function(type,url,params,dataType,callback){
        $.ajax({
            type: type!==undefined&&type!==null?type:'POST',
            url: url,
            dataType: dataType!==undefined&&dataType!==null?dataType:'json',
            data: params,
            cache: false,
            success: function(response) {
                if(callback!==undefined&&callback!==null)
                    callback(response);
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    getInitialState:function(){
        //自动拉取服务器数据
        var autoFetch;
        if(this.props.autoFetch!==undefined&&this.props.autoFetch!==null)
            autoFetch=this.props.autoFetch;
        else
            autoFetch=false;

        //数据是否绑定
        var data$initialed;
        if(this.props.data!==undefined&&this.props.data!==null)
            data$initialed=true;
        else
            data$initialed=false;

        var data;
        if(this.props.data!==undefined&&this.props.data!==null)
            data=this.props.data;

        var sideField;
        if(this.props.sideField!==undefined&&this.props.sideField!==null)
            sideField=this.props.sideField;

        var dataField;
        if(this.props.dataField!==undefined&&this.props.dataField!==null)
            dataField=this.props.dataField;

        //filterField,此选项开启后自动按照filterField的顺序进行字段填充
        var filterField;
        if(this.props.filterField!==undefined&&this.props.filterField!==null)
            filterField=this.props.filterField;



        //groupField,此选项用于开启部分字段的分组
        var group$field;
        if(this.props["group-field"]!==undefined&&this.props["group-field"]!==null)
        {
            group$field=this.props["group-field"];

        }

        var data;
        var pool;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            if(group$field!==undefined&&group$field!==null)
            {
                var arr=this.group(this.props.data,group$field);
                data=arr[1];
                pool=arr[0];
            }
        }

        //hidden componnet
        var hiddenStatus=false;
        if(this.props.hiddenStatus==true||this.props.hiddenStatus=='true')
            hiddenStatus=true;


        //checkingMap,此选项用于保持选中数据项的下标
        var checkingMap;
        if(this.props.checkingMap!==undefined&&this.props.checkingMap!==null)
            checkingMap=this.props.checkingMap;

        //translation,中英文对照表
        var translation;
        if(this.props.translation!==undefined&&this.props.translation!==null)
            translation=this.props.translation;


        return ({autoFetch:autoFetch,data$initialed:data$initialed,data:data,
            sideField:sideField,dataField:dataField,filterField:filterField,group$field:group$field,
            pool:pool,hiddenStatus:hiddenStatus,checkingMap:checkingMap,translation:translation});
    },
    componentWillReceiveProps:function(props)
    {
        var op=new Object();
        //更新data$initialed状态
        if(props.data$initialed!==undefined&&props.data$initialed!==null)
            op.data$initialed=props.data$initialed;
        if(props.data!==undefined&&props.data!==null)
        {

            if(this.props.data!==props.data)
            {
                if(this.props.filterField!==null&&this.props.filterField!==undefined&&
                    (this.props.filterField.checkM==true||this.props.filterField.checkM=="true"))
                {
                    op.checkingMap=new Object();
                    props.data.map(function(row,i) {
                        if(row.checkM==true||row.checkM=="true")
                        {
                            op.checkingMap[i]=true;
                        }
                    });
                }
            }
            op.data=props.data;
        }
        if(props.pool!==undefined&&props.pool!==null)
            op.pool=props.pool;
        if(props.translation!==undefined&&props.translation!==null)
            op.translation=props.translation;
        if(props.tail!==undefined&&props.tail!==null)
            op.tail=props.tail;

        this.setState(op);
    },
    render:function(){
        if(this.state.data$initialed!==true&&(this.props.data==null||this.props.data==undefined))
        {
            if(this.state.autoFetch==true)
                this.fetch();
            return (
                <table>
                </table>
            )
        }else{
            var colSpan=1;
            var tables;
            //多表数据源注入
            if(this.state.dataField!==null&&this.state.dataField!==undefined)
            {
                tables=new Array();
                if(Object.prototype.toString.call(this.props.dataField)!="[object Array]")
                    return(
                        <table></table>
                    );
                var state=this.state;
                var props=this.props;
                state.dataField.map(function(item,i) {
                    var colSpan=0;
                    if(props.data[item.field]==null||props.data[item.field]==undefined||Object.prototype.toString.call(props.data[item.field])!="[object Array]")
                    {
                        return false;
                    }
                    if(props.data[item.field].length<1)
                        return false;
                    //如果内表允许堆叠
                    if(item.stacked==true)
                    {
                        var arr=new Array();
                        var json=new Object();
                        json["data"]=state.data[item.field];
                        arr.push(json);
                        tables.push(
                            <EmbedTable title={item.title}
                                        data={{arr:arr}}
                                        subQuery={{
                                            url:"/bsuims/reactPageDataRequest.do",
                                            params:{
                                                reactPageName:'cultivateTutorPage',
                                                reactActionName:"personIntroductionShow"
                                            }
                                        }}
                                        autoFetch={false} key={i}/>
                        );
                    }else{
                        var trs;
                        var rowFields=new Array();
                        for(var field in props.data[item.field][0])
                        {

                            rowFields.push(<td key={colSpan}>{field}</td>);
                            colSpan++;
                        }
                        trs=new Array();
                        props.data[item.field].map(function(row,i) {
                            var tds=new Array();
                            var j=0;
                            for(var field in row)
                            {
                                tds.push(
                                    <td key={j++}>
                                        {row[field]}
                                    </td>);
                            }
                            trs.push(
                                <tr key={i}>
                                    {tds}
                                </tr>
                            )

                        });
                        tables.push(
                            <table className="table table-bordered center ordinaryTable" key={i}>
                                <thead>
                                <tr>
                                    <th colSpan={colSpan}>{item.title}</th>
                                </tr>
                                </thead>
                                <tbody  className="table table-bordered center ordinaryTable">
                                <tr>{rowFields}</tr>
                                {trs}
                                </tbody>
                            </table>);
                    }


                });

            }else{
                //单表数据源注入
                if(Object.prototype.toString.call(this.state.data)=="[object Array]"&&this.state.data.length>=1)
                {
                    tables=new Array();
                    colSpan=0;
                    var tr$fields=new Array();
                    var j=0;
                    var state=this.state;
                    var props=this.props;
                    var checkCb=this.checkCb;
                    var inputCb=this.inputCb;
                    //如果允许过滤字段
                    if(state.filterField!==null&&state.filterField!==undefined)
                    {
                        for(var field in state.filterField)
                        {
                            if(state.data[0][field]!==null&&state.data[0][field]!==undefined)
                            {
                                var transaltedField=field;
                                if(state.translation!==null&&state.translation!==undefined
                                    &&state.translation[field]!==undefined&&state.translation[field]!==null)
                                {
                                    transaltedField=state.translation[field];
                                }
                                switch(field)
                                {
                                    case "checkM":
                                        tr$fields.push(<td key={j++}>
                                            <input type="checkbox" data-index={-1} data-type="checkM" onChange={checkCb} />全选
                                        </td>);
                                        break;
                                    case state.filterField[0]:
                                        tr$fields.push(<td key={j++}>{transaltedField}</td>);
                                        break;
                                    default:
                                        tr$fields.push(<td key={j++} >{transaltedField}</td>);
                                        break;
                                }
                                colSpan++;
                            }
                        }
                    }else{
                        for(var field in state.data[0])
                        {
                            tr$fields.push(<td key={j++}>{field}</td>)
                            colSpan++;
                        }
                    }


                    var trs=new Array();


                    //如果字段进行分组
                    if(state.group$field!==undefined&&state.group$field!==null)
                    {

                        //分组程序
                        this.groupCombine(state.pool, state.data,trs, this.state.group$field);
                    }else{
                        var linkCb=this.linkCb;
                        var checkCb=this.checkCb;
                        var operationCb = this.operationCb;
                        state.data.map(function(row,i) {
                            var k=0;
                            var tds=new Array();
                            if(state.filterField!==undefined&&state.filterField!==null)
                            {
                                for(var field in state.filterField)
                                {
                                    if(row[field]!==undefined&&row[field]!==null)
                                    {

                                        switch(field)
                                        {
                                            case state.filterField[0]:
                                                tds.push(<td key={k++} >{content}</td>);
                                            case 'attachs':
                                                //附件字段更改,attachid1=>xx1|attachid2=>xx2
                                                var downloads=null;
                                                var ids=null;
                                                if(row[field]!==undefined&&row[field]!==null&&row[field]!='')
                                                    ids=row[field].split("|");
                                                if(ids!=null&&ids.length>=1)
                                                {
                                                    downloads=new Array();
                                                    ids.map(function(item,i) {
                                                        var oa=eval('('+item+')');
                                                        downloads.push(<Download attachId={oa.id} key={i}>{oa.name}</Download>);

                                                    });
                                                }
                                                tds.push(<td key={k++}>{downloads}</td>);
                                                break;
                                            case 'link':
                                                if(row[field]!==undefined&&row[field]!==null)
                                                {
                                                    var ids=null;
                                                    var comps=null;
                                                    try{
                                                        comps=eval(row[field]);
                                                    }catch(e)
                                                    {
                                                        ids=row[field].split('|');
                                                    }

                                                    if(comps!==null)
                                                    {
                                                        var links=new Array();
                                                        comps.map(function(comp,i){
                                                            var confs=comp.split('|');
                                                            if(confs[1]!==undefined&&confs[1]!==null&&confs[2]!==undefined&&confs[2]!==null)
                                                            {
                                                                links.push(
                                                                    <LinkElement linkCb={linkCb} data-comp={confs[1]} data-query={confs[2]} key={i}>{confs[0]}</LinkElement>
                                                                );
                                                            }
                                                        });
                                                        if(links.length>=1)
                                                        {
                                                            tds.push(
                                                                <td key={k++}>
                                                                    {links}
                                                                </td>);
                                                        }
                                                    }else{
                                                        if(ids!==null)
                                                        {
                                                            if(ids[1]!==undefined&&ids[1]!==null&&ids[2]!==undefined&&ids[2]!==null)
                                                            {
                                                                tds.push(
                                                                    <td key={k++}>
                                                                        <LinkElement linkCb={linkCb} data-comp={ids[1]} data-query={ids[2]}>{ids[0]}</LinkElement>
                                                                    </td>);
                                                            }
                                                            else{
                                                                tds.push(
                                                                    <td key={k++}>
                                                                        <LinkElement>{ids[0]}</LinkElement>
                                                                    </td>);
                                                            }
                                                        }
                                                    }




                                                }
                                                else{
                                                    tds.push(<td key={k++}></td>);
                                                }
                                                break;
                                            case 'checkM':
                                                if(row[field]!==undefined&&row[field]!==null) {
                                                    if(state.checkingMap!==undefined&&state.checkingMap!==null&&(state.checkingMap[i]=='true'||state.checkingMap[i]==true)){
                                                        tds.push(<td key={k++}>
                                                                <input type="checkbox" data-index={i} data-type="checkM" onChange={checkCb} checked={true}/>
                                                            </td>
                                                        );
                                                    }
                                                    else
                                                        tds.push(
                                                            <td key={k++}>
                                                                <input type="checkbox" data-index={i} data-type="checkM"  onChange={checkCb}/>
                                                            </td>);

                                                    //if (row[field]==true|| row[field]== 'true'){
                                                    //    tds.push(<td key={k++}>
                                                    //            <input type="checkbox" data-index={i} data-type="checkM" onChange={checkCb} selected/>
                                                    //        </td>
                                                    //    );
                                                    //}
                                                    //else
                                                    //    tds.push(
                                                    //        <td key={k++}>
                                                    //            <input type="checkbox" data-index={i} data-type="checkM"  onChange={checkCb}/>
                                                    //        </td>);
                                                }
                                                else
                                                    tds.push(<td key={k++}></td>);
                                                    break;
                                            case 'operation':
                                                //"+|operation|{}",'-|operation|{}"
                                                if (row[field] !== undefined && row[field] !== null) {
                                                    var ids = null;
                                                    ids = row[field].split("|");
                                                    if (ids.length == 3) {
                                                        tds.push(<td key={k++}><Operation op={ids[0]} query={ids[2]}
                                                                                          data-index={i}
                                                                                          operationCb={operationCb}></Operation>
                                                        </td>);
                                                    }
                                                    else
                                                        tds.push(<td key={k++}></td>);
                                                } else {
                                                    tds.push(<td key={k++}></td>);
                                                }
                                                break;
                                            case 'input':
                                                if(row[field]!==undefined&&row[field]!==null){
                                                    var ids;
                                                    ids=row[field]
                                                    tds.push(<td key={k++}>
                                                        <input  type="text" value={ids==null||ids==undefined?null:ids}  data-index={i} onChange={inputCb}/>
                                                            </td>)
                                                }else{
                                                    tds.push(<td key={k++}></td>);
                                                }
                                                break;
                                            default:
                                                    //text/html内容检查<re>c</re>
                                                var reg = /<(.*?)>(.*)<\/.*>/;
                                                var content = row[field];
                                                var re = reg.exec(content);
                                                if(re!==undefined&&re!==null)
                                                {
                                                    if (re[1] !== undefined && re[1] !== null) {
                                                        content = <span dangerouslySetInnerHTML={{__html:content}}/>;
                                                    }
                                                }
                                                tds.push(<td key={k++}>{content}</td>);

                                                break;
                                        }
                                    }

                                }

                            }
                            else{//如果未设置过滤字段
                                for(var field in row)
                                {
                                    switch(field)
                                    {
                                        case 'link':
                                            if(row[field]!==undefined&&row[field]!==null)
                                            {
                                                var ids=null;
                                                var comps=null;
                                                try{
                                                    comps=eval(row[field]);
                                                }catch(e)
                                                {
                                                    ids=row[field].split('|');
                                                }

                                                if(comps!==null)
                                                {
                                                    var links=new Array();
                                                    comps.map(function(comp,i){
                                                     var confs=comp.split('|');
                                                        if(confs[1]!==undefined&&confs[1]!==null&&confs[2]!==undefined&&confs[2]!==null)
                                                        {
                                                            links.push(
                                                                    <LinkElement linkCb={linkCb} data-comp={confs[1]} data-query={confs[2]} key={i}>{confs[0]}</LinkElement>
                                                                );
                                                        }
                                                    });
                                                    if(links.length>=1)
                                                    {
                                                        tds.push(
                                                            <td key={k++}>
                                                                {links}
                                                                </td>);
                                                    }
                                                }else{
                                                    if(ids!==null)
                                                    {
                                                        if(ids[1]!==undefined&&ids[1]!==null&&ids[2]!==undefined&&ids[2]!==null)
                                                        {
                                                            tds.push(
                                                                <td key={k++}>
                                                                    <LinkElement linkCb={linkCb} data-comp={ids[1]} data-query={ids[2]}>{ids[0]}</LinkElement>
                                                                </td>);
                                                        }
                                                        else{
                                                            tds.push(
                                                                <td key={k++}>
                                                                    <LinkElement>{ids[0]}</LinkElement>
                                                                </td>);
                                                        }
                                                    }
                                                }


                                            }
                                            else{
                                                tds.push(<td key={k++}></td>);
                                            }
                                            break;
                                        case 'checkM':
                                            if(row[field]!==undefined&&row[field]!==null) {

                                                if (row[field]==true|| row[field]== 'true'){
                                                    tds.push(<td key={k++}>
                                                            <input type="checkbox" data-type="checkM" data-index={i} onChange={checkCb} checked={true}/>
                                                        </td>
                                                    );
                                                }
                                                else
                                                    tds.push(<td key={k++}>
                                                        <input type="checkbox" data-type="checkM" data-index={i} onChange={checkCb}/>
                                                    </td>);
                                            }
                                            else
                                                tds.push(<td key={k++}></td>);
                                            break;
                                        default:
                                            tds.push(<td key={k++}>{row[field]}</td>);
                                            break;
                                    }

                                }
                            }
                            trs.push(
                                <tr key={i}>
                                    {tds}
                                </tr>
                            );
                        });
                    }


                    //表尾控件初始化
                    var tails=null;
                    if(this.state.tail!==undefined&&this.state.tail!==null)
                    {
                        var tail=new Array();
                        var clickHandle=this.clickHandle;
                        var state=this.state;
                        this.state.tail.map(function(item,i) {
                            var ids=item.split('|');
                            var ctrl;
                            if(ids.length>=2)
                            {
                                switch(ids[1])
                                {
                                    case 'checkQuery':
                                        if(ids.length>=3)
                                        {

                                            ctrl=<button  onClick={clickHandle} data-type="checkQuery" data-query={ids[2]}>{ids[0]}</button>;
                                        }
                                        else
                                            ctrl=<button  onClick={clickHandle} data-type="checkQuery">{ids[0]}</button>;
                                        tail.push(<td key={i}>{ctrl}</td>);
                                        break;
                                    default:
                                        tail.push(<td key={i}></td>);
                                        break;
                                }
                            }
                        });

                        tails=<tfoot>
                                <tr>
                                    <td colSpan={colSpan}>
                                        <table className="table table-bordered center" style={{width:"100%"}}>
                                            <tr>{tail}</tr>
                                        </table>
                                    </td>
                                </tr>
                              </tfoot>
                    }


                    var title=null;
                    if(this.props.title!==undefined&&this.props.title!==null) {
                        var name=this.props.title;
                        var reg=/<(.*?)>(.*?)<\/(.*?)>/;
                        var re=reg.exec(name);
                        var re = reg.exec(name);
                        var content=null;
                        if(re!==undefined&&re!==null)
                        {
                            content = <span dangerouslySetInnerHTML={{__html:name}}/>;
                        }else {
                            content = this.props.title;
                        }

                         title=       <thead>
                                            <tr>
                                                <td colSpan={colSpan} style={{float:"center",fontWeight:"bold"}}>{content}</td>
                                            </tr>
                                      </thead>

                    }
                    tables.push(
                        <table className="table table-bordered center" key={0}>
                            {title}
                            <tbody>
                            <tr>{tr$fields}</tr>
                            {trs}
                            </tbody>
                            {tails}
                        </table>)

                }else{
                    tables=new Array();
                       tables.push(
                        <table className="table table-bordered center" key={0}>
                            {title}
                            <tbody>
                            <tr>{tr$fields}</tr>
                            <tr><th><font color="red">没有符合条件的数据</font></th></tr>
                            </tbody>
                            {tails}
                        </table>)

                }
            }

            var sideDist;
            if(this.props.sideField!==undefined&&this.props.sideField!==null)
            {
                var sideTables;
                colSpan=0;
                var state=this.state;
                if(state.sideField.field!==undefined&&state.sideField.field!==null&&state.data[state.sideField.field]!==undefined&&state.data[state.sideField.field]!==null)
                {
                    var fields=new Array();
                    for(var field in state.data[state.sideField.field][0])
                    {
                        fields.push(<td key={colSpan}>{field}</td>);
                        colSpan++;
                    }
                    var trs=new Array();
                    var clickCb=this.clickCb;
                    state.data[state.sideField.field].map(function(row,i) {
                        var tds=new Array();
                        var j=0;

                        for(var cell in row) {
                            tds.push(
                                <td key={j++}>
                                    {row[cell]}
                                </td>);
                        }

                        trs.push(
                            <OrdinaryTr key={i} clickCb={clickCb} dataField={props.sideField.field} data-index={i}>
                                {tds}
                            </OrdinaryTr>
                        )



                    });
                    sideTables=(
                        <table className="table table-bordered center" key={0}>
                            <tbody>
                            <tr>{fields}</tr>
                            {trs}
                            </tbody>
                        </table>);
                    if(sideTables!==undefined&&sideTables!==null)
                        sideDist=(
                            <div className="col-sm-3" key={1}>
                                {sideTables}
                            </div>
                        )
                }else{}



            }


            var hide;
            //渲染隐藏组件
            if(this.state.hiddenInfo!==null&&this.state.hiddenInfo!==undefined)
            {
                if(this.state.hiddenInfo.comp!==undefined&&this.state.hiddenInfo.comp!==null)
                {
                    var hide$c;
                    switch(this.state.hiddenInfo.comp)
                    {
                        case 'panel':
                           hide$c= <Panel
                               bean={this.state.hiddenInfo.data}
                               autoComplete={true}
                               auto={true}
                               returnCb={this.returnCb}
                               />
                            break;
                        default:
                            break;
                    }
                    hide=
                        <Hide>
                            {hide$c}
                        </Hide>

                }
            } else {
            }
            var mainDist;
            if(sideDist!==undefined&&sideDist!==null)
                mainDist=(
                    <div className="col-sm-9" key={0}>
                        <div ref="hideDiv">
                            {hide}
                        </div>
                        {tables}
                    </div>
                );
            else
                mainDist=(
                    <div className="col-sm-12 col-md-12" key={0}>
                        <div ref="hideDiv">
                            {hide}
                        </div>
                        <div ref="contentDiv">{tables}</div>
                    </div>
                );
            var highLight=this.props.highLight;
            var gradient=this.props.gradient;
            return (

                <div className={highLight==true?"ordinaryTable highLight":gradient==true?"ordinaryTable gradient":"ordinaryTable"} style={{margin:"0px"}}>
                    <div className="row">
                        {sideDist}
                        {mainDist}
                    </div>
                    <iframe ref="QueryA" methpd="post" style={{display:"none"}}/>
                </div>


            )

        }

    }

});
export default OrdinaryTable;