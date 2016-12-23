import React from 'react';
import {render} from 'react-dom';
import '../../css/components/basic/indexScroll.css';

var IndexScroll=React.createClass({
    clickBox:function(ref,sel1,sel2,cl)
    {
        //invoked by ".index_scroll_bottom",".index_scroll_down","index_scroll_bottom_up"
        //obj1 = '.index_scroll_bottom',cl = 'index_scroll_bottom_up'
        var category=this.refs[ref];
        var $category=$(category);
        var obj1=$category.find(sel1);
        var obj2=$category.find(sel2);

        $(obj1).click(function(e){
            //id=$(obj1).index($(this));
            e.stopPropagation();
            //如果当前.index_scroll_down未展开
            if($(this).attr('data-stretch')==0){
                $(".index_scroll_box").animate({ height: "652px" }, 300);

                //所有.index_scroll_bottom的集合元素都去除.index_scroll_bottom_up伪类
                $(obj1).each(function(){
                    $(this).html($(this).attr("data-text"));
                    $(this).removeClass(cl);
                });

                //当前被点击的.index_scroll_bottom元素增加.index_scroll_bottom_up伪类
                $(this).html("收起");
                $(this).addClass(cl);
                //改变状态
                $(obj1).attr("data-stretch","0");
                $(this).attr("data-stretch","1");
                //当前被点击的.index_scroll_bottom下个兄弟结点.index_scroll_down展开
                $(this).next().slideDown(300);
                //其他所有.index_scroll_down缩回
                $(this).parent().siblings().find(obj2).slideUp(300);
                $($category.find(".index_scroll")).css("z-index","9");
            }
            else{

                $($(category).find(".index_scroll_box")).animate({ height: "120px" }, 300);
                $(this).html($(this).attr("data-text"));
                $(this).removeClass(cl);
                $(this).attr("data-stretch","0");
                $(this).next().slideUp(300);
            }

        });

        $(document).bind("click",function(e){

            $(obj1).each(function(e){
                if($(this).attr('data-stretch')==1){
                    $($category.find(".index_scroll_box")).animate({ height: "120px" }, 300);
                    $(this).html($(this).attr("data-text"));
                    $(obj1).attr("data-stretch","0");
                    $(obj2).slideUp(300);
                    $(obj1).removeClass(cl);
                }
            });
        });

        //点按钮/链接后层收起
        $(obj2).find(".a_link , input[type=button] , button").on("click", function(e){
            $(obj1).each(function(e){
                if($(this).attr('data-stretch')==1)
                {
                    $category.find((".index_scroll_box")).animate({ height: "120px" }, 300);
                    $(this).html($(this).attr("data-text"));
                    $(this).attr("data-stretch","0");
                    $(obj2).slideUp(300);
                    $(obj1).removeClass(cl);
                }

            });
        });

        $(obj2).click(function(e){
            e.stopPropagation();
        });

    },
    index_scroll_02:function(ref,chang_sel,right_sel,left_sel,Swidth,num_obj){

        var category=this.refs[ref];
        var $category=$(category);
        var right_obj=$category.find(right_sel);
        var left_obj=$category.find(left_sel);
        var chang_obj=$category.find(chang_sel);
        var len = $(chang_obj).find(num_obj).length;
        //index点击次数，i是一页li个数
        var index = 0 ,i=4;
        //num = Math.ceil(len / i);
        var Awidth = 0;
        if(len < i+1 ){//隐藏
            $(right_obj).hide();
            $(left_obj).hide();
        }else{
            $(left_obj).removeClass('index_scroll_left_a_hover');
            $(right_obj).addClass('index_scroll_right_a_hover');
        }

        $(right_obj).click(function(){//下一页

            var Mwidth = len-(index+1)*i;

            if(Mwidth>i) {
                $(left_obj).addClass('index_scroll_left_a_hover');
                // $(right_obj).removeClass('index_scroll_right_a_hover');
                $(chang_obj).stop(true, false).animate({left: -(index+1)*Swidth*i+"px"},600);
                index++;
            } else {
                $(left_obj).addClass('index_scroll_left_a_hover');
                //$(left_obj).removeClass('index_scroll_left_a_hover');
                $(right_obj).removeClass('index_scroll_right_a_hover');
                Awidth = Mwidth;
                $(chang_obj).stop(true, false).animate({left:-index*Swidth*i-Swidth*Mwidth+"px"},600);
            }

        });
        $(left_obj).click(function() { //上一页
            if(index==0) {
                var Mwidth = len-i;

                $(right_obj).addClass('index_scroll_right_a_hover');
                $(left_obj).removeClass('index_scroll_left_a_hover');
                $(chang_obj).stop(true, false).animate({left: "0px"},600);
            }else {
                $(left_obj).addClass('index_scroll_left_a_hover');
                //$(right_obj).removeClass('index_scroll_right_a_hover');
                $(chang_obj).stop(true, false).animate({left: -(index-1)*Swidth-Swidth*Awidth+"px"},600);
                index--;
            }
        });

    },
    fetch:function(){
        this.queryHandle(
            null,
            this.props.query.url,
            this.props.query.params,
            'json',
            function(response){
                var data;
                var ob=new Object();
                if(Object.prototype.toString.call(response)!='[object Array]')
                    if(response.data!==undefined&&response.data!==null)
                        if(Object.prototype.toString.call(response.data)=='[object Array]')
                            data=response.data;
                        else
                            data=response;
                ob.data$initialed=true;
                if(data!==undefined&&data!==null)
                    ob.data=data;
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
    getInitialState:function()
    {
        var data;
        var data$initialed;
        if(this.props.data!==undefined&&this.props.data!==null)
        {
            data = this.props.data;
            data$initialed=true;
        }

        var auto;
        if(this.props.auto!==undefined&&this.props.auto!==null)
            auto=this.props.auto;

        return ({data:data,data$initialed:data$initialed,auto:auto});
    },
    render:function(){
        if(this.state.data$initialed!==true&&(this.props.data==null||this.props.data==undefined))
        {
            if(this.state.auto==true)
                this.fetch();
            return (<div></div>)

        }else{
            var scrolls;
            if(this.state.data!==undefined&&this.state.data!==null)
            {
                scrolls=new Array();
                var scrollDown=this.scrollDown;
                this.state.data.map(function(item,i) {

                    var labels;
                    var down;
                    if(item.down!==undefined&&item.down!==null&&Object.prototype.toString.call(item.down.labels)=='[object Array]')
                    {
                        labels=new Array();
                        item.down.labels.map(function(label,j) {
                            labels.push(
                                <label key={j} className="label_radio">
                                    <input name={label.name} type="radio"/>
                                    {label.title}
                                </label>);
                        });
                        down=
                            <div className="index_scroll_down" style={{display:"none"}}>
                                <dl>
                                    <dt>{item.down.title}</dt>
                                    <dd>
                                        {labels}
                                    </dd>
                                </dl>
                                <div className="btn">
                                    <span className="choice_button">
                                     <button>{item.bottom}</button>
                                    </span>
                                </div>
                            </div>
                    }
                    scrolls.push(
                        <li className="index_scroll_li" key={i}>
                            <div className="index_scroll_top">
                                <div className="index_scroll_icon">
                                    <img
                                        src={App.getResourceDeployPrefix()+"/images/upload/20151210_1449718015/20151210112849011770.png"}
                                         style={{width:"55px", height:"55px"}}/>
                                </div>
                                <div className="index_scroll_text">
                                    <div className="index_scroll_title">
                                        <span>{item.title}</span>
                                    </div>
                                    <div className="index_scroll_value">
                                        <span>{item.viceTitle}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="index_scroll_bottom" data-stretch="0" data-text={item.bottom}>
                                {item.bottom}
                            </div>
                            {down}
                        </li>);
                });

            }
            return (
                <div className="index_scroll" style={{zIndex:"9",marginTop:"20px"}} ref="index_scroll">
                    <div className="index_scroll_left">
                        <a href="javascript:void(0)" ></a>
                    </div>
                    <div className="index_scroll_right index_scroll_right_a_hover">
                        <a href="javascript:void(0)" ></a>
                    </div>
                    <div className="index_scroll_box" style={{height: "120px"}} >
                        <div className="index_scroll_main">
                            <ul>
                                {scrolls}
                            </ul>
                        </div>
                    </div>
                </div>
            )

        }

    },
    componentDidMount:function(){
        this.clickBox("index_scroll",".index_scroll_bottom",".index_scroll_down","index_scroll_bottom_up");
        this.index_scroll_02("index_scroll",'.index_scroll_main','.index_scroll_right','.index_scroll_left','243','.index_scroll_li');

    }
});
module.exports = IndexScroll;