import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/ConsultationDetails.css';
var SyncStore = require('../../../components/flux/stores/SyncStore');
import Calendar from './Calendar.jsx';
var ProxyQ = require('../../../components/proxy/ProxyQ');
import Upload from '../../../components/basic/Upload.jsx';

var ConsultationDetails=React.createClass({

    Branch:function(url) {

        //if (this.state.session != true) {
        //    var loginModal = this.refs['loginModal'];
        //    $(loginModal).modal('show');
        //} else {
        if(this.props.Branch!==undefined&&this.props.Branch!==null)

        {
            var successModal = this.refs['successModal'];
            $(successModal).modal('hide');
            this.props.Branch(url);
            //var state = store.get('loginState');

        }
        //}

    },
    onChildChanged: function (date) {
                this.setState({
                    img: date
                });

    },
    uploadAllQuestionContents:function(){
        if(this.state.img!=null||this.state.img!=undefined){
            this.state.attachId=true;
        }
        else{
            this.state.attachId=false;
        }
        this.saveOrUpdateQuestionContent();
    },


    getInitialState  : function () {
        var data=null;
        data = this.props.data;
        var title=null;
        title=this.props.title;
        var personId=null;
        personId=this.props.personId;
        var date=null;
        date=this.props.date;
        var comments=null;
        comments=this.props.comments;
        var img=null;
        img=this.props.img;
        this.getNotes();
        return ({data: data,
            title:title,
            personId:personId,
            date:date,
            comments:comments,
            files: []
        });
    },
    onSaveInput:function(event){

        this.state.content=event.target.value;
        //this.setState({content: event.target.value});

    },
    saveOrUpdateQuestionContent:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'saveOrUpdateProblemContent',
            themeId:this.state.data.data[0].themeId,
            content:this.state.content,
            attachId:this.state.attachId,

            attachType : '73',
            ownerId : this.state.personId,
            fileName : this.state.content+'.jpg',
            folderName :'question' ,
            fileData:this.state.img

        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                if(ob.data=='success'){
                    var successModal = this.refs['successModal'];
                    $(successModal).modal('show');
                }

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getNotes:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insurancePersonalCenterProblemPage',
            reactActionName:'getUserInfo'
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                if(ob.data==this.state.personId){
                    this.setState({myself:true,notes:SyncStore.getNote()});
                }

            }.bind(this),

            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },

    render:function(){
        var lrs=[];
        if(this.state.notes==true&&this.state.myself==true){
            lrs.push(
                <div key={'my'}>
                    <form  className="row"  method="post">
                        <div className="span2">
                            <label >继续提问:<span>*</span> </label>
                        </div>
                        <div className="span6">
                            <textarea  onChange={this.onSaveInput.bind(this)} name="message"  className="required span6" rows="6" title="* Please enter your message"></textarea>
                        </div>
                        <div className="span2">
                            <label>上传图片: <span>*</span> </label>
                        </div>
                        <Upload ctrlName={'test'} callbackParent={this.onChildChanged.bind(this)}/>
                        {this.state.img ?
                            <div className="thumb-box" style={{height:'200px',width:'300px',margin:'2px'}}>
                               <img     style={{marginLeft: '46%',
                                   marginTop: '3%'}}src={this.state.img}/>
                            </div> : null}
                        <div className="span6 offset2 bm30">
                            <input  onClick={this.uploadAllQuestionContents}  value="Send Message" className="btn btn-inverse"/>
                        </div>
                        <div className="span6 offset2 error-container"></div>
                        <div className="span8 offset2" ></div>
                    </form>
                </div>
            )
        }
        else{

        }
        var contents=this.state.data.data;
        var trs=[];
        contents.map(function (item, i) {
            if(item.contentType==1){
                trs.push(
                    <dl className="faqs" key={i}>
                        <dt>{item.content}</dt>

                        {item.attach ?
                            <div className="thumb-box" style={{height:'200px',width:'300px',margin:'2px'}}>
                                <img     style={{marginLeft: '10%',
                                   marginTop: '3%'}}src={item.attach}/>
                            </div> : null}
                    </dl>
                )
            }else{
                trs.push(
                    <dl className="faqs" key={i}>
                        <dd>{item.content}
                        </dd>
                        {item.attach ?
                            <div className="thumb-box" style={{height:'200px',width:'300px',margin:'2px'}}>
                                <img     style={{marginLeft: '10%',
                                   marginTop: '3%'}}src={item.attach}/>
                            </div> : null}
                    </dl>
                )
            }

        });
        return(
    <div >
        <div className="page-container">
            <div className="container">
                <div className="row">
                    <div className="span8 page-content">

                        <article className=" type-post format-standard hentry clearfix">

                            <h1 className="post-title"><a href="#">{this.state.title}</a></h1>

                            <div className="post-meta clearfix">
                                <span className="icon-calendar">{this.state.date.month+1+'月'+this.state.date.date+'日'}</span>
                                <span className="icon-comment">
                                    <a href="#" title="Comment on Integrating WordPress with Your Website">
                                        {this.state.comments+'  '}Comments
                                    </a>
                                </span>
                            </div>
                        </article>
                        <div>
                            <dl className="faqs" >
                                <dt>{this.state.title}</dt>
                            </dl>
                            {trs}
                        </div>
                        <hr/>
                        {lrs}

                    </div>

                </div>
            </div>
        </div>

        <div className="modal fade bs-example-modal-sm login-container"
             tabIndex="-1"
             role="dialog"
             aria-labelledby="myLargeModalLabel"
             aria-hidden="true"
             ref='successModal'
            >
            <div className="modal-dialog modal-sm" style={{position:'absolute',top:'30%',width:'50%',marginLeft:'25%'}}>
                <div className="modal-content" style={{position:'relative',width:'100%',padding:'40px'}}>

                    <div className="modal-body">
                        <div className="form-group" style={{position:'relative'}}>
                            <div>{'问题已经提交，请耐心等待客服人员解答！'}</div>
                            <input className='search-new' value="OK"
                                onClick={this.Branch.bind(this,undefined)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        )


    },


});
module.exports=ConsultationDetails;