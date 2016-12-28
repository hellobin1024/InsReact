import React from 'react';
import {render} from 'react-dom';
import '../../../css/insurancems/components/lifeDetails.css'
var ProxyQ = require('../../../components/proxy/ProxyQ');

var LifeDetail=React.createClass({
    getInitialState: function() {
        var productId=null;
        productId=this.props.productId;
        var productName=null;
        productName=this.props.productName;
        //var briefly=null;
        //briefly=this.props.briefly;
        var productStar=null;
        productStar=this.props.productStar;
        return {
            productId:productId,
            productName:productName,
            //briefly:briefly,
            productStar:productStar
        }
    },
    initialData:function(){

        window.setTimeout(function () {

            this.getLifeBrief();
        }.bind(this), 300);

    },

    getInsuranceClause:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getInsuraceClause',
            attachId:924
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            'html',
            function(ob) {

            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    getLifeBrief:function(){
        var url="/insurance/insuranceReactPageDataRequest.do";
        var params={
            reactPageName:'insuranceLifeProductCenterPage',
            reactActionName:'getLifeBrief',
            productId:this.state.productId
        };
        ProxyQ.queryHandle(
            'post',
            url,
            params,
            null,
            function(ob) {
                this.setState({data:ob.data,
                attach:ob.attach,
                image:ob.image});
            }.bind(this),
            function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        );
    },
    render:function(){
        if(this.state.data!==undefined&&this.state.data!==null){
            var data=this.state.data[0];
            var risk=data.risk;
            var fitPeople=data.insuranceLifeProduct.fitPeople;
            var paymentPeriod=data.paymentPeriod;
            var safeGuardPeriod=data.safeGuardPeriod;
            var paymentType=data.paymentType;
            var example=data.example;
            var image=this.state.image;
            var attach=this.state.attach[0].productName;



        }else{
            this.initialData();
        }


        return <div className="basic" style={{width:'98%'}}>
            <div className="business">
                <h2>产品详情</h2>
            </div>
            <div className="value">
                <p>推荐星级:</p>
                <label className="check" style={{paddingLeft:'0px'}}>
                    <span  className="glyphicon glyphicon-star" ></span>
                </label>
            </div>
            <ul style={{height: 'auto'}}>
                <div className="proIntro">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>产品介绍</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <h4 className="lifeTitle">{this.state.productName}</h4>
                    <div className="risk">
                        <span>风险提示：{risk}</span>
                    </div>
                    <div className="productIntro">
                        <div className="proleft">
                            <img  style={{height: '392px'}}src={image}/>

                        </div>
                        <div className="proright">
                            <div className="line-height25"><span className="bold">适用人群:</span>{fitPeople}</div>
                            <div className="line-height25"><span className="bold">交费期:</span> {paymentPeriod}</div>
                            <div className="line-height25"><span className="bold">保障期:</span> {safeGuardPeriod}</div>
                            <div className="line-height25"><span className="bold">交费方式:</span> {paymentType}</div>
                            <div className="pro_tese">
                                <dl>
                                    <dt>产品特色：</dt>
                                    <dd>
                                        <ul>
                                            <li>责任全</li>
                                            <li>保障高</li>
                                            <li>健康养老两不误 </li>
                                            <li>特定疾病多次赔付不减保 </li>
                                        </ul>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>保障范围：</dt>
                                    <dd>
                                        <ul>
                                            <li>身故保险金</li>
                                            <li>重大疾病保险金</li>
                                            <li>特定疾病保险金</li>
                                            <li>生存保险金</li>
                                        </ul>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="lyys">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>利益测算</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                </div>
                <div className="kfjx">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>可附加险种</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="line-height35">您可以根据自己的需要选购您所需的附加产品：</div>
                    <div className="bxj ">
                        <p className="bold bzfwp text"><input style={{marginRight:"2em"}} type="checkbox"/>非意外身故保险金</p>
                        <p className="bold bzfwp text"><input style={{marginRight:"2em"}} className="fjxbox" type="checkbox"/>{attach}</p>
                    </div>
                </div>
                <div className="bzfw">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>保障范围</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="bznr">
                        <div className="line-height35">在本合同有效期内，我们承担如下保险责任：</div>
                        <div className="red bold line-height35">保障责任：</div>
                        <div className="bxj ">
                            <p className="bold bzfwp text">1．非意外身故保险金</p>
                            <p className="text-indent2em line-height25 text">被保险人非因意外伤害事故导致身故的，我们按被保险人身故时已交保险费之和的110%给付非意外身故保险金，本合同终止。</p>
                        </div>
                        <div className="bxj">
                            <p className="bold bzfwp text">2．水陆公共交通工具意外身故保险金</p>
                            <p className="text-indent2em line-height25 text">被保险人以乘客身份乘坐客运水陆公共交通工具期间遭受意外伤害事故，并自该事故发生之日起180日内（含180日当日）因该事故为直接且单独的原因导致身故的，我们按以下情形之一的金额给付水陆公共交通工具意外身故保险金，本合同终止。 </p>
                            <p className="text-indent2em line-height25 text">（1）若被保险人身故时未满70周岁，则为20倍本合同基本保险金额；</p>
                            <p className="text-indent2em line-height25 text">（2）若被保险人身故时已满70周岁（含70周岁），则为2倍本合同基本保险金额。</p>
                        </div>
                        <div className="red bold line-height35">责任免除：</div>
                        <div className="bxj">
                            <p className="bold text-indent2em line-height25 text">因下列第（1）至第（7）项情形之一，导致被保险人身故的，我们不承担给付保险金的责任；因下列第（8）至第（11）项情形之一，导致被保险人身故的，我们不承担给付水陆公共交通工具意外身故保险金、航空意外身故保险金和其他意外身故保险金的责任，但我们承担给付非意外身故保险金的责任：</p>
                            <p className="text-indent2em line-height25 text">（1）投保人对被保险人的故意杀害、故意伤害；</p>
                            <p className="text-indent2em line-height25 text">（2）被保险人故意自伤、故意犯罪或者抗拒依法采取的刑事强制措施；</p>
                            <p className="text-indent2em line-height25 text">（3）被保险人自本合同成立或者合同效力恢复之日起2年内自杀，但被保险人自杀时为无民事行为能力人的除外；</p>
                            <p className="text-indent2em line-height25 text">（4）被保险人酗酒、殴斗、服用、主动吸食或注射毒品,违反规定使用麻醉或精神药品。未遵医嘱私自服用、涂用、注射药物；</p>
                            <p className="text-indent2em line-height25 text">（5）被保险人酒后驾驶，无合法有效驾驶证驾驶，或驾驶无有效行驶证照的机动车；</p>
                            <p className="text-indent2em line-height25 text">（6）战争、军事冲突、暴乱或武装叛乱；</p>
                            <p className="text-indent2em line-height25 text">（7）核爆炸、核辐射或核污染；</p>
                            <p className="text-indent2em line-height25 text">（8）被保险人从事潜水、滑水、滑雪、滑冰、滑翔翼、热气球、跳伞、攀岩、探险活动、武术比赛、摔跤比赛、柔道、空手道、跆拳道、拳击、特技表演、蹦极、赛马、赛车、各种车辆表演及车辆竞赛等高风险运动；</p>
                            <p className="text-indent2em line-height25 text">（9）被保险人患精神和行为障碍（以世界卫生组织颁布的《疾病和有关健康问题的国际统计分类（ICD－10）》为准）；</p>
                            <p className="text-indent2em line-height25 text">（10）在诊疗过程中发生的医疗事故；</p>
                            <p className="text-indent2em line-height25 text">（11）被保险人违反承运人关于安全乘坐客运公共交通工具的规定。</p>
                            <p className="text-indent2em line-height25 text">发生上述第（1）项情形导致被保险人身故的，本合同终止，您已交足2年以上保险费的，我们向受益人退还保险单的现金价值。</p>
                            <p className="text-indent2em line-height25 text">发生上述第（2）至（7）项情形导致被保险人身故的，本合同终止，我们向您退还保险单的现金价值。</p>
                        </div>
                        <div className="bxj line-height35">具体保障责任以<a onClick={this.getInsuranceClause} style={{color:'blue'}} target="_blank" >《国华畅享无忧两全保险》</a>条款为准。</div>
                    </div>
                </div>
                <div className="jlsm">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>举例说明</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="lizi">
                        <p className="bzfwp line-height25 text">李先生30周岁时为自己投保国华畅享无忧两全保险，年缴保费4800元，缴费10年，获得保障30年，李先生拥有如下利益：</p>
                        <p className="bzfwp line-height25 text">保险责任如下：</p>
                        <p className="bzfwp line-height25 text">非意外身故保险金 ：已交保险费之和的110%</p>
                        <p className="bzfwp line-height25 text">其他意外身故保险金：1000000元（保单第一年度为500000元）</p>
                        <p className="bzfwp line-height25 text">水陆公共交通工具意外身故保险金：2000000元</p>
                        <p className="bzfwp line-height25 text">航空意外身故保险金：3000000元</p>
                        <p className="bzfwp line-height25 text">满期保险金：57600元</p>
                        <p className="bzfwp line-height25 text"><b>【重要声明】</b></p>
                        <p className="bzfwp line-height25 text">案例演示仅供参考，具体保险责任以保险条款为准。</p>
                        <p className="bzfwp line-height25 text">{example}</p>
                    </div>

                </div>
                <div className="shfw">
                    <h3 style={{color: 'firebrick',fontFamily: 'Nunito sans-serif',paddingRight:'80%'}}>售后服务</h3>
                    <hr style={{borderTop: '5px solid firebrick',width: '86%',marginLeft:'7%'}}/>
                    <div className="shfw_dl">
                        <div className="bjx">
                            <p className="bold bzfwp text">理赔报案服务</p>
                            <p className="text-indent2em line-height25 text">我们提供多种报案渠道供客户在出险后及时向我们报案，您可以通过全国客户服务热线电话95549、短信、邮件、各机构所在地理赔报案专线、各机构网点柜台等渠道申请理赔报案，我们将第一时间为您服务。若您需要了解具体的报案服务内容，可通过“客户服务－理赔服务” 栏目中进行查询。  </p>
                        </div>
                        <div className="bjx">
                            <p className="bold bzfwp text">保单变更服务</p>
                            <p className="text-indent2em line-height25 text">保单变更是指保险公司为了维持人身保险单的持续有效，根据合同条款约定及客户要求而提供的一系列后续服务。保险合同保单变更服务的对象是已出单的保险合同。若您需要了解具体的保单变更服务项目，可通过“客户服务－保单变更服务”栏目中进行查询。 </p>
                        </div>
                        <div className="bjx">
                            <p className="bold bzfwp text">全国统一客服热线95549服务</p>
                            <p className="text-indent2em line-height25 text">若您有任何疑问，欢迎拨打我公司全国统一客服热线95549咨询，我们将竭诚为您服务。 </p>
                        </div>

                    </div>

                </div>
            </ul>
        </div>


    }
});
module.exports=LifeDetail;