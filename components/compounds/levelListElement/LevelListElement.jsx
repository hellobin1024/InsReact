import React from 'react';
import LiElement from '../../basic/LiElement.jsx';
import HideElement from '../../../components/basic/HideElement.jsx';
import '../../../css/components/compounds/LevelListElement/LevelListElement.css';
/**
 * @property,explicit:required: data
 * @description,this component looks like a shit
 *
 *
 */
var LevelListElement=React.createClass({
    foldCb:function(formName){
        console.log();
        //$("form[name!='"+formName+"']").show();
        $("form[name='"+formName+"']").fadeToggle();
        $(this.refs.levelList).slideToggle();
        this.setState({newsInfo:null});

    },
    fetch:function(){
        this.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function(response){
                this.setState({data:response,data$initialed:true});
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
    clickCb:function(host){
        var target=host;
        var index=$(target).attr("data-index");//二维数组下标
        var pos=$(target).attr("data-pos");//一维数组下标






        if($(target).hasClass("first"))
        {
            if($(target).find("span").hasClass("glyphicon-menu-down"))
            {
                $(target).find("span.glyphicon").removeClass("glyphicon-menu-down");
                $(target).find("span.glyphicon").addClass("glyphicon-menu-up");
                $(target).next(".embed-div").slideDown();
            }else{
                $(target).find("span.glyphicon").addClass("glyphicon-menu-down");
                $(target).find("span.glyphicon").removeClass("glyphicon-menu-up");
                $(target).next(".embed-div").slideUp();
            }
        }
        else if($(target).hasClass("second"))//如果点击项为当前列表二级项
        {
            var branch=this.state.branch;
            var first=this.state.data[branch[0].field][pos];
            var second=first[branch[1].field][index];
            var content;
            if(second.content!==undefined&&second.content!==null)
            {
                content=second.content;
            }
            var newsInfo={
                content:content,
                title:second.title
            }
            this.setState({newsInfo:newsInfo});
            $(this.refs.hideForm).slideToggle();
            $(this.refs.levelList).fadeToggle();
            //$("form[name='hideForm']").slideToggle();
        }
        else{}

    },
    getInitialState:function() {

        var data;
        if(this.props.data!==null&&this.props.data!==undefined)
        data=this.props.data;

        var data$initialed;
        if(data!==undefined&&data!==null)
            data$initialed=true;
        else
            data$initialed=false;

        var auto;
        if(this.props.auto!==undefined&&this.props.auto!==null)
            auto=this.props.auto;

        var branch;
        if(this.props.branch!==undefined&&this.props.branch!==null)
        {
            branch=this.props.branch;
        }

        //选中的新闻信息
        var newsInfo;
        if(this.props.newsInfo!==undefined&&this.props.newsInfo!==null)
        {
            newsInfo=this.props.newsInfo;
        }

        return {data:data,auto:auto,data$initialed:data$initialed,branch:branch,newsInfo:newsInfo};
    },
    render:function(){
        var noneStyle={display:"none"};
        var li$items;
        if(this.state.data$initialed==false&&(this.props.data==undefined||this.props.data==null))//如果未加载数据
        {
            if(this.props.auto==true)
                this.fetch();
        }else{//如果已加载数据

            //当列表为2级深度时
            if(this.state.branch!==undefined&&this.state.branch!==null&&Object.prototype.toString.call(this.state.branch)=='[object Array]')
            {

                if(this.state.branch.length==2)
                {
                    var branch=this.state.branch;
                    li$items=new Array();
                    var clickCb=this.clickCb;
                    //二维列表的第一层循环
                    this.state.data[branch[0].field].map(function(first,i)
                    {
                        var embed;
                        if(Object.prototype.toString.call(first[branch[1].field])=='[object Array]'&&first[branch[1].field].length>=1)
                            embed=new Array();

                        var first$li= (<LiElement  className={"list-group-item first "}
                                                  data-pos={i} data-index={0}
                                                  clickCb={clickCb}
                                                  head={true} expand={Object.prototype.toString.call(embed)=='[object Array]'?true:null}>
                            {first[branch[0].title]}</LiElement>);


                        //二维列表的第二层循环
                        first[branch[1].field].map(function(second,j)
                        {

                            embed.push( <LiElement
                                className={"list-group-item second"}
                                data-pos={i} data-index={j}
                                clickCb={clickCb} key={j}>
                                {second[branch[1].title]} ></LiElement>);

                        });


                        li$items.push(
                            <div key={i}>
                                {first$li}
                                <div className="embed-div" >
                                    {embed}
                                </div>
                            </div>
                        );


                    })

                }else{}//递归层次不为2层

            }
        }




        var hideTable;
        if(this.state.newsInfo!==undefined&&this.state.newsInfo!==null)
        {
            var newsInfo=this.state.newsInfo;
            hideTable= <HideElement info={newsInfo} foldCb={this.foldCb} name='hideForm' title="个人简介"
                            dataField="content" data-class="hideTable" />
        }







        return (
            <div>
                <form name='hideForm' style={{display:"none"}} ref="hideForm">
                    {hideTable}
                </form>
                <div className="list-group" align="center" ref="levelList">
                    {li$items}
                </div>
            </div>
                )

    }

});

export default LevelListElement;