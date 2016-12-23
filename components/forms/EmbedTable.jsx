import React from 'react';
import {render} from 'react-dom';
import TdElement from '../../components/forms/TdElement.jsx';
import '../../css/components/forms/embedTable/EmbedTable.css';
import HideElement from '../../components/basic/HideElement.jsx';
import Image from '../../components/basic/Image.jsx';
var ProxyQ = require('../../components/proxy/ProxyQ');


/**
 * EmbedTable,表格组件，请使用&lt;StackedTable /&gt;进行实例化
 * @author outstudio
 * @constructor EmbedTable
 * @example
 * <EmbedTable
 * title={title}
 * query={{
                url:"/gradms/bsuims/reactPageDataRequest.do",
                params:
                {
                    reactPageName:'cultivateTutorPage',
                    reactActionName:'getAllTutorListUseReact'
                }
            }}
 * subQuery={{
                url:"/gradms/bsuims/reactPageDataRequest.do",
                params:{
                    personId:'',
                    reactPageName:'cultivateTutorPage',
                    reactActionName:"personIntroductionShow"
                }
            }}
 * autoFetch={true}
 * />
 *
 *
 *
 *
 *
 *
 */
var EmbedTable=React.createClass({
    foldCb:function(formName){
        console.log();
        //$("form[name!='"+formName+"']").show();
        $("form[name='"+formName+"']").slideToggle();
        this.setState({personInfo:null});

    },
    clickCb:function(ob){
        var url=this.props.subQuery.url;
        if(url==undefined||url==null)
            return ;
        var params;
        params = Object.assign(this.props.subQuery.params, ob);
        ProxyQ.queryHandle(null, url, params, null, function (response) {
            if(response.data!==undefined&&response.data!==null)
            {
                response.data.title="个人简介";
                this.setState({personInfo:response.data});
                $("form[name='hideForm']").slideToggle();
                //$("form[name!='hideForm']").fadeToggle();

            }
        }.bind(this));
    },
    fetch:function(){
        ProxyQ.queryHandle(null, this.props.query.url, this.props.query.params, null, function (response) {
            var data;
            data=response;
            if(data!==undefined&&data!==null) {
                this.setProps({data: data, data$initialed: true})
            }
        }.bind(this));



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

        //指定嵌套表的列宽
        var embedCols;
        if(this.props.embedCols!==undefined&&this.props.embedCols!==null)
            embedCols=this.props.embedCols;
        else
            embedCols=10;

        //存储hideForm的数据,当组件位于二层内部时不能直接使用setProps


        return ({
            autoFetch:autoFetch,data$initialed:data$initialed,embedCols:embedCols
        })
    },
    componentWillReceiveProps:function(props)
    {
        //更新data$initialed状态
        if(props.data$initialed!==undefined&&props.data$initialed!==null)
            this.setState({data$initialed:props.data$initialed});
    },
    render:function(){
        //表格数据未绑定
        if(this.state.data$initialed!==true)
        {
            if(this.state.autoFetch==true)
                this.fetch();

            return (
                <table className="table table-bordered center">
            </table>
            )

        }else{
            //表格数据已绑定
            //不采用this.state.data的原因,state与props不同步

            var trs=null;
            if(this.props.data!==undefined&&this.props.data!==null)
            {
                trs=new Array();
                var embedCols=this.state.embedCols;
                var clickCb=this.clickCb;
                var props = this.props;
                //data.arr为多数据源数组
                this.props.data.arr.map(function(item,i) {
                    var sub$data;
                    if(item.data!==undefined&&item.data!==null)
                        sub$data=item.data;
                    else
                        return false;
                    var sub$title = null;
                    if(item.title!==undefined&&item.title!==null)
                    {
                        sub$title=(<td rowSpan={1} style={{verticalAlign:"middle",textAlign:"center"}}>{item.title}</td>);
                    }
                    var rows=parseInt(sub$data.length/embedCols)+1;
                    var td$table;
                    var sub$trs=new Array();
                    var sub$tds;
                    var sub$row$index=0;
                    //特定数据源单件
                    sub$data.map(function(sub,j) {
                        if(j%embedCols==0)
                        {
                            sub$tds=new Array();
                        }
                        var content = "";
                        if (item.filterField !== undefined && item.filterField !== null) {
                            var content = sub[item.filterField];
                            var ids = content.split("|");
                            if (ids.length >= 2 && Object.prototype.toString.call(ids) == '[object Array]') {
                                switch (ids[1]) {
                                    case 'image':
                                        var source = eval('(' + ids[0] + ')');
                                        var check = function (ob) {
                                            if (props.checkCb !== undefined && props.checkCb !== null) {
                                                if (ob == true)
                                                    props.checkCb({index: source.id, checked: true});
                                                else
                                                    props.checkCb({index: source.id, checked: false});
                                            }
                                        }
                                        sub$tds.push(
                                            <td key={j} style={{border:"0px"}}>
                                                <Image link={source.link}
                                                       src={source.src}
                                                       type={source.type}
                                                       checkCb={check}/>
                                                <span>{source.name}</span>
                                            </td>);
                                        break;
                                    case 'link':

                                        break;
                                    case 'span':
                                    default:
                                        sub$tds.push(
                                            <TdElement key={j} data={sub} clickCb={clickCb}>{ids[0]}</TdElement>);
                                        break;
                                }
                            } else {
                                sub$tds.push(
                                    <TdElement key={j} data={sub} clickCb={clickCb}>{content}</TdElement>);
                            }
                        }
                        else {
                            sub$tds.push(
                                <TdElement key={j} data={sub} clickCb={clickCb}></TdElement>);
                        }

                        if(j%embedCols==(embedCols-1)||j==sub$data.length-1)
                        {
                            sub$trs.push(<tr key={sub$row$index}>{sub$tds}</tr>);
                            sub$row$index++;
                        }
                    });

                    if (item.border == "none")
                    td$table=(
                        <table className={item.border=="none"?"table center":"table center "+"table-bordered"} key={i}>
                        <tbody>
                        {sub$trs}
                        </tbody>
                    </table>);


                    trs.push(
                        <tr key={i}>
                            {sub$title}
                            <td>{td$table}</td>
                        </tr>
                    )
                });

            }


            var hideTable;
            if(this.state.personInfo!==undefined&&this.state.personInfo!==null)
            {
                var info = this.state.personInfo;
                hideTable =
                    <HideElement info={info} foldCb={this.foldCb} name='hideForm' title="个人简介" dataField="email"/>
            }

            var title = null;
            if (this.props.title !== undefined && this.props.title !== null) {
                title = <thead>
                <tr>
                    <th colSpan={2}>{this.props.title}</th>
                </tr>
                </thead>
            }




            return (
                <div>
                    <form name='hideForm' style={{margin:"20px",display:'none'}}>
                        <div className="row" >
                            <div className="col-sm-12">
                                {hideTable}
                            </div>
                        </div>
                    </form>
                    <form name="embedTableForm" className="form embedTable" method="post" style={{margin:"20px"}}>
                        <div className="row">
                            <div className="col-sm-12">
                                <table className="table table-bordered center">
                                    {title}
                                    <tbody>
                                    {trs}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
           )

        }


    }
});
module.exports = EmbedTable;