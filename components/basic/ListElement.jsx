import React from 'react';
import ButtonElement from './ButtonElement.jsx';
import LinkElement from './LinkElement.jsx';
import '.././../css/components/basic/ListElement/ListElement.css';

/**
 *  @example
 *  <ListElement  data-options={data$options} applyCb={this.applyHandle}
 *  cancelCb={this.cancelHandle}/>
 *  @property,
 *
 *
 * @property,explicit:option: data-options{undefined||null||Object}
 * @property,explicit:option:   data-options.params{Array},
 * this property will form the content of list;
 * @property,implicit:option:   data-options.components{customer}
 * @property,implicit:option:   data-options.selected:{Integer}
 * this prop will make the first menu in list to be choosed
 */
var ListElement=React.createClass({
    linkCb:function(evt){
        var target=evt.target;
        var selected=$(target).attr("data-index");
        this.setState({selected:selected});
    },
    applyCb:function(){
        if(this.props.applyCb!==undefined&&this.props.applyCb!==null)
        {
            if(this.state.selected!==null&&this.state.selected!==undefined
            &&!isNaN(parseInt(this.state.selected)))
            {
                if(this.state.li$items!==undefined&&this.state.li$items!==null)
                {
                    this.props.applyCb(
                        {content:this.state.li$items[this.state.selected],
                        index:this.state.selected});
                }
            }
        }
    },
    cancelCb:function(evt){
        //cancel callback
        this.setState({selected:-1});
        if(this.props.cancelCb!==undefined&&this.props.cancelCb!==null)
            this.props.cancelCb(evt);
    },
    getInitialState:function(){

        var components;
        var li$items;

        if(this.props["data-options"]!==undefined&&this.props["data-options"]!==null)
        {
            //component fetch
            if(this.props["data-options"].components!==undefined&&this.props["data-options"].components!==null
            &&this.props["data-options"].components.length>0) {
                components=this.props["data-options"].components;
            }

            //ui item
            if(this.props["data-options"].params!==undefined&&this.props["data-options"].params!==null&&this.props["data-options"].params.length>0) {
                li$items=this.props["data-options"].params;
            }

            //selected item
            var selected;
            if(this.props["data-options"].selected!==undefined&&this.props["data-options"].selected!==null
            &&!isNaN(parseInt(this.props["data-options"].selected)))
            {
                selected=this.props["data-options"].selected;
            }
        }


        return  {components:components,li$items:li$items,selected:selected};
    },
    render:function(){

        //selected
        var selected;
        if(this.state.selected!==undefined&&this.state.selected!==null)
        {
            selected=this.state.selected;
        }


        //list-group-item
        var li$items;
        var linkCb=this.linkCb;
        if(this.state.li$items!==null&&this.state.li$items!==undefined)
        {
          li$items=this.state.li$items.map(function(item,i) {
              if(selected!==null&&selected!==undefined)
              {
                  if(selected==i)
                      return (<LinkElement linkClass={"list-group-item active"} data-index={i} clickCb={linkCb} key={i}>
                          {item}</LinkElement>);
                  else
                      return (<LinkElement linkClass={"list-group-item"} data-index={i} clickCb={linkCb} key={i}>
                          {item}</LinkElement>);
              }
              else
                  return (<LinkElement linkClass={"list-group-item"} data-index={i} clickCb={linkCb} key={i}>
                      {item}</LinkElement>);
          })  ;
        }

        //components
        var components;
        var applyCb=this.applyCb;
        var cancelCb=this.cancelCb;
        if(this.state.components!==undefined&&this.state.components!==null) {
            components=this.state.components.map(function(item,i) {
                if(item.type=="apply")//提交
                {
                    return (<ButtonElement  type="button"
                                    buttonClass="btn btn-default" title={item.name}
                                    handle={applyCb} key={i}/>);
                }
                if(item.type=="cancel")//返回
                {
                    return(<ButtonElement  type="button"
                                    buttonClass="btn btn-default" title={item.name}
                                    handle={cancelCb} key={i}/>);
                }
            })
        }

        //centerStyle
        var centerStyle = {textAlign: "center"};
        return(
            <div align="center" style={centerStyle}>
                <ul className="list-group">
                    {li$items}
                </ul>
                {components}
            </div>
        );
    }
});
export default ListElement;