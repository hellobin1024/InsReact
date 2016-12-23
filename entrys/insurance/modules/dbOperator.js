var Promise = require('bluebird');
var Q = require('q');
var fs = require('fs');
var ftpRoot = require('../config.js').ftpRoot;
var mysql = require('mysql');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var using = Promise.using;
var formidable = require('formidable');
var request = require('request');
var querystring = require('querystring');
var when = require('when');
var models = require('../model/index');
var JPush= require("jpush-sdk");
var colors = require('colors');
var JPushServicePerson= JPush.buildClient('f9bb743849fe5fbe67ea6d81','8c6af08dc7b1366f3a727c5c');
var JPushCustomer=JPush.buildClient('bc3a1ec18c59544ebfb6e136','d845f9159a58158d202e43dc');


var pool = null;
var logger = null;

function init(dbConf, lg) {
    pool = mysql.createPool(dbConf);
    if (lg) {
        logger = lg;
    } else {
        var log4js = require('log4js');
        logger = log4js.getLogger();
    }
}

function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function(connection) {
        connection.release();
    });
}



function registerUser(cellphone, passwd) {
    var tmpStr =  new Buffer(passwd);
    var passwdBase64 = tmpStr.toString('base64');
    var sql_base = "INSERT INTO info_person_info" +
        " (`perTelephone`, `perTypeCode`, `secondPerType`)" +
        " VALUES (?, ?, ?)";
    var sql_inserts = [cellphone, , '2', '11'];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    var personId = null;
    var perNum = null;
    return using(getSqlConnection(), function(conn) {
        return conn.beginTransactionAsync().then(function(result) {
            return conn.queryAsync(info_query_sql);
        },function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        }).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.')
                return conn.rollbackAsync();
            } else {
                personId = result.insertId;
                sql_base = "INSERT INTO insurance_car_customer"
                    + " (`personId`, `registerDate`, `isBuyInsurance`, "
                    + "`isCheckCar`, `isChackLicense`, `isUseRescueService`)"
                    + " VALUES (?, ?, ?, ?, ?, ?)";
                sql_inserts = [personId, new Date(), 0, 0, 0, 0];
                var sys_user_sql = mysql.format(sql_base, sql_inserts);
                return conn.queryAsync(sys_user_sql);
            }
        }, function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        }).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('insurance_car_customer not affected or no id generated.')
                return conn.rollbackAsync();
            } else {
                perNum = "C" + ("000000" + result.insertId).slice(-6);
                sql_base = "UPDATE info_person_info SET perNum = ? where personId = ?";
                sql_inserts = [perNum, personId];
                var sys_user_sql = mysql.format(sql_base, sql_inserts);
                return conn.queryAsync(sys_user_sql);
            }
        }, function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        }).then(function (result) {
            if (result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.')
                return conn.rollbackAsync();
            } else {
                sql_base = "INSERT INTO sys_user (`loginName`,`password`, `userid`, usertype) VALUES (?, ?, ?, ?)";
                sql_inserts = [cellphone, passwdBase64, personId, 'S'];
                var sys_user_sql = mysql.format(sql_base, sql_inserts);
                return conn.queryAsync(sys_user_sql);
            }
        }, function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        }).then(function (result) {
            if (result.affectedRows == 0) {
                logger.error('user_group not affected.')
                return conn.rollbackAsync();
            }
            return conn.commitAsync();
        }, function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        }).then(function (result) {
            return personId;
        }, function (err) {
            logger.error(err);
            return conn.rollbackAsync();
        })
    })
}

function addCarInfo(personId, carInfo) {
    var sql = "SELECT customerId FROM ?? WHERE ?? = ?";
    var inserts = ['insurance_car_customer', 'personId', personId];
    sql = mysql.format(sql, inserts);
    var customerId = null;
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0) {
                customerId = results[0].customerId;
            }
            var sql = "INSERT into insurance_car_info"
                + " (`carNum`, `engineNum`, `frameNum`, `factoryNum`, " +
                "`firstRegisterTime`, `ownerName`, `ownerIdCard`, `ownerAddress`, "+
                "`customerId`, `modifyTime`)"
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var inserts = [
                carInfo.carNum,
                carInfo.engineNum,
                carInfo.frameNum,
                carInfo.factoryNum,
                carInfo.firstRegisterTime,
                carInfo.ownerName,
                carInfo.ownerIdCard,
                carInfo.ownerAddress,
                customerId,
                new Date()
            ];
            sql = mysql.format(sql, inserts);
            return conn.queryAsync(sql);
        }, function (err) {
            logger.error(err);
            return (err);
        });
    });
}


//TODO:squash photo to carInfo
function getCarAndOwnerInfo(personId) {
    var deferred= Q.defer();
    var customerId=null;
    models.InsuranceCustomer.find({where:{personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null) {
            return models.InsuranceCarInfo.findAll({where: {customerId: ins.customerId}});
        }
        else
            deferred.reject({re: -1});
    }).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0)
        {
            deferred.resolve({re: 1, data: ins});
        }else{
            deferred.reject({re: 2, data: ''});
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        console.error('error=\r\n'+str);
    })
    return deferred.promise;
}

function verifyUserPasswd(cellphone, passwd) {
    var tmpStr =  new Buffer(passwd);
    var passwdBase64 = tmpStr.toString('base64');
    var sql = "SELECT userid from ?? WHERE ?? = ? and ?? =?";
    var inserts = ['sys_user', 'loginName', cellphone, 'password', passwdBase64];
    sql = mysql.format(sql, inserts);
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql);
    }).then(function(result) {
        if (result && result.length == 1) {
            return(result[0].userid);
        } else if(!result || result.length == 0) {
            return;
        } else {
            logger.error('Multiple studentId:' + studentId);
            return(result[0].userid);
        }
    }, function (err) {
        logger.error(err);
        return null;
    });
}

function getPersonId(cellphone) {
    var sql = "SELECT userid from ?? WHERE ?? = ?";
    var inserts = ['sys_user', 'loginName', cellphone];
    var sql = mysql.format(sql, inserts);
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql);
    }).then(function(result) {
        if (result && result.length == 1) {
            return(result[0].userid);
        } else if(!result || result.length == 0) {
            return;
        } else {
            logger.error('Multiple username:' + studentId);
            return(result[0].userid);
        }
    }, function (err) {
        logger.error(err);
        return null;
    });
}

function getCustomerIdByPersonId(personId)
{
    var deferred= Q.defer();
    var sql = "select customerId from insurance_customer where ?? =?";
    var inserts = ['personId',personId];
    sql =mysql.format(sql,inserts);
    var customerId = null;
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if (result && result.length > 0) {
                customerId = result[0].customerId;
                deferred.resolve({re: 1, id: customerId});
            }
            else
                deferred.reject({re: -1, data: 'there is no customer matches'});
        });
    });
    return deferred.promise;
}


function getLifeInfo (companyId) {
    var sql = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ['insurance_life_product', 'companyId', companyId];
    sql = mysql.format(sql, inserts);
    var productId = null;
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0) {
                productId = results[0].productId;
            }
            var sql = "select `productNum`, `productName`, `feeYearCount`, `insuranceQuota`, " +
                "`insuranceFee`, `insuranceFeeYear`, `insuranceDuringType`, `businesserId`, "+
                "`customerId` , `insuranceFeeYear`from insurance_car_info where ?? =?";
            var inserts = ['customerId', customerId];
            sql = mysql.format(sql, inserts);
            return conn.queryAsync(sql).then(function(result) {
                return result;
            });
        }, function (err) {
            logger.error(err);
            return (err);
        });
    });
}

function changePassword(personId,info){
    var sql = "SELECT password FROM ?? WHERE ?? = ?";
    var inserts = ['sys_user', 'userid', personId];
    var oldPassword=info.oldPwd;
    var newPassword=info.pwd;
    sql = mysql.format(sql, inserts);
    var password = null;
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0) {
                var pwd =results[0].password ;
                //password=base64_decode(pwd);
                password=new Buffer(pwd,'base64').toString();
            }
            if(password==oldPassword){
                password=new Buffer(newPassword).toString('base64');
                var sql ="update sys_user set password='"+password+"' where userid="+personId;
                return conn.queryAsync(sql).then(function(result) {
                    if(result.affectedRows>0){
                        return {re:1};
                    }
                    else{
                        return {re:2};
                    }
                });

            }else{
                return {re:2};

            }
        })
    });
}


function getInsuranceCompanyInfo(companyId,callback){
    var sql = "select * from insurance_company_info";
    if(companyId!==undefined&&companyId!==null&&companyId!='')
        sql+=' where companyId ='+companyId+'';
    sql = mysql.format(sql,null);
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(records) {
            if (records && records.length > 0) {

                if(callback!==undefined&&callback!==null)
                {
                    callback({re:1,data:records});
                }else{
                    return ({re:1,data:records});
                }
            }else{
                if(callback!==undefined&&callback!==null)
                    callback({re:2,data:null});
                else
                    return ({re: 2, data: null});
            }
        })
    });
}

function getLifeInsuranceByCompanyId(companyId){
    var sql = "select * from insurance_life_product where " ;
    if(companyId!==undefined&&companyId!==null&&companyId!='')
        sql+=' and companyId ='+companyId+'';
    sql = mysql.format(sql,null);
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(records) {
            if (records && records.length > 0) {
                return ({re: 1, data: records});
            }else{
                return ({re: 2, data: null});
            }
        })
    });
}

//根据主险Id获取附加险列表
function getAttachLifeInsurancesByOwnerId(ownerId)
{
    var sql = "select * from insurance_life_product where ?? =?";
    var inserts = ['ownerId',ownerId];
    sql =mysql.format(sql,inserts);
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(records) {
            if (records && records.length > 0) {
                return records;
            }else{
                return null;
            }
        })
    });
}

function t(records){
    var life_insurance_plans=[];

    var deferred = Q.defer();
    records.map(function(record,i) {
        getInsuranceCompanyInfo(record.companyId,null).then(function(json) {
            if(json.re==1)
            {
                var info=json.data[0];
                var plan={
                    companyName:info.companyName,
                    companyPhone:info.companyPhone,
                    companyAddress:info.companyAddress,
                    main:record
                }




                getAttachLifeInsurancesByOwnerId(record.productId).then(function(json){
                    if(json!==undefined&&json!==null)
                    {
                        plan.attachs=json;
                    }
                    else{
                        plan.attachs=null;
                    }
                    life_insurance_plans.push(plan);
                    if(i==records.length-1)
                        deferred.resolve(life_insurance_plans);
                });
            }
        });
    });
    return deferred.promise;
}


//获取寿险产品列表
function getLifeInsuranceProducts()
{
    var deferred = Q.defer();

    //获取主险列表,其中寿险计划以主险名字命名
    var sql = "select * from insurance_life_product where ownerId is null";
    sql = mysql.format(sql,null);
    using(getSqlConnection(), function(conn) {

        return conn.queryAsync(sql).then(function(records) {
            if (records && records.length > 0) {

                t(records).then(function(data) {
                    deferred.resolve({re:1,data:data});
                });

            }else{
                deferred.resolve({re:2});
            }
        })
    });
    return deferred.promise;
}

function getCarOrders(personId)
{
    var deferred = Q.defer();
    getCustomerIdByPersonId(personId).then(function(json) {
        if(json.re==1)
        {
            var sql = "select * from insurance_car_order where ??=?";
            var inserts=['customerId',json.id];
            sql =mysql.format(sql,inserts);
            using(getSqlConnection(), function(conn) {
                conn.queryAsync(sql).then(function (records) {
                    if (records && records.length > 0) {
                        deferred.resolve({re: 1, data: records});
                    } else {
                        deferred.resolve({re: 2});
                    }
                });
            });
        }else{}
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: 1, data: str});
    });
    return deferred.promise;
}

function getScore(personId){

    var sql = 'select scoreTotal from insurance_customer where ?? =?';
    var inserts=['personId',personId];
    sql =mysql.format(sql,inserts);
    return using(getSqlConnection(),function(conn){
        return conn.queryAsync(sql).then(function(result){
            if(result && result.length > 0){
                return {re:1,total:result[0].scoreTotal};
            }else
                return {re: 2};
        })
    })

}

//返回寿险订单
function getLifeInsuranceOrders(personId){
    var deferred = Q.defer();
    var sql = "select customerId from insurance_customer where ?? =?";
    var inserts = ['personId',personId];
    sql =mysql.format(sql,inserts);
    var customerId = null;
    return using(getSqlConnection(),function(conn){
        return conn.queryAsync(sql).then(function(result) {
            if(result &&result.length > 0){
                customerId = result[0].customerId;
            }
            var sql = "select * from insurance_life_order where ?? = ? ";
            var inserts = ['customerId', customerId];
            sql = mysql.format(sql, inserts);
            return conn.queryAsync(sql).then(function (records) {
                if (records && records.length > 0) {
                    t(records).then(function (data) {
                        deferred.resolve({re: 1, data: data});
                    });
                } else {
                    deferred.resolve({re: 2});
                }
            })
        });
        return deferred.promise;
    })
}



function addCarInfo(personId, carInfo) {
    var sql = "SELECT customerId FROM ?? WHERE ?? = ?";
    var inserts = ['insurance_car_customer', 'personId', personId];
    sql = mysql.format(sql, inserts);
    var customerId = null;
    return using(getSqlConnection(), function(conn) {
        return conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0) {
                customerId = results[0].customerId;
            }
            var sql = "INSERT into insurance_car_info"
                + " (`carNum`, `engineNum`, `frameNum`, `factoryNum`, " +
                "`firstRegisterTime`, `ownerName`, `ownerIdCard`, `ownerAddress`, "+
                "`customerId`, `modifyTime`)"
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var inserts = [
                carInfo.carNum,
                carInfo.engineNum,
                carInfo.frameNum,
                carInfo.factoryNum,
                carInfo.firstRegisterTime,
                carInfo.ownerName,
                carInfo.ownerIdCard,
                carInfo.ownerAddress,
                customerId,
                new Date()
            ];
            sql = mysql.format(sql, inserts);
            return conn.queryAsync(sql);
        }, function (err) {
            logger.error(err);
            return (err);
        });
    });
}

function getCurDayOrderNumWithSequelize(tablename)
{
    var deferred=Q.defer();
    switch(tablename)
    {
        case 'InsuranceCarServiceOrder':
            var date=new Date();
            var date_str=date.getFullYear().toString()+((date.getMonth()+1).toString().length==1?('0'+(date.getMonth()+1)):(date.getMonth()+1))+

                (date.getDate().toString().length==1?('0'+date.getDate()):date.getDate());
            models.InsuranceCarServiceOrder.findAll(
                {
                    order:'orderNum desc',
                    limit:1,
                    where:{
                        orderNum:{
                            $like:'%S'+date_str+'%'
                        }
                    }
                }
            ).then(function(inses) {
                    var num=null;
                    if(inses!==undefined&&inses!==null&&inses.length>0)
                    {
                        var ins=inses[0];
                        var previousNum=parseInt(ins.orderNum.substring(ins.orderNum.length-4));
                        var curNum=previousNum+1;
                        for(var i=curNum.toString().length;i<4;i++)
                            curNum='0'+curNum;
                        num='S'+date_str+curNum;

                    }else{
                        //TODO:create a InsuranceCarServiceOrder
                        num='S'+date_str+'0001';
                    }
                    deferred.resolve({re: 1, data: num});
                });
            break;
        default:
            break;
    }
    return deferred.promise;
}

function getCurDayOrderNum(type,customerId){
    var deferred = Q.defer();
    if(type!==undefined&&type!==null)
    {
        var table=null;
        switch(type)
        {
            case 'lifeInsurance':
                table='insurance_life_order';
                break;
            case 'carInsurance':
                table = 'insurance_car_order';
                break;
            case 'serviceInsurance':
                table = 'insurance_car_service_order';
                break;
            default:
                break;
        }
        var date=new Date();
        var date_str=date.getFullYear().toString()+((date.getMonth()+1).toString().length==1?('0'+(date.getMonth()+1)):(date.getMonth()+1))+
            (date.getDate().toString().length==1?('0'+date.getDate()):date.getDate());
        var sql = '';
        switch (type) {
            case 'lifeInsurance':
                sql+="select orderNum from "+table+" where orderNum like '%L"+date_str+"%'";
                break;
            case 'carInsurance':
                sql+="select orderNum from "+table+" where orderNum like '%C"+date_str+"%'";
                break;
            case 'serviceInsurance':
                sql+="select orderNum from "+table+" where orderNum like '%S"+date_str+"%'";
                break;
            default :
                break;
        }

        using(getSqlConnection(),function(conn) {
            conn.queryAsync(sql).then(function (results) {
                var num=0;
                if (results && results.length > 0) {
                    results.map(function(record,i) {
                        var subNum = record.orderNum.substring(9);
                        if(subNum>num)
                            num=subNum;
                    });

                }else{}

                num=parseInt(num)+1;
                if(num.toString().length<4)
                {
                    for(var i=num.toString().length;i<4;i++)
                        num='0'+num;
                }
                num=date_str+num;
                switch(type)
                {
                    case 'carInsurance':
                        num='C'+num;
                        break;
                    case 'lifeInsurance':
                        num='L'+num;
                        break;
                    case 'serviceInsurance':
                        num='S'+num;
                    default:
                        break;
                }
                deferred.resolve({re: 1, num: num});
            });
        });

    }else{
        deferred.resolve({re: -1});
    }
    return deferred.promise;
}

//生成寿险订单,orderNum为序列号
function generateLifeInsuranceOrder(personId,info)
{

    var deferred = Q.defer();
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null)
       {
           var customerId=ins.customerId;
           getCurDayOrderNum('lifeInsurance',customerId).then(function(json) {
               if(json.re==1)
               {
                   var orderNum=json.num;
                   var ob={
                       customerId:customerId,
                       orderNum:orderNum,
                       orderState:1,
                       insurancederId:info.insuranceder.personId,
                       insurerId:info.insurer.personId,
                       benefiterId:info.benefiter.personId,
                       insuranceType:info.insuranceType,
                       hasSocietyInsurance:info.hasSocietyInsurance,
                       hasCommerceInsurance:info.hasCommerceInsurance,
                       planInsuranceFee:info.planInsuranceFee,
                       applyTime:new Date()
                   };
                    models.InsuranceLifeOrder.create(ob).then(function(ins) {
                       if(ins!==undefined&&ins!==null)
                           deferred.resolve({re: 1, data: ''});
                    });
               }
           });
       }else{
           deferred.resolve({re: 2, data: ''});
       }
    });
    return deferred.promise;
}

//获取关系用户
function getRelativePersons(personId) {
    var deferred = Q.defer();
    var sql = "select customerId from insurance_customer where ?? =?";
    var inserts = ['personId',personId];
    sql =mysql.format(sql,inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            var customerId = null;
            if (result && result.length > 0) {
                customerId = result[0].customerId;
            }
            sql="select personId from insurance_customer_relatives where ?? =?";
            inserts=['customerId',customerId];
            sql =mysql.format(sql,inserts);
            conn.queryAsync(sql).then(function(peoples) {
                if(peoples!=null&&peoples.length>0)
                {
                    var perNames = [];
                    var statistics={
                        count:0,
                        target:peoples.length,
                        perNames:perNames

                    }
                    if(peoples!==undefined&&peoples!==null)
                    {
                        for(var i=0;i<peoples.length;i++) {
                            var people=peoples[i];
                            var callback=function(item)
                            {
                                models.InfoPersonInfo.find({where:{personId:people.personId}}).then(function (ins) {
                                    item.perNames.push(ins);
                                    if(item.perNames.length==item.target)
                                        deferred.resolve({re:1,data:item.perNames});
                                })
                            }
                            callback(statistics);
                        }

                    }

                }else{
                    deferred.resolve({re: 2, data: null});
                }
            }).catch(function(err) {
                var str='';
                for(var field in err)
                    str+=field+':'+err[field];
                console.log('error=\r\n' + str);
                deferred.resolve({re: -1, data: null});
            });
        });
    });
    return deferred.promise;
}

//创建用户亲属依赖
function createInsuranceCustomerRelative(relType,customerId,perId)
{
    var deferred = Q.defer();
    var sql_base = "INSERT INTO insurance_customer_relatives" +
        " (`relType`,`customerId`,`perId`)" +
        " VALUES (?,?,?)";
    var sql_inserts = [relType,customerId,perId];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(info_query_sql).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.');
                deferred.reject({re: -1, data: 'record insert encounter error'});
                conn.rollbackAsync();
            }else{
                deferred.resolve({re: 1,data:'insert successfully'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.log('error=\r\n' + str);
        });
    });
    return deferred.promise;
}

function createInsurancePerson(personId,perType){
    var deferred = Q.defer();
    var sql_base = "INSERT INTO insurance_person" +
        " (`personId`,`perType`)" +
        " VALUES (?,?)";
    var sql_inserts = [personId,perType];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(info_query_sql).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.');
                deferred.reject({re: -1, data: 'record insert encounter error'});
                conn.rollbackAsync();
            }else{
                var id=result.insertId;
                deferred.resolve({re: 1,id:id});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.log('error=\r\n' + str);
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function createRelativePerson(personId,info) {

    var deferred = Q.defer();

    var date=new Date();
    var date_str=date.getFullYear().toString()+
        ((date.getMonth()+1).toString().length==1?('0'+(date.getMonth()+1)):(date.getMonth()+1))+

        (date.getDate().toString().length==1?('0'+date.getDate()):date.getDate()+
        (date.getHours().toString().length==1?('0'+date.getHours()):date.getHours())+
        (date.getMinutes().toString().length==1?('0'+date.getMinutes()):date.getMinutes())+
        (date.getSeconds().toString().length==1?('0'+date.getSeconds()):date.getSeconds()));

    var tempPerIdCard = 'temp'+date_str;

    models.InfoPersonInfo.create({perTypeCode:info.perTypeCode,perName:info.perName,perIdCard:tempPerIdCard})
        .then(function(ins) {
            if(ins!=undefined&&ins!=null){
                var relativePersonId=ins.personId;
                models.InsuranceInfoPersonInfo.create({personId:relativePersonId})
                    .then(function(ins) {
                        if(ins!=undefined&&ins!=null){
                            models.InsuranceCustomer.find({where:{personId:personId}})
                                .then(function(ins) {
                                    if(ins!=undefined&&ins!=null){
                                        var customerId=ins.customerId;
                                        models.InsuranceCustomerRelatives.
                                            create({customerId:customerId,relType:info.relType,personId:relativePersonId})
                                            .then(function(ins) {
                                                if(ins!=undefined&&ins!=null)
                                                    deferred.resolve({re: 1, data:ins});
                                                else{}
                                            })
                                    }else{}
                                })
                        }
                        else
                            deferred.reject({re: 2, data: 'data insert insuranceInfoPersonInfo encounter error'});
                    })

            }else{
                deferred.reject({re: -1, data: 'data insert infoPersonInfo encounter error'});
            }
        }).then(function(json) {
            if(json.re==1)
            {
                //TODO:insert into baseAttchment
                var perIdCardPhoto=info.perIdCardPhoto;
                var carPhotoFilename = "data/perIdCard_" + infoPersonInfoId+'.'+perIdCardPhoto.type;
                return fs.writeFileAsync(carPhotoFilename, perIdCardPhoto.bin, "binary");
            }
            else
                deferred.reject({re: -1, data: 'error lastly'});
        }).then(function (json) {
            console.log('....');
            deferred.resolve({re: 1, data: 'successfully'});
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.log('error=\r\n' + str);
        });

    return deferred.promise;
}

function rollbackTest(personId,info)
{
    var deferred = Q.defer();
    var sql_base = "INSERT INTO info_person_info" +
        " (`perName`)" +
        " VALUES (?)";
    var sql_inserts = [info.perName];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    var perId=null;
    using(getSqlConnection(),function(conn) {
        conn.beginTransaction(function(err) {
            if(err)
            {
                conn.rollback(function () {
                    promise.reject({re: -1, data: 'transaction begin error'});
                })
            }
            conn.queryAsync(info_query_sql).then(function (result) {
                if (!result.insertId || result.affectedRows == 0) {
                    deferred.reject({re: -1, data: 'data insert encounter error'});
                } else {
                    var id = result.insertId;
                    conn.rollbackAsync();
                    deferred.resolve({re: 1, data: 'rollback successfully'});
                }
            });
        });

    });

    return deferred.promise;
}

//创建附件
function createAttachment(personId,info)
{
    var deferred = Q.defer();
    var sql_base = "INSERT INTO base_attachment_info" +
        " (`ownerId`,`docType`,`urlAddress`)" +
        " VALUES (?,?,?)";
    var sql_inserts = [personId,info.docType,info.url];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(info_query_sql).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.');
                deferred.reject({re: -1, data: 'record insert encounter error'});
            }else{
                deferred.resolve({re: 1,data:'insert successfully'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.log('error=\r\n' + str);
            deferred.reject({re: -1});
        });
    });

    return deferred.promise;
}

function createPhotoAttachment(personId,imageType,docType,filename,suffix,carId)
{
    var deferred=Q.defer();
    var dir=null;
    switch(imageType)
    {
        case 'licenseCard':
            dir = ftpRoot.base + ftpRoot.branches[imageType] + '/' + carId;
            break;
        case 'perIdCard':
            dir = ftpRoot.base + ftpRoot.branches[imageType] + '/' + personId;
            break;
        default :
            break;
    }

    var path=null;
    if(filename!==undefined&&filename!==null)
        path=dir+'/'+filename+'.'+suffix;
    else
        path=dir+'/'+imageType+'.'+suffix;
    var ob={
        ownerId:personId,
        docType:docType,
        urlAddress:path,
        uploadTime:new Date()
    };
    models.BaseAttachmentInfo.create(ob).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            deferred.resolve({re: 1, data: ins.attachId});
        }
    });
    return deferred.promise;
}


function insertCarOrderPriceItem(priceId,productId,info) {
    var deferred= Q.defer();
    var sql = "INSERT into insurance_car_order_price_item"
        + "(`priceId`,`productId`,`irrespective`)"
        + " VALUES (?,?,?)";
    var params = [
        priceId,
        productId,
        info.irrespective==true?true:null
    ];
    sql = mysql.format(sql, params);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.insertId!==undefined&&result.insertId!==null)
            {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        });
    });

    return deferred.promise;
}

function generateCarOrderPriceItem(priceId,products)
{
    var deferred= Q.defer();
    var statistics={
        count:0,
        target:products.length
    }
    for(var i=0;i<products.length;i++)
    {
        var product=products[i];
        var cb=function(ob,item) {
            var record={
                priceId:priceId,
                productId:item.productId
            };
            models.InsuranceCarOrderPriceItem.create(record).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                {
                    ob.count++;
                    if(ob.count==ob.target)
                        deferred.resolve({re: 1});
                }
            });
        };
        cb(statistics,product);
    }


    return deferred.promise;
}

function generateCarOrderPriceItems(priceIds,info)
{
    var deferred= Q.defer();
    var statistics={
        count:0,
        target:info.products.length
    }
    for(var i=0;i<priceIds.length;i++)
    {
        var priceId=priceIds[i];
        var func=function(ob){
            generateCarOrderPriceItem(priceId,info.products).then(function(json) {
                if(json.re==1)
                {
                    ob.count++;
                    if(ob.count==ob.target)
                        deferred.resolve({re: 1});
                }
            });
        }
        func(statistics);
    }
    return deferred.promise;
}

function generateCarOrderPrice(orderId,info) {
    var deferred= Q.defer();
    var statistics={
        target:info.companys.length,
        priceIds:[]
    };

    for(var i=0;i<info.companys.length;i++) {
        var company=info.companys[i];
        var cb=function(ob,item) {
            var record={
                orderId:orderId,
                companyId:item.companyId,
                isConfirm:0
            };
          models.InsuranceCarOrderPrice.create(record).then(function(ins) {
              if(ins!==undefined&&ins!==null)
              {
                  ob.priceIds.push(ins.priceId);
                  if(ob.priceIds.length==ob.target)
                      deferred.resolve({re: 1, data: ob.priceIds});
              }
          });
        };
        cb(statistics,company);
    }

    return deferred.promise;
}

function getCarIdByCarNum(carNum) {
    var deferred= Q.defer();

    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result!=null&&result.length>0)
            {
                deferred.resolve({re: 1, data: result[0].carId});
            }
            else{
                deferred.resolve({re:2,data:null});
            }
        }).catch(function (err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.error('error=\r\n' + str);
        });
    });
    return deferred.promise;
}

function createCarOrder(customerId,orderNum,carId)
{
    var deferred= Q.defer();



    var sql = "INSERT into insurance_car_order"
        + "(`customerId`,`orderNum`,`orderState`,"
        +"`orderDate`,`carId`)"
        + " VALUES (?,?,?,?,?)";
    var inserts = [
        customerId,
        orderNum,
        1,
        new Date(),
        carId
    ];
    var sql =mysql.format(sql,inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function(result) {
            if (!result.insertId || result.affectedRows == 0) {
                deferred.reject({re: -1});
            }
            else
                deferred.resolve({re: 1, data: result.insertId});
        }).catch(function(err) {
            var str='';
            for(var field in err)
            {
                str+=err[field];
            }
            deferred.reject({re: -1, data: str});
        });
    });


    return deferred.promise;
}



function generateCarInsuranceOrder(personId,info) {
    var deferred= Q.defer();
    var customerId=null;
    var orderNum=null;
    getCustomerIdByPersonId(personId).then(function(json) {
        if(json.re==1)
        {
            customerId=json.id;
            return getCurDayOrderNum('carInsurance',customerId);
        }else{
            deferred.reject({re: -1, data: ''});
        }
    }).then(function(json) {
        if(json.re==1)
        {
            orderNum=json.num;
            return createCarOrder(customerId, orderNum,info.carId);
        }
    }).then(function(json) {

        var orderId = json.data;
        return generateCarOrderPrice(orderId, info);

    }).then(function(json) {
        if(json.re==1)
        {
            var priceIds=json.data;
            return generateCarOrderPriceItems(priceIds,info);
        }
    }).then(function(json) {
        if(json.re==1)
        {
            deferred.resolve({re: 1, data: ''});
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: -1, data: str});
    });
    var sql = "select customerId from insurance_customer where ?? =?";
    var inserts = ['personId',personId];
    sql =mysql.format(sql,inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            var customerId = null;
            if (result && result.length > 0) {
                customerId = result[0].customerId;
            }
        });
    });

    return deferred.promise;
}

function getCurDayOrderNumTest(personId,info) {
    var deferred= Q.defer();
    var customerId=null;
    getCustomerIdByPersonId(personId).then(function(json) {
        if(json.re==1)
        {
            customerId=json.id;
            return getCurDayOrderNum(info.type,customerId);
        }else{
            deferred.reject({re: -1, data: ''});
        }
    }).then(function(json) {
        if(json.re==1)
        {
            var num=json.num;
            console.log('...');
            deferred.resolve({re: 1, data: num});
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str += err[field];
        deferred.reject({re: -1, data: str});
    });
    return deferred.promise;
}


function getCarInsuranceProducts(conn,id)
{
    var deferred= Q.defer();

    var sql_base='select * from insurance_car_product where productId='+id;
    conn.queryAsync(sql_base).then(function (result) {
        deferred.resolve({re: 1, data: result[0]});
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: -1, data: str});
    });

    return deferred.promise;
}


function getProductMeal(conn,mealId)
{
    var deferred= Q.defer();
    sql_base= "select productId from insurance_car_product_meal where mealId ="+mealId;
    info_query_sql = mysql.format(sql_base,null);
    conn.queryAsync(info_query_sql).then(function (pms) {
        var ids=[];
        pms.map(function(pm,i) {
            ids.push(pm.productId);
        });
        deferred.resolve({re: 1, data: ids});
    });

    return deferred.promise;
}

function getCarInsuranceMealsProduct(conn,meals){
    var deferred= Q.defer();
    var mealSize=meals.length;
    var ob={
        meal_set:[]
    };
    for(var i=0;i<meals.length;i++)
    {
        var mealName=meals[i].mealName;
        var cb=function(name,obj){

            getProductMeal(conn,meals[i].mealId).then(function(json) {
                if(json.re==1)
                {
                    var meal={};
                    meal.mealName=name;
                    meal.products=[];
                    var ids=json.data;
                    ids.map(function(id,j) {
                        getCarInsuranceProducts(conn,id).then(function(json) {
                            if(json.re==1)
                            {
                                meal.products.push(json.data);
                                if(meal.products.length==ids.length)
                                {
                                    obj.meal_set.push(meal);
                                    if(obj.meal_set.length==mealSize)
                                        deferred.resolve({re: 1, data: obj.meal_set});
                                }
                            }
                        });
                    });
                }
            }).catch(function(err) {
                var str='';
                for(var field in err)
                    str+=err[field];
                deferred.reject({re: -1, data: str});
            });
        }
        cb(mealName,ob);
    }
    return deferred.promise;
}

function getCarInsuranceMeals()
{
    var deferred= Q.defer();
    var sql_base = "select * from insurance_car_meal";
    var info_query_sql = mysql.format(sql_base, null);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(info_query_sql).then(function (records) {
            if(records!=null&&records.length>0)
            {
                return getCarInsuranceMealsProduct(conn,records);
            }else{
                deferred.reject({re: -1, data: null});
            }
        }).then(function(json) {
            if(json.re==1)
            {
                deferred.resolve({re: 1, data: json.data});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            console.log('error=\r\n' + str);
            deferred.reject({re: -1});
        });
    });
    return deferred.promise;
};

function getOrderState(orderId)
{
    var deferred=Q.defer();
    var sql = "select orderState FROM insurance_life_order WHERE orderId = ?";
    var inserts = [orderId];
    sql = mysql.format(sql, inserts);
    using(getSqlConnection(sql), function(conn) {
        conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0 ) {
                deferred.resolve({re: 1, state:results[0].orderState});

            };
        });
    });
    return deferred.promise;
};



function getInsuranceCompany() {
    var deferred = Q.defer();
    var sql_base = 'select * from insurance_company_info where ownerId is null';
    using(getSqlConnection(), function (conn) {
        conn.queryAsync(sql_base).then(function (records) {
            deferred.resolve({re: 1, data: records});
        }).catch(function (err) {
            var str = '';
            for (var field in err)
                str += err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
};


function getOrderPlan(orderId)
{


    var deferred=Q.defer();
    var sql = "select * FROM insurance_life_order_plan WHERE orderId = ?";
    var inserts = [orderId];
    sql = mysql.format(sql, inserts);

    var data={
        plans:[]
    };
    using(getSqlConnection(sql), function(conn) {
        conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0 ) {
                var statistics={
                    count:0,
                    target:results.length
                };

                for(var i=0;i<results.length;i++)
                {
                    var plan=results[i];
                    var cb=function(ob,item)
                    {
                        getLifeInsuranceCompanyByCompanyId(item.companyId).then(function(json){
                            if(json.re==1){
                                item.companyName=json.data.companyName;
                                getOrderPlanItem(item.planId).then(function(json){
                                    if(json.re==1){
                                        ob.count++;
                                        item.items=json.data;
                                        data.plans.push(item);
                                        if(ob.count==ob.target)
                                            deferred.resolve({re: 1,data:data.plans});
                                    }
                                });

                            }
                        })

                    }
                    cb(statistics,plan);
                }

            };
        });
    });

    return deferred.promise;
}

function getOrderPlanItem(planId)
{
    var deferred=Q.defer();
    var sql = "select * FROM insurance_life_order_plan_item WHERE planId = ?";
    var inserts = [planId];
    sql = mysql.format(sql, inserts);

    using(getSqlConnection(sql), function(conn) {
        conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0 ) {
                var statistics={
                    target:results.length,
                    items:[]
                };

                for(var i=0;i<results.length;i++){
                    var item=results[i];
                    var cb=function(ob,singleton){
                        getLifeInsuranceProductByProductId(singleton.productId)
                            .then(function(json){
                                singleton.productName=json.data.productName;
                                singleton.ownerId=json.data.ownerId;
                                singleton.insuranceQuota=json.data.insuranceQuota;
                                singleton.insuranceFeeYear=json.data.insuranceFeeYear;
                                singleton.insuranceFee=json.data.insuranceFee;
                                if(json.re==1){
                                    ob.items.push(singleton);
                                    if(ob.items.length==ob.target)
                                        deferred.resolve({re:1,data:ob.items});
                                }
                            });
                    }

                    cb(statistics,item);
                };

            };
        });
    });
    return deferred.promise;
}

function getLifeInsuranceCompanyByCompanyId(companyId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_company_info where ?? = ?';
    var inserts=['companyId',companyId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                var company=records[0];
                deferred.resolve({re:1,data:company});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });


    return deferred.promise;
}

function getLifeInsuranceProductByProductId(productId) {
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_product where ?? = ?';
    var inserts=['productId',productId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                deferred.resolve({re:1,data:records[0]});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function checkCarOrderState(orderId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_car_order where ?? = ?';
    var inserts=['orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                deferred.resolve({re:1,state:records[0].orderState})
            }else{
                deferred.resolve({re: 2, state: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getCarInsuranceProductByProductId(productId) {
    var deferred= Q.defer();
    var sql_base='select * from insurance_car_product where ?? = ?';
    var inserts=['productId',productId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                deferred.resolve({re:1,data:records[0]});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getCarOrderPriceItemsByPriceId(priceId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_car_order_price_item where ?? = ?';
    var inserts=['priceId',priceId];
    var sql = mysql.format(sql_base, inserts);



    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                var statistics={
                    count:0,
                    target:records.length,
                    items:[]
                };
                for(var i=0;i<records.length;i++)
                {
                    var priceItem=records[i];
                    var func=function(ob,singleton){
                        getCarInsuranceProductByProductId(singleton.productId).then(function(json) {
                            if(json.re==1)
                            {
                                var product=json.data;
                                singleton.productName=product.productName;
                                ob.items.push(singleton);
                                if(ob.items.length==ob.target)
                                    deferred.resolve({re:1,data:ob.items});
                            }
                        });
                    }
                    func(statistics,priceItem);
                }
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getCarOrderPrices(orderId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_car_order_price where ?? = ?';
    var inserts=['orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                deferred.resolve({re:1,data:records});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getCarInsuranceCompanyByCompanyId(companyId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_company_info where ?? = ?';
    var inserts=['companyId',companyId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (records) {
            if(records!==null&&records.length>0)
            {
                var company=records[0];
                deferred.resolve({re:1,data:company});
            }else{
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });

    return deferred.promise;
}


function getCarOrderPriceItemsByPriceIds(prices)
{
    var deferred= Q.defer();

    var statistics={
        count:0,
        target:prices.length,
        prices:[]
    }
    for(var i=0;i<prices.length;i++)
    {
        var price=prices[i];
        var cb=function(ob,singleton)
        {
            getCarInsuranceCompanyByCompanyId(singleton.companyId).then(function(json) {
                if(json.re==1)
                {
                    var company=json.data;
                    singleton.companyName=company.companyName;
                    getCarOrderPriceItemsByPriceId(singleton.priceId).then(function(json) {
                        if(json.re==1)
                        {
                            singleton.items=json.data;
                            ob.prices.push(singleton);
                            if(ob.prices.length==ob.target)
                                deferred.resolve({re: 1, data: ob.prices});
                        }
                    });
                }else{
                    deferred.reject({re: 2, data: null});
                }
            });
        }
        cb(statistics,price);
    }
    return deferred.promise;
}

function getCarOrderPriceItems(orderId)
{
    var deferred= Q.defer();
    getCarOrderPrices(orderId).then(function(json) {
        if(json.re==1)
        {
            var prices=json.data;
            return getCarOrderPriceItemsByPriceIds(prices);
        }else{
            deferred.reject({re: 2, data: null});
        }
    }).then(function(json) {
        if(json.re==1)
        {
            deferred.resolve({re: 1, data: json.data});
        }else{
            deferred.resolve({re: 2, data: 'data is null'});
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: -1, data: str});
    });
    return deferred.promise;
}

function selectLifeOrderPlan(personId,planId)
{
    var deferred= Q.defer();
    var sql_base='update insurance_life_order_plan set ?? = ?, ?? = ?  where ?? = ?';
    var inserts=['userSelect',1,'modifyId',personId,'planId',planId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.affectedRows>0) {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.reject({re: -1, data: 'update encounter failure'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function setLifeOrderState(orderId,state) {
    var deferred= Q.defer();
    var sql_base='update insurance_life_order set ?? = ? where ?? = ?';
    var inserts=['orderState',state,'orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.affectedRows>0) {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.reject({re: -1, data: 'update encounter failure'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}


/**
 *  接口已测
 */
function userApplyUnchangedLifeOrder(personId,info) {
    var deferred= Q.defer();

    getCustomerIdByPersonId(personId).then(function (json) {
       if(json.re==1)
       {
           var customerId=json.id;
           var orderId=info.orderId;
           setLifeOrderState(orderId,4).then(function(json) {
                if(json.re==1) {
                  var planIds=info.planIds;
                  var statistics={
                      count:0,
                      target:planIds.length
                  }
                  for(var i=0;i<planIds.length;i++) {
                      var planId=planIds[i];
                      var cb=function(ob,perId,item){
                          selectLifeOrderPlan(perId,item).then(function(json) {
                              if(json.re==1) {
                                  ob.count++;
                                  if(ob.count==ob.target)
                                      deferred.resolve({re: 1, data: ''});
                              }
                          });
                      }
                      cb(statistics,personId,planId);

                  };
              }
           });



       }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        console.error('error=\r\n' + str);
    });
    return deferred.promise;
}


function updateLifeOrderPlanItem(item) {
    var deferred= Q.defer();
    var sql_base='';
    var inserts='';
    if(item.ownerId!==undefined&&item.ownerId!==null)//附加险
    {
        sql_base='update insurance_life_order_plan_item set ?? = ? where ?? = ?';
        inserts=['productCount',item.productCount,'itemId',item.itemId];
    }else{
        sql_base='update insurance_life_order_plan_item set ?? = ? , ?? = ? where ?? = ?';
        inserts=['insuranceFee',item.insuranceFee,'insuranceQuota',item.insuranceQuota,'itemId',item.itemId];
    }
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.affectedRows>0) {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.reject({re: -1, data: 'update encounter failure'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function updateLifeOrderPlanItems(items) {
    var deferred= Q.defer();
    var statistics={
        count:0,
        target:items.length
    }
    for(var i=0;i<items.length;i++) {
        var planItem=items[i];
        var cb=function(ob,item) {
            updateLifeOrderPlanItem(item).then(function(json) {
               if(json.re==1)
               {
                   ob.count++;
                   if(ob.count==ob.target)
                       deferred.resolve({re: 1, data: ''});
               }
            });
        };
        cb(statistics, planItem);
    }
    return deferred.promise;
}
function updateLifeOrderPlan(plan) {
    var deferred= Q.defer();
    var sql_base='update insurance_life_order_plan set ?? = ? , ?? = ?  where ?? = ?';
    var inserts=['userSelect',1,'modifyTime',new Date(),'planId',plan.planId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.affectedRows>0) {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.reject({re: -1, data: 'update encounter failure'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });

    return deferred.promise;
}

function updateLifeOrderPlans(plans)
{
    var deferred= Q.defer();
    var statistics={
        count:0,
        target:plans.length
    }
    for(var i=0;i<plans.length;i++) {
        var plan=plans[i];
        var cb=function(ob,item) {
            updateLifeOrderPlan(item).then(function(json) {
               if(json.re==1) {
                   updateLifeOrderPlanItems(item.items).then(function (json) {
                      if(json.re==1)
                      {
                          ob.count++;
                          if(ob.count==ob.target)
                              deferred.resolve({re: 1, data: ''});
                      }
                   });
               }
            });
        };
        cb(statistics,plan);
    }
    return deferred.promise;
}


/***测试此接口***/
function userUpdateLifeOrder(info) {
    var deferred= Q.defer();
    var plans=info.plans;
    var orderId=info.orderId;
    updateLifeOrderPlans(plans).then(function(json) {
       if(json.re==1)
       {
           return setLifeOrderState(orderId, 1);
       }
    }).then(function(json) {
      if(json.re==1)
      {
          deferred.resolve({re: 1, data: ''});
      }else{
          deferred.resolve({re: 2, data: ''});
      }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        console.error('error=\r\n' + str);
    });

    return deferred.promise;
}

function setCarOrderState(orderId,state) {
    var deferred= Q.defer();
    var sql_base='update insurance_car_order set  ?? = ?  where ?? = ?';
    var inserts=['orderState',state,'orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.affectedRows>0) {
                deferred.resolve({re: 1, data: ''});
            }else{
                deferred.reject({re: -1, data: 'update encounter failure'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function insertCarOrderItem(orderId,item)
{
    var deferred= Q.defer();
    var sql_base = "INSERT INTO insurance_car_order_item" +
        " (`orderId`, `productId`, `insuranceFee`)" +
        " VALUES (?, ?, ?)";
    var inserts = [orderId,item.productId , item.insuranceFee];

    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.insertId!==undefined&&result.insertId!==null)
            {
                deferred.resolve({re: 1, data:''});
            }else{
                deferred.reject({re: 1, data: 'inject encounter error'});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function insertCarOrderItems(orderId,price) {
    var deferred= Q.defer();
    var statistics={
        count:0,
        target:price.items.length
    }
    for(var i=0;i<price.items.length;i++)
    {
        var priceItem=price.items[i];
        var cb=function(ob,id,item)
        {
            insertCarOrderItem(id,item).then(function(json) {
                if(json.re==1) {
                    ob.count++;
                    if(ob.count==ob.target)
                        deferred.resolve({re: 1, data: ''});
                }
            })
        }
        cb(statistics,orderId,priceItem);
    }

    return deferred.promise;
}

function userApplyCarOrder(info) {
    var deferred= Q.defer();
    var price=info.price;
    var orderId=info.orderId;
    insertCarOrderItems(orderId,price).then(function(json) {
        if(json.re==1)
        {
            return setCarOrderState(orderId,4);
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str += err[field];
        deferred.reject({re: -1, data: str});
    });

    return deferred.promise;
}

function applyCarOrderPrice(personId,info) {
    var deferred=Q.defer();
    var price=info.price;
    var items=[];
    price.items.map(function(item,i) {
        items.push({orderId:price.orderId,productId:item.productId,insuranceFee:price.insuranceFeeTotal});
    });
    models.InsuranceCarOrderItem.bulkCreate(items).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0)
        {
            var update={
                orderId:price.orderId,
                modifyTime:new Date(),
                modifyId:personId
            };
            models.InsuranceCarOrder.update({orderState:4},{where:{orderId:price.orderId}}).then(function (ins) {
                if(ins!==undefined&&ins!==null)
                    deferred.resolve({re: 1, data: ''});
            });
        }else{
            deferred.resolve({re: 2, data: ''});
        }
    });
    return deferred.promise;
}



function getLifeProductDetail(productId,feeYearCount) {
    var deferred= Q.defer();

    return deferred.promise;
}

function getLifeOrderItemDetailScore(productId) {

    var deferred= Q.defer();
    var sql_base='select * from insurance_life_product_detail where ?? = ?';
    var inserts=['productId',productId];

    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
            if(results.length!==undefined&&results!==null&&results.length>0)
            {

            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrderPlanItemsByPlanId(planId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_order_plan_item where ?? = ?';
    var inserts=['planId',planId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
            if(results.length!==undefined&&results!==null&&results.length>0)
            {
                deferred.resolve({re: 1, data: results});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrderPlanItemScore(itemId)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_order_plan where ?? = ?';
    var inserts=['orderId',orderId];

    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
            if(results.length!==undefined&&results!==null&&results.length>0)
            {
                deferred.resolve({re: 1, data: results});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrderPlanItemsScore(planId) {
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_order_plan_item where ?? = ?';
    var inserts=['planId',planId];

    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
            if(results.length!==undefined&&results!==null&&results.length>0)
            {
                var items=results;
                var statistics={
                    count:0,
                    score:0,
                    target:results.length
                };
                for(var i=0;i<results.length;i++) {
                    var planItem=results[i];
                    var cb=function(ob,item){
                        getLifeOrderPlanItemScore(item.itemId).then(function(json) {
                            if(json.re==1)
                            {
                                var score=json.score;
                                ob.count++;
                                ob.score+=score;
                                if(ob.count==ob.target)
                                    deferred.resolve({re: 1, data: ob.score});
                            }
                        });
                    }
                    cb(statistics,planItem)
                }
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrderSelectedPlanItems(personId,plans) {
    var deferred= Q.defer();
    var statistics={
        count:0,
        score:0,
        target:plans.length
    };

    for(var i=0;i<plans.length;i++) {
        var plan=plans[i];

        var cb=function(ob,item)
        {
            getLifeOrderPlanItemsScore(item.planId).then(function(json) {
               if(json.re==1)
               {
                   ob.count++;
                   ob.score+=json.score;
                   if(ob.count==ob.target)
                       deferred.resolve({re: 1, data:ob.score});
               }
            });
        }
        cb(statistics,plan);
    }



    var sql_base='select * from insurance_life_order_plan where ?? = ?';
    var inserts=['orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
            if(results.length!==undefined&&results!==null&&results.length>0)
            {
                deferred.resolve({re: 1, data: results});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrderselectedPlans(orderId){
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_order_plan where ?? = ?';
    var inserts=['orderId',orderId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (results) {
           if(results.length!==undefined&&results!==null&&results.length>0)
           {
               deferred.resolve({re: 1, data: results});
           }
            else
           {
               deferred.resolve({re: 2, data: null});
           }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getLifeOrders(personId) {
    var deferred=Q.defer();
    var customerId=null;

    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
        if(ins!=undefined&&ins!=null){
            customerId=ins.customerId;
            models.InsuranceLifeOrder.findAll({where: {customerId: customerId}}).then(function(ins) {
                if(ins!=undefined&&ins!=null&&ins.length>0){
                    deferred.resolve({re: 1, data: ins});
                }else{
                    deferred.reject({re: 1});
                }
            })
        }else{
            deferred.reject({re: 1});
        }
    })
    return deferred.promise;
}

function getLifeOrderScore(personId,orderId) {
    var deferred= Q.defer();
    getLifeOrderSelectedPlans(orderId).then(function(json) {
        if(json.re==1) {
            var plans=json.data;
            return getLifeOrderSelectedPlanItems(personId,plans);
        }
    }).then(function(json) {
      if(json.re==1)
      {
          deferred.resolve({re: 1, score: json.score});
      }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: -1, data: str});
    });

    return deferred.promise;
}

function generateCode(){
    var deferred=Q.defer();
    var inputData = {
        corp_id:'hy6550',
        corp_pwd:'mm2289',
        corp_service:1069003256550,
        mobile:18253160627,
        msg_content:'I am over-weighted',
        corp_msg_id:'',
        ext:''
    };
    request({
        url:'http://sms.cloud.hbsmservice.com:8080/sms_send2.do',
        method:'POST',
        body:querystring.stringify(inputData),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ContentType: 'application/x-www-form-urlencoded',
    },function(err,res,body){
        if(err)
            deferred.reject({re: -1, data: err.toString()});
        else
            deferred.resolve({re: 1, data: ''});
    });
    return deferred.promise;
}

function getInfoPersonInfoByPersonId(personId) {
    var deferred= Q.defer();
    var sql_base='select * from info_person_info  where ?? = ?';
    var inserts=['personId',personId];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result.length!==undefined&&result!==null&&result.length>0)
            {
                deferred.resolve({re: 1, data: result[0]});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getInfoPersonInfoByServicePersonId(servicePersonId) {
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {servicePersonId: servicePersonId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            var personId=ins.personId;
            models.InfoPersonInfo.find({where:{personId:personId}}).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                    deferred.resolve( ins);
                else{}
            })
        }else{
            deferred.reject({re: -1});
        }
    })
    return deferred.promise;
}

function createCarServicePerson(personId,info){
    var deferred=Q.defer();
    createInfoPersonInfo(info).then(function(json){
        var sql_base = "INSERT INTO insurance_car_service_person" +
            " (`personId`,`serviceProjects`,`serviceSegments`)" +
            " VALUES (?,?,?)";
        var sql_inserts = [personId,info.serviceProjects,info.serviceSegments];
        var info_query_sql = mysql.format(sql_base, sql_inserts);
        using(getSqlConnection(),function(conn) {
            conn.queryAsync(info_query_sql).then(function (result) {
                if (!result.insertId || result.affectedRows == 0) {
                    logger.error('info_person_info not affected or no id generated.');
                    deferred.reject({re: -1, data: 'record insert encounter error'});
                    conn.rollbackAsync();
                }else{
                    //var servicePersonId=result.insertId;
                    deferred.resolve({re: 1,data: 'successfully'});
                }
            })
        });
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        console.log('error=\r\n' + str);
        deferred.reject({re: -1, data: str});
    });
    return deferred.promise;
}

function createInfoPersonInfo(info) {
    //检查一下info_person_info表里有没有这个人,如果没有,创建一条记录,返回personId。

    var deferred = Q.defer();
    var sql_base = "INSERT INTO info_person_info" +
        " (`perName`,`perIdCard`)" +
        " VALUES (?,?)";
    var sql_inserts = [info.perName, info.perIdCard];
    var info_query_sql = mysql.format(sql_base, sql_inserts);
    using(getSqlConnection(), function (conn) {
        conn.queryAsync(info_query_sql).then(function (result) {
            if (!result.insertId || result.affectedRows == 0) {
                logger.error('info_person_info not affected or no id generated.');
                deferred.reject({re: -1, data: 'record insert encounter error'});
                conn.rollbackAsync();
            } else {
                var id = result.insertId;
                deferred.resolve({re: 1, id: id});
            }
        }).catch(function (err) {
            var str = '';
            for (var field in err)
                str += err[field];
            console.log('error=\r\n' + str);
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}


function getInsuranceLifeProductFeeByTerm(gender,age,productId,feeYearCount)
{
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_product_fee  where ?? = ? and ?? = ? and ?? = ? and ?? = ?';
    var inserts=['gender',gender,'age',age,'productId',productId,'feeYearConnt',feeYearCount];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result!==undefined&&result!==null)
            {
                deferred.resolve({re: 1, data: result[0].insuranceFee});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getInsuranceLifeProductFee(personId,productId,feeYearCount){
    var deferred= Q.defer();
    var statistics={
        info:{}
    };
    getInfoPersonInfoByPersonId(personId).then(function(json) {
       if(json.re==1) {
           var info=json.data;
           var perBirthDay=info.perBirthday;
           var date=new Date();
           var age=date.getFullYear()-perBirthDay.getFullYear();
           statistics.info.age=age;
           switch(info.genderCode)
           {
               case 1:
                   statistics.info.gender='男';
                   break;
               case 2:
                   statistics.info.gender='女';
                   break;
               default:
                   break;
           }
           return getCustomerIdByPersonId(personId);
       }else{
           deferred.reject({re: 1, data: 'invalid personId'});
       }
    }).then(function(json){
        if(json.re==1)
        {
            return getInsuranceLifeProductFeeByTerm(statistics.info.gender,statistics.info.age,productId,feeYearCount);
        }
    }).then(function(json) {
        if(json.re==1) {
            var insuranceFee=json.data;
            if(insuranceFee!==undefined&&insuranceFee!==null)
                deferred.resolve({re: 1, data: insuranceFee});
            else
                deferred.reject({re: -1, data: null});
        }
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        deferred.reject({re: 1, data: str});
    });
    return deferred.promise;
}

function getInsuranceLifeProductRatioByTerm(productId,feeYearCount) {
    var deferred= Q.defer();
    var sql_base='select * from insurance_life_product_ratio  where ?? = ? and ?? = ?';
    var inserts=['productId',productId,'feeYearConnt',feeYearCount];
    var sql = mysql.format(sql_base, inserts);
    using(getSqlConnection(),function(conn) {
        conn.queryAsync(sql).then(function (result) {
            if(result!==undefined&&result!==null)
            {
                deferred.resolve({re: 1, data: result[0]});
            }
            else
            {
                deferred.resolve({re: 2, data: null});
            }
        }).catch(function(err) {
            var str='';
            for(var field in err)
                str+=err[field];
            deferred.reject({re: -1, data: str});
        });
    });
    return deferred.promise;
}

function getInsuranceLifeProductRatio(productId,feeYearCount){
    var deferred= Q.defer();
    getInsuranceLifeProductRatioByTerm(productId,feeYearCount).then(function(json) {
       if(json.re==1) {
           var ratios=[];
           var record=json.data;
           ratios.push(record.ratio1);
           ratios.push(record.ratio2);
           ratios.push(record.ratio3);
           ratios.push(record.ratio4);
           ratios.push(record.ratio5);
           deferred.resolve({re: 1, data: ratios});
       }else
           deferred.reject({re: -1, data: null});
    });
    return deferred.promise;
}


function servicePersonRegiste(personId,info)
{
    var deferred=Q.defer();
    models.InfoPersonInfo.find({perName:info.perName}).then(function(person) {
        if(person!==undefined&&person!==null)
        {
        }else{
            models.InfoPersonInfo.create(info).then(function (person) {

            });
        }
    });
    return deferred.promise;
}


function  getOrderStateFromServiceOrder(orderId)
{
    var deferred=Q.defer();
    var sql = "select orderState FROM insurance_car_service_order WHERE orderId = ?";
    var inserts = [orderId];
    sql = mysql.format(sql, inserts);
    using(getSqlConnection(sql), function(conn) {
        conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0 ) {
                deferred.resolve({re: 1, state:results[0].orderState});

            };
        });
    });
    return deferred.promise;
};


function  getServiceOrderByState(state)
{
    var deferred=Q.defer();
    var sql_base='select * from insurance_car_service_order where ?? = ?';
    var inserts = ['orderState',state];
    var sql = mysql.format(sql_base, inserts);

    sql = mysql.format(sql, inserts);
    using(getSqlConnection(sql), function(conn) {
        conn.queryAsync(sql).then(function(results) {
            if (results && results.length > 0 ) {
                deferred.resolve({re: 1, results:results});

            };
        });
    });
    return deferred.promise;
};

function activeHandshakeCandidate(servicePersonId) {
    var deferred=Q.defer();
    models.HandShakeCandidate.find({where:{servicePersonId:servicePersonId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
            ins.update({status:1}).then(function(re) {
                deferred.resolve({re: 1});
            });
        else{
            models.HandShakeCandidate.create({servicePersonId: servicePersonId, status: 1}).then(function(re) {
                deferred.resolve({re: 1});
            });
        }
    });

    return deferred.promise;
}


/**
 * 1.active insuranceCustomer
 * 2.active insuranceCarServicePerson
 */

function activatePersonOnline(personId,info){
    var deferred=Q.defer();
    var registrationId=null;
    if(info!==undefined&&info!==null)
        registrationId=info.registrationId;

    var service_person=null;
    models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)//servicePerson
        {
            if(info.registrationId!==undefined&&info.registrationId!==null)
            return   models.InsuranceCarServicePerson.update({registrationId:info.registrationId},
                {where:
                    {
                        personId:personId
                    }});
            else
                return ({re: 1});
        }
        else
        {
            if(registrationId!==undefined&&registrationId!==null)
            {
                return models.InsuranceCustomer.update({registrationId:registrationId},
                    {where:{personId:personId}}
                );
            }else{
                return {re: 1};
            }
        }
    }).then(function(ins) {
        if(ins!==undefined&&ins!==null)
            deferred.resolve({re: 1, data: ''});
        else
            deferred.resolve({re: 2, data: ''});
    }).catch(function(err) {
        var str='';
        for(var field in err)
            str+=err[field];
        console.error('error=\r\n' + str);
    });

    return deferred.promise;
}

function pushMsg()
{
    //client.push().setPlatform(JPush.ALL)
    //    .setAudience(JPush.ALL)
    //    .setMessage('to service person')
    //    .send(function(err, res) {
    //        if (err) {
    //            console.log(err.message);
    //        } else {
    //            console.log('Sendno: ' + res.sendno);
    //        }
    //    });
}

function getRegistrationDeviceIdByPersonId(personId) {
    var deferred=Q.defer();
    models.InfoPersonOnline.find({where:{personId:personId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null)
       {
           deferred.resolve({re: 1, data: ins.registrationId});
       }else{
           deferred.reject({re: -1});
       }
    });
    return deferred.promise;
}


function getMappedPersonFromHandshakeCandidate(type,id) {
    var deferred=Q.defer();
    switch (type) {
        case 'customer':
            models.InsuranceCustomer.find({where: {customerId: id}}).then(function(ins) {
               if(ins!==undefined&&ins!==null)
               {
                   deferred.resolve({re: 1, data: ins.servicePersonId});
               }
            });
            break;
        case 'servicePerson':
            models.InsuranCarServicePerson.find({where: {servicePersonId: id}}).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                {
                    deferred.resolve({re: 1, data: ins.customerId});
                }
            });
            break;
        default:
            break;
    }
    return deferred.promise;
}


/**
 * 首先通信双方的个人信息必须都是公开的,这里假设可以拿到targetId
 */

function pushTextMsg(personId,info) {
    var deferred=Q.defer();
    if(info!==undefined&&info!==null) {


        switch (info.type) {
            case 'customer':
                models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
                   if(ins!==undefined&&ins!==null)
                   {
                       var customerId=ins.customerId;
                       models.HandShakeCandidate.find({where: {customerId: customerId}}).then(function(ins) {
                           models.InsuranceCarServicePerson.find({where: {servicePersonId: ins.servicePersonId}}).then(function(ins) {
                               var registrationId=ins.registrationId;
                               JPushServicePerson.push().setPlatform(JPush.ALL)
                                   .setAudience(JPush.registration_id(registrationId))
                                   .setMessage(JSON.stringify(info.msg))
                                   .send(function (err, res) {
                                       if (err) {
                                           deferred.reject({re: -1, data: err.message})
                                       } else {
                                           deferred.resolve({re: 1, data: 'msg send successfully'});
                                       }
                                   });
                           })
                       });
                   }else{
                       deferred.reject({re: 2, data: 'personId unmatch'});
                   }
                });
                break;
            case 'servicePerson':
                models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
                    if(ins!==undefined&&ins!==null)
                    {
                        models.HandShakeCandidate.find({where: {servicePersonId: ins.servicePersonId}}).then(function(ins) {
                            models.InsuranceCustomer.find({where: {servicePersonId: ins.customerId}}).then(function(ins) {
                                var registrationId=ins.registrationId;
                                JPushCustomer.push().setPlatform(JPush.ALL)
                                    .setAudience(JPush.registration_id(registrationId))
                                    .setMessage(JSON.stringify(info.msg))
                                    .send(function (err, res) {
                                        if (err) {
                                            deferred.reject({re: -1, data: err.message})
                                        } else {
                                            deferred.resolve({re: 1, data: 'msg send successfully'});
                                        }
                                    });
                            })
                        });
                    }else{
                        deferred.reject({re: 2, data: 'personId unmatch'});
                    }
                });
                break;
            default:
                break;
        }

            getRegistrationDeviceIdByPersonId().then(function (json) {
                if (json.re == 1) {
                    var registrationId = json.data;
                    var msg = {
                        source: personId,
                        content: info.msg
                    };

                }
            }).catch(function (err) {
                var str = '';
                for (var field in err)
                    str += err[field];
                console.error('err=\r\n' + str);
            });

         }else {
            deferred.reject({re: -1, data: 'there is no enough personal info'});
        }

        return deferred.promise;
}


//创建服务订单

function createCarServiceOrder(personId,info){
    var deferred=Q.defer();
    var customerId=null;
    getCustomerIdByPersonId(personId).then(function(json) {
        if(json.re==1) {
            customerId=json.id;
            return getCurDayOrderNumWithSequelize('InsuranceCarServiceOrder');
        }
        else{
            deferred.reject({re: -1});
        }
    }).then(function(json) {
      if(json.re==1)
      {
          var num=json.data;
          var estimateTime=null;
          var ob=null;
          if(info.maintain!==undefined&&info.maintain!==null)
          {
              ob={
                  customerId:customerId,
                  orderNum:num,
                  serviceType:info.maintain.serviceType,
                  orderState:1,
                  estimateTime:info.maintain.estimateTime,
                  subServiceTypes:info.maintain.subServiceTypes.toString(),
                  servicePersonId:info.maintain.servicePersonId!==undefined&&info.maintain.servicePersonId!==null?
                      info.maintain.servicePersonId:null,
                  applyTime:new Date()

              };
          }else if(info.carManage!==undefined&&info.carManage!==null)//车驾管
          {
              ob={
                  customerId:customerId,
                  orderNum:num,
                  serviceType:info.carManage.serviceType,
                  orderState:1,
                  estimateTime:info.carManage.estimateTime,
                  servicePersonId:info.carManage.servicePersonId!==undefined&&info.carManage.servicePersonId!==null?
                      info.carManage.servicePersonId:null,
                  applyTime:new Date()
              }

          }else{}

          return models.InsuranceCarServiceOrder.create(ob);
      }
    }).then(function(ins) {
      if(ins!==undefined&&ins!==null)
      {
          deferred.resolve({re: 1, data: ins});
      }else{
          deferred.reject({re: -1, data: 'create order encounter error'});
      }
    }).catch(function(err) {
        var str='';
        for(var feild in err)
            str+=err[field];
        console.error('err=\r\n' + str);
    });

    return deferred.promise;
}

// function createCarServiceOrderItem(orderId,routineIds)
// {
//     var deferred=Q.defer();
//     var ob=[];
//     routineIds.map(function(routineId,i) {
//        ob.push({orderId:orderId,routineId:routineId});
//     });
//     models.InsuranceCarServiceOrderItem.bulkCreate(ob).then(function(json) {
//         console.log('...');
//         deferred.resolve(({re: 1}));
//     });
//     return deferred.promise;
// }



function generateCarServiceOrder(personId,info)
{
    var deferred=Q.defer();
    createCarServiceOrder(personId,info).then(function(json) {
      if(json.re==1)
      {
          deferred.resolve({re:1,data:json.data});
      }
    }).catch(function(err) {
       var str='';
        for(var field in err)
        str+=err[field];
        console.error('err=\r\n'+str);
    });
    return deferred.promise;
}

//同步用户的自身地理位置
function uploadGeolocation(personId,info){
    var deferred=Q.defer();
    if(info.geolocation!==undefined&&info.geolocation!==null)
    {
        var geolocation=info.geolocation;
        models.InsuranceCustomer.update({longitude: geolocation.lng, latitude: geolocation.lat}, {where: {personId: personId}}).then(function(ins) {
           if(ins!==undefined&&ins!==null)
           {
               deferred.resolve({re: 1, data: ''});
           }else
           {
               deferred.resolve({re: 2, data: ''});
           }
        });
    }else{
        deferred.reject({re: -1, data: 'geolocation is invalid'});
    }
    return deferred.promise;
}

function getMaintainServiceRoutine(){
    var deferred=Q.defer();
    models.InsuranceCarServiceRoutine.findAll({}).then(function (inses) {
        if(inses!==undefined&&inses!==null&&inses.length>0) {
            var routines={};
            inses.map(function(ins,i) {
               if(routines[ins.routineType]==undefined&&routines[ins.routineType]==null)
                   routines[ins.routineType]=[];
                routines[ins.routineType].push(ins);
            });
            deferred.resolve({re: 1, data: routines});
        }else{
            deferred.reject({re: -1, data: ''});
        }
    });
    return deferred.promise;
}


function  updateServiceOrderStateAndServicePersonId(personId,info)
{
    var deferred= Q.defer();
    var servicePersonId=null;
    var registrationId=null;
    var mobilePhone=null;
    models.InsuranceCustomer.find({where: {customerId: info.order.customerId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null){
            registrationId=ins.registrationId;
            return  models.InfoPersonInfo.find({where:{personId:personId}});

        }else
            deferred.reject({re:-1});
    }).then(function(ins){
        if(ins!==null&&ins!==undefined){
            mobilephone=ins.mobilePhone;
            return  models.InsuranceCarServicePerson.find({where:{personId:personId}});
        }
        else
            deferred.reject({re:-1});
    }).then(function(ins) {
        if(ins!==null&&ins!==undefined) {
            servicePersonId=ins.servicePersonId;
            return models.InsuranceCarServiceOrder.find({where:{orderId:info.order.orderId}})
        }
        else
            deferred.reject({re:-1});
    }).then(function(ins) {
        if(ins!==undefined&&ins!==null)
            ins.update({orderState:info.orderState,servicePersonId:servicePersonId}).then(function(re) {
                //deferred.resolve({re: 1});
                JPushCustomer.push().setPlatform(JPush.ALL)
                    .setAudience(JPush.registration_id(registrationId))
                    .setMessage(JSON.stringify({mobilePhone:mobilePhone,order:ins}))
                    .send(function (err, res) {
                        if (err) {
                            deferred.reject({re: -1, data: err.message})
                        } else {
                            deferred.resolve({re: 1, data: 'msg send successfully'});
                        }
                    });
            });
        else
            deferred.reject({re:-1});
    }).catch(function(err) {
        var str='';
        for(var field in err) {
            str+=err[field];
        }
        console.error('error=\r\n' + str);
    });


    return deferred.promise;
}

function uploadAudio(req,orderId,filename,audioType) {
    var deferred=Q.defer();
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../data/';
    var dir = __dirname + '/../data/';
    dir = ftpRoot.base + ftpRoot.branches[audioType] + '/' + audioType;
    var suffix=null;
    var reg=/.*\.(.*)?/;
    var re=reg.exec(filename);
    if(re!==undefined&&re!==null)
        suffix=re[1];
    form.parse(req, function (error, fields, files) {
        if(error)
            deferred.reject({re: -1, data: error.toString()});
        fs.renameSync(files.file.path, dir + '/' + audioType + '.' + suffix);
        deferred.resolve({re: 1, data: ''});
    });
    return deferred.promise;
}

function  uploadVideo(req,orderId,filename,videoType)
{
    var deferred=Q.defer();
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../data/';
    var dir = __dirname + '/../data/';
    dir = ftpRoot.base + ftpRoot.branches[videoType] + '/' + videoType;
    var suffix=null;
    var reg=/.*\.(.*)?/;
    var re=reg.exec(filename);
    if(re!==undefined&&re!==null)
        suffix=re[1];
    form.parse(req, function (error, fields, files) {
        if(error)
            deferred.reject({re: -1, data: error.toString()});
        fs.renameSync(files.file.path, dir + '/' + videoType + '.' + suffix);
        deferred.resolve({re: 1, data: ''});
    });

    return deferred.promise;
}

function servicePersonTakeOrder(personId,info) {
    var deferred=Q.defer();
    var mobilePhone=null;
    var servicePerson=null;
    var registrationId=null;
    models.InsuranceCustomer.find({where:{customerId:info.customerId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            registrationId=ins.registrationId;
            models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
                servicePerson=ins;
                models.InfoPersonInfo.find({where: {personId: personId}}).then(function(ins) {
                    if(ins!==undefined&&ins!==null)
                    {
                        mobilePhone=ins.mobilePhone;

                    }
                    servicePerson.mobilePhone=mobilePhone;
                    JPushCustomer.push().setPlatform(JPush.ALL)
                        .setAudience(JPush.registration_id(registrationId))
                        .setMessage(JSON.stringify({mobile:mobile}))
                        .send(function (err, res) {
                            if (err) {
                                deferred.reject({re: -1, data: err.message})
                            } else {
                                deferred.resolve({re: 1, data: 'msg send successfully'});
                            }
                        });
                });

            });

        }
        else{
            deferred.reject({re: -1});
        }
    });

    return deferred.promise;
}


function getCustomerRegistrationIdByCustomerId(info) {
    var deferred=Q.defer();
    models.InsuranceCustomer.find({where: {customerId: info.customerId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
            deferred.resolve({re: 1, data: ins});
        else
            deferred.reject({re: -1});
    })
    return deferred.promise;
}


function  fetchServiceOrderByCustomerId(personId)
{
    var deferred=Q.defer();
    var customerId=null;
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            customerId=ins.customerId;
            models.InsuranceCarServiceOrder.findAll({where: {customerId: customerId}}).then(function(ins) {
                if(ins!==undefined&&ins!==null&&ins.length>0)
                    deferred.resolve({re: 1, data: ins});
                else
                    deferred.reject({re: -1});
            })
        }
        else
            deferred.reject({re: -1});
    })
    return deferred.promise;
};

function updateServiceOrderState(personId,info)
{
    var deferred=Q.defer();
    var con={};
    if(info.order!==undefined&&info.order!==null)
        con.orderId=info.order.orderId;
    con.servicePersonId=info.order.servicePersonId;

    models.InsuranceCarServiceOrder.update({orderState:info.orderState}, {where: con}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            switch (info.orderState) {
                case -1:
                    if(info.order.orderState!=1)
                    {
                        models.InsuranceCarServicePerson.find({where:{servicePersonId:info.order.servicePersonId}}).then(function(ins) {
                            if(ins!==undefined&&ins!==null)
                            {
                                JPushServicePerson.push().setPlatform(JPush.ALL)
                                    .setAudience(JPush.registration_id(ins.registrationId))
                                    .setMessage(JSON.stringify('??'))
                                    .send(function (err, res) {
                                        if (err) {
                                            deferred.reject({re: -1, data: err.message})
                                        } else {
                                            deferred.resolve({re: 1, data: 'msg send successfully'});
                                        }
                                    });

                            }
                        });
                    }else{}
                    break;
                case -2:
                    fetchRegistrationIdByPersonId(personId).then(function(json) {
                        if(json.re==1)
                        {
                            JPushCustomer.push().setPlatform(JPush.ALL)
                                .setAudience(JPush.registration_id(json.data))
                                .setMessage(JSON.stringify({order:ins,msg:'order has been canceled'}))
                                .send(function (err, res) {
                                    if (err) {
                                        deferred.reject({re: -1, data: err.message})
                                    } else {
                                        deferred.resolve({re: 1, data: 'msg send successfully'});
                                    }
                                });
                        }
                    });
                    break;
                case 3:
                    fetchRegistrationIdByPersonId(personId).then(function(json) {
                        if(json.re==1)
                        {
                            JPushCustomer.push().setPlatform(JPush.ALL)
                                .setAudience(JPush.registration_id(json.data))
                                .setMessage(JSON.stringify({order:ins,msg:'order has been completed'}))
                                .send(function (err, res) {
                                    if (err) {
                                        deferred.reject({re: -1, data: err.message})
                                    } else {
                                        deferred.resolve({re: 1, data: 'msg send successfully'});
                                    }
                                });
                        }
                    });
                    break;
                default :
                    break;
            }
            deferred.resolve({re: 1,data:ins});
        }else{
            deferred.reject({re: -1});
        }
    });
    return deferred.promise;
}

function fetchRegistrationIdByPersonId(personId) {
    var deferred=Q.defer();
    models.InsuranceCustomer.find({personId: personId}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            deferred.resolve({re: 1, data: ins.registrationId});
        }else{
            models.InsuranceServicePerson.find({personId:personId}).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                {
                    deferred.resolve({re: 1, data: ins.registrationId});
                }else{
                    deferred.reject({re: -1});
                }
            });
        }
    });
    return deferred.promise;
}

function getCarInfo(info) {
    var deferred=Q.defer();
    models.InsuranceCarInfo.find({where:{carId:info.order.carId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            deferred.resolve({re: 1, data: ins});
        }else{
            deferred.reject({re: -1});
        }
    });
    return deferred.promise;
}

//返回不同的省名字
function getProvinces()
{
    var deferred=Q.defer();
    models.sequelize.query('select distinct(provinceName) from base_pro_town',{model:models.BaseProTown}).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0) {
            deferred.resolve({re: 1, data: ins});
        }else{
            deferred.reject({re: -1});
        }
    })
    return deferred.promise;
}

function fetchCitiesByProvince(provinceName) {
    var deferred=Q.defer();
    models.sequelize.query('select distinct(cityName) from base_pro_town where provinceName=\''+provinceName+'\'',{model:models.BaseProTown})
    .then(function(ins) {
       if(ins!==undefined&&ins!==null&&ins.length>0) {
           deferred.resolve({re: 1, data: ins});
       }else{
           deferred.reject({re: -1, data: ''});
       }
    });
    return deferred.promise;
}

function fetchTownsByCity(provinceName,cityName) {
    var deferred=Q.defer();
    models.sequelize.query('select distinct(townName) from base_pro_town where provinceName=\''+provinceName+'\''+' and cityName=\''+cityName+'\'',{model:models.BaseProTown})
    .then(function(ins) {
        if (ins !== undefined && ins !== null && ins.length > 0) {
            deferred.resolve({re: 1, data: ins});
        } else
        {
            deferred.reject(({re: -1, data: ''}));
        }
    });

return deferred.promise;
}

function updateCandidateState(info) {
    var deferred=Q.defer();
    var ob=[];
    var servicePersonIds=info.servicePersonIds;
    servicePersonIds.map(function(servicePersonId,i) {
        if(info.candidateState!==undefined&&info.candidateState!==null)
            ob.push({orderId:info.orderId,servicePersonId:servicePersonId,candidateState:info.candidateState});
        else
            ob.push({orderId:info.orderId,servicePersonId:servicePersonId,candidateState:1});
    });
    models.InsuranceCarServiceOrderCandidate.bulkCreate(ob).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0)
        {
            deferred.resolve({re: 1, data: ''});
        }else{
            deferred.reject({re: -1});
        }
    });
    return deferred.promise;
}

function fetchMaintenanceInArea(info){
    var deferred=Q.defer();
    if(Object.prototype.toString.call(info.townName)=='[object Array]')
    {
        models.InsuranceCarServiceUnit.findAll({
            where:{
                province:{$like:'%'+info.provinceName+'%'},
                city:{$like:'%'+info.cityName+'%'},
                town:{$in:info.townName}
            },
            model:models.InsuranceCarServiceUnit}).then(function(ins) {
            if(ins!==undefined&&ins!==null)
                deferred.resolve({re: 1, data: ins});
            else
                deferred.reject({re: -1});
        })
    }else{
        models.InsuranceCarServiceUnit.findAll({
                where:{
                    province:{
                        $like:'%'+info.provinceName+'%'
                    },
                    city:{
                        $like:'%'+info.cityName+'%'
                    },
                    town:{
                        $like:'%'+info.townName+'%'
                    }
                },

                model:models.InsuranceCarServiceUnit}
        ).then(function(ins) {
                if(ins!==undefined&&ins!==null&&ins.length>0) {
                    deferred.resolve({re: 1, data: ins});
                }else{
                    deferred.reject({re: -1});
                }
            })
    }
    return deferred.promise;
}

function getServicePersonByMaintenance(maintenance)
{
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {unitId: maintenance.unitId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null) {
           deferred.resolve({re:1,data:ins});
       }else{
           deferred.reject({re: -1});
       }
    });
    return deferred.promise;
}

function getServicePersonByUnitId(unitId)
{
    var deferred=Q.defer();
    var servicePerson=null;
    models.InsuranceCarServicePerson.find({where:{unitId:unitId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            servicePerson=ins.dataValues;
            models.InfoPersonInfo.find({where: {personId: servicePerson.personId}}).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                {
                    servicePerson.perName=ins.perName;
                    deferred.resolve({re: 1, data: servicePerson});
                }
            })
        }
        else
            deferred.resolve({re: -1});
    });
    return deferred.promise;
}

function getServicePersonsByUnits(units) {
    var deferred=Q.defer();
    var statistics={
        count:0,
        target:units.length,
        servicePersons:[]
    };
    if(units!==undefined&&units!==null&&Object.prototype.toString.call(units)=='[object Array]')
    {
        for(var i=0;i<units.length;i++) {
            var unit=units[i];
            var func=function(ob)
            {
                models.InsuranceCarServicePerson.find({where:{unitId:unit.unitId}}).then(function(ins) {
                    if(ins!==undefined&&ins!==null)
                    {
                        ob.servicePersons.push(ins);
                        if(ob.servicePersons.length==ob.target)
                            deferred.resolve({re: 1, data: ob.servicePersons});
                    }else{
                    }
                });
            }
            func(statistics);
        }
    }else{
        deferred.reject({re: -1});
    }
    return deferred.promise;
}






function sendCustomMessageToServicePerson(info)
{
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {servicePersonId: info.servicePersonId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null)
       {
           var registrationId=ins.registrationId;
           if(registrationId!==undefined&&registrationId!==null)
           {
               JPushServicePerson.push().setPlatform(JPush.ALL)
                   .setAudience(JPush.registration_id(registrationId))
                   .setMessage(JSON.stringify(info.content))
                   .send(function (err, res) {
                       if (err) {
                           deferred.reject({re: -1, data: err.message})
                       } else {
                           deferred.resolve({re: 1, data: 'msg send successfully'});
                       }
                   });
           }else{
                console.log('invalid registrationId'.blue);
               deferred.resolve({re: 2, data: 'invalid registrationId'});
           }
       }else{}
    });
    return deferred.promise;
}

//发送推送消息
function sendCustomMessage(personId,info)
{
    var deferred=Q.defer();
    switch (info.type) {
        case 'to-servicePerson':
            var statistics={
                count:0,
                target:info.servicePersonIds.length
            }
            if(info.servicePersonIds!==undefined&&info.servicePersonIds!==null)
            {
                for(var i=0;i<info.servicePersonIds.length;i++) {
                    var servicePersonId=info.servicePersonIds[i];
                    var callback=function(item)
                    {
                        sendCustomMessageToServicePerson({servicePersonId:servicePersonId,content:{order:info.order}}).then(function(json) {
                            if(json.re==1)
                            {
                                item.count++;
                                if(item.count==item.target)
                                    deferred.resolve({re: 1, data: 'send completely'});
                            }else{
                                deferred.resolve({re: 1,data:'invalid registrationId'});
                            }
                        });
                    }
                    callback(statistics);
                }
            }
            break;
        case 'confirm-to-service-person':
            var statistics={
                count:0,
                target:info.servicePersonIds.length
            }
            if(info.servicePersonIds!==undefined&&info.servicePersonIds!==null)
            {
                for(var i=0;i<info.servicePersonIds.length;i++) {
                    var servicePersonId=info.servicePersonIds[i];
                    var callback=function(item)
                    {
                        sendCustomMessageToServicePerson({servicePersonId:servicePersonId,content:{order:info.order},type:'reject'}).then(function(json) {
                            if(json.re==1)
                            {
                                item.count++;
                                if(item.count==item.target)
                                    deferred.resolve({re: 1, data: 'send completely'});
                            }else{
                                deferred.resolve({re: 1,data:'invalid registrationId'});
                            }
                        });
                    }
                    callback(statistics);
                }
            }
            break;
        case 'to-customer':
            models.InsuranceCustomer.find({where: {customerId: info.order.customerId}}).then(function(ins) {
                if(ins!==undefined&&ins!==null)
                {
                    var registrationId=ins.registrationId;
                    if(registrationId!==undefined&&registrationId!==null)
                    {
                        models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
                            var servicePersonId=ins.servicePersonId;
                            var msg={
                                unitName:info.unitName,
                                mobilePhone:info.mobilePhone,
                                order:info.order,
                                type:'to-customer',
                                servicePersonId:servicePersonId
                            }
                            JPushCustomer.push().setPlatform(JPush.ALL)
                                .setAudience(JPush.registration_id(registrationId))
                                .setMessage(JSON.stringify(msg))
                                .send(function (err, res) {
                                    if (err) {
                                        deferred.reject({re: -1, data: err.message})
                                    } else {
                                        deferred.resolve({re: 1, data: msg});
                                    }
                                });
                        });

                    }else{
                        deferred.resolve({re: 1, data: 'lack of registrationId'});
                    }
                }else{
                    deferred.reject({re: -1, data: 'invalid customerId'});
                }
            })
            break;
        default:
            break;
    }
    return deferred.promise;
}

function getUnitByServicePerson(servicePersonId)
{
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {servicePersonId: servicePersonId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null)
       {
           var unitId=ins.unitId;
           models.InsuranceCarServiceUnit.find({where: {unitId: unitId}}).then(function(ins) {
              if(ins!==undefined&&ins!==null)
                  deferred.resolve({re: 1, data: ins});
               else
                  deferred.reject({re: -1});
           });
       }else{
           deferred.reject({re: -1});
       }
    });
    return deferred.promise;
}

function getServicePersonIdByPersonId(personId) {
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            deferred.resolve({re: 1, data: ins.servicePersonId});
        }else{
            deferred.reject({re: -1});
        }
    })
    return deferred.promise;
}

function  getOrdersFromServiceCandidate(personId)
{
    var servicePersonId=null;
    var orderId=null;
    var deferred=Q.defer();
    models.InsuranceCarServicePerson.find({where: {personId: personId}}).then(function(ins) {
        if(ins!=undefined&&ins!=null){
            servicePersonId=ins.servicePersonId;
            models.InsuranceCarServiceOrderCandidate.findAll({where: {servicePersonId: servicePersonId,candidateState:{$in:[1,2]}}}).then(function(ins) {
                if(ins!=undefined&&ins!=null&&ins.length>0){
                    var statistics={
                        target:ins.length,
                        orders:[]
                    }
                    for(var i=0;i<ins.length;i++) {
                        var orderId=ins[i].orderId;
                        var cb=function(ob) {
                            models.InsuranceCarServiceOrder.find({where: {orderId: orderId}}).then(function(ins) {
                                if(ins!==undefined&&ins!==null) {
                                    ob.orders.push(ins);
                                }
                                if(ob.orders.length==ob.target)
                                    deferred.resolve({re: 1, data: ob});
                            });
                        };
                        cb(statistics)

                    }

                }
                else{
                    deferred.reject({re: -1, data: ''});
                }
            })
        }
        else{
            deferred.reject({re:-1, data: ''});
        }
    })

    return deferred.promise;

}

function getServicePersonIdsByOrderId(orderId) {
    var deferred=Q.defer();
    models.InsuranceCarServiceOrderCandidate.findAll({where: {orderId: orderId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            var servicePersonIds=[];
            ins.map(function(candidate,i) {
                servicePersonIds.push(candidate.servicePersonId);
            });
            deferred.resolve({re: 1, data: servicePersonIds});
        }else
            deferred.reject({re: 1});
    });
    return deferred.promise;
}

//获取历史服务人员
function fetchServicePersonInHistory(personId){
    var deferred=Q.defer();
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            var customerId=ins.customerId;
            models.sequelize.query('select distinct(servicePersonId) from insurance_car_service_order where customerId='+customerId,
                {model:models.InsuranceCarServiceOrder}).then(function(ins) {
                    if(ins!==undefined&&ins!==null&&ins.length>0)
                    {
                        var servicePersonIds=[];
                        ins.map(function(servicePerson,i) {
                            if(servicePerson.servicePersonId!==undefined&&servicePerson.servicePersonId!==null)
                                servicePersonIds.push(servicePerson.servicePersonId);
                        });
                        var statistics={
                            servicePersons:[],
                            target:servicePersonIds.length
                        };
                        for(var i=0;i<servicePersonIds.length;i++) {
                            var servicePersonId=servicePersonIds[i];
                            var cb=function(ob,id) {
                                models.InsuranceCarServicePerson.find({where:{servicePersonId:id}}).then(function(ins) {
                                    if(ins!==undefined&&ins!==null)
                                    {
                                        var servicePerson=ins.dataValues;
                                        getInfoPersonInfoByServicePersonId(id).then(function(ins) {
                                            servicePerson.perName=ins.perName;
                                            ob.servicePersons.push(servicePerson);
                                            if(ob.servicePersons.length==ob.target) {
                                                deferred.resolve({re: 1, data: ob.servicePersons});
                                            }
                                        });
                                    }
                                });
                            };
                            cb(statistics,servicePersonId);
                        }
                    }
                });
        }else{
            deferred.reject({re: -1});
        }
    });
    return deferred.promise;
}

function fetchInsuranceCarInfoByCustomerId(personId) {
    var deferred=Q.defer();
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null)
       {
           var customerId=ins.customerId;
           models.InsuranceCarInfo.findAll({where: {customerId: customerId}}).then(function (ins) {
               if(ins!==undefined&&ins!==null)
                    deferred.resolve({re: 1, data: ins});
               else
                   deferred.resolve({re: 2, data: ''});
           });
       }else{
           deferred.resolve({re: -1});
       }
    });
    return deferred.promise;
}

function createInsuranceInfoPersonInfo(personId,perIdAttachId1,perIdAttachId2){
    var deferred=Q.defer();
    var ob={
        personId:personId,
        perIdAttachId1:perIdAttachId1,
        perIdAttachId2:perIdAttachId2
    };
    models.InsuranceInfoPersonInfo.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null) {
            ins.update({perIdAttachId1: perIdAttachId1,perIdAttachId2:perIdAttachId2}).then(function(ins) {
               if(ins!==undefined&&ins!==null)
                   deferred.resolve({re: 1, data: ''});
            });
        }else{
            models.InsuranceInfoPersonInfo.create(ob).then(function(ins) {
               if(ins!==undefined&&ins!==null)
                   deferred.resolve({re: 1, data:''});
            });
        }
    })
    return deferred.promise;
}

function uploadCarAndOwnerInfo(personId,info){
    var deferred=Q.defer();
    //修改已有车辆信息
    if(info.carId!==undefined&&info.carId!==null)
    {
        models.InsuranceCarInfo.find({where: {carId: info.carId}}).then(function(ins) {
           if(ins!==undefined&&ins!==null)
           {
               var ob={
                   carNum:info.carNum,
                   engineNum:info.engineNum,
                   frameNum:info.frameNum,
                   factoryNum:info.factoryNum,
                   firstRegisterDate:info.firstRegisterDate,
                   startInsuranceDate:info.startInsuranceDate,
                   issueDate:info.issueDate,
                   modifyId:personId,
                   modifyTime:new Date()
               };
               ins.update(ob).then(function(ins) {
                   if(ins!==undefined&&ins!==null)
                       deferred.resolve({re: 1,data:ins});
               })
           }
        });
    }else//注入新车信息
    {
        models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
           if(ins!==undefined&&ins!==null)
           {
               var customerId=ins.customerId;
               var perAddress=ins.perAddress;
               var ownerName=ins.ownerName;
               var ob={
                  carNum:info.carNum,
                  engineNum:info.engineNum,
                  frameNum:info.frameNum,
                  factoryNum:info.factoryNum,
                  firstRegisterDate:info.firstRegisterDate,
                  startInsuranceDate:info.startInsuranceDate,
                  issueDate:info.issueDate,
                  customerId:customerId,
                  perAddress:perAddress,
                  ownerName:info.ownerName,
                  ownerIdCard:info.ownerIdCard
               };
               models.InsuranceCarInfo.create(ob).then(function(ins) {
                  if(ins!==undefined&&ins!==null)
                      deferred.resolve({re: 1,data:ins});
               });



           }
        });
    }
    return deferred.promise;
}


//获得的是车辆和订单的福合历史消息
function getCarOrdersInHistory(personId){
    var deferred=Q.defer();
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            var customerId=ins.customerId;
            models.InsuranceCarOrder.findAll({where: {customerId: customerId, orderState: 1}}).then(function(ins) {
                if(ins!==undefined&&ins!==null&&ins.length>0) {
                    var statistics={
                        target:ins.length,
                        orders:[]
                    }
                    for(var i=0;i<ins.length;i++) {
                        var order=ins[i].dataValues;
                        var cb=function(ob,item) {
                            var carId=item.carId;
                            models.InsuranceCarInfo.find({where: {carId: carId}}).then(function(ins) {
                               if(ins!==undefined&&ins!==null)
                               {
                                   item.carNum=ins.carNum;
                                   ob.orders.push(item);
                                   if(ob.orders.length==ob.target)
                                       deferred.resolve({re: 1, data: ob.orders});
                               }
                            });
                        };
                        cb(statistics,order);
                    }
                }else{
                    deferred.resolve({re: 2, data: null});
                }
            })
        }
        else{
            deferred.resolve({re: 2, data: ''});
        }
    })
    return deferred.promise;
}

function getCarOrderPriceItemByPriceId(priceId) {
    var deferred=Q.defer();
    models.InsuranceCarOrderPriceItem.findAll({where: {priceId: priceId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0)
        {
            deferred.resolve({re: 1, data: ins});
        }else{
            deferred.resolve({re: -1});
        }
    });
    return deferred.promise;
}

function getCarOrderPriceItemsByPriceId(priceId) {
    var deferred=Q.defer();
    models.InsuranceCarOrderPriceItem.findAll({where: {priceId: priceId}}).then(function(ins) {
       if(ins!==undefined&&ins!==null&&ins.length>0)
       {
           var statistics={
               target:ins.length,
               items:[]
           };
           for(var i=0;i<ins.length;i++) {
               var single=ins[i].dataValues;
               var cb=function(ob,item) {
                   var productId=item.productId;
                   models.InsuranceCarProduct.find({where:{productId:productId}}).then(function(ins) {
                       var product=ins;
                       item.productName=product.productName;
                       item.insuranceType=product.insuranceType;
                       ob.items.push(item);
                       if(ob.items.length==ob.target)
                           deferred.resolve({re: 1, data: ob.items});
                   });
               };
               cb(statistics,single);
           }

       }else{
           deferred.resolve({re: 2,data:''});
       }
    });
    return deferred.promise;
}


function getCarOrderPricesByOrderId(orderId) {
    var deferred=Q.defer();
    models.InsuranceCarOrderPrice.findAll({where: {orderId: orderId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0) {

            var statistics={
                target:ins.length,
                prices:[]
            }
            for(var i=0;i<ins.length;i++) {
                var price=ins[i].dataValues;
                var cb=function(ob,item){
                    models.InsuranceCompanyInfo.find({where:{companyId:item.companyId}}).then(function(company) {
                        item.companyName=company.companyName;
                        getCarOrderPriceItemsByPriceId(item.priceId).then(function(json) {
                            item.items=json.data;
                            ob.prices.push(item);
                            if(ob.prices.length==ob.target)
                                deferred.resolve({re: 1, data: ob.prices});
                        });

                    });
                }
                cb(statistics, price);
            }
        }else{
            deferred.resolve({re: -1});
        }
    })
    return deferred.promise;
}

function getCarOrderInPricedState(personId){
    var deferred=Q.defer();
    models.InsuranceCustomer.find({where: {personId: personId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            var customerId=ins.customerId;
            models.InsuranceCarOrder.findAll({where: {customerId: customerId, orderState: 3}}).then(function(ins) {
               if(ins!==undefined&&ins!==null&&ins.length>0) {
                    var statistics={
                        target:ins.length,
                        orderPrices:[]
                    }
                   for(var i=0;i<ins.length;i++) {
                       var order=ins[i].dataValues;
                       var cb=function(ob,item){

                           models.InsuranceCarInfo.find({where: {carId: item.carId}}).then(function(ins) {
                               item.carNum=ins.carNum;
                               getCarOrderPricesByOrderId(item.orderId).then(function(json) {
                                   if(json.re==1) {
                                       item.prices=json.data;
                                       ob.orderPrices.push(item);
                                       if(ob.orderPrices.length==ob.target)
                                           deferred.resolve({re: 1, data: ob.orderPrices});
                                   }
                               });
                           });
                       }
                       cb(statistics,order);
                   }
               }
            });
        }else{
            deferred.resolve({re: -1});
        }
    });
    return deferred.promise;
}

function updateInsuranceCarInfo(carId,ob) {
    var deferred=Q.defer();
    models.InsuranceCarInfo.find({where: {carId: carId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null)
        {
            ins.update(ob).then(function(ins) {
               if(ins!==undefined&&ins!==null)
                   deferred.resolve({re: 1, data: ''});
            });
        }else{
            deferred.resolve({re: 2, data: ''});
        }
    })
    return deferred.promise;
}

function getCarManageFees(){
    var deferred=Q.defer();
    models.InsuranceCarServiceOrderFee.findAll({where:{feeId:1}}).then(function(ins) {
       if(ins!==undefined&&ins!==null&&ins.length>0) {
           var feeOb={};
           ins.map(function(feeItem) {
               if(feeItem.serviceProject!==undefined&&feeItem.serviceProject!==null)//有子项
               {
                   if(feeOb[feeItem.serviceType]==undefined||feeOb[feeItem.serviceType]==null)
                   {
                       feeOb[feeItem.serviceType]={};
                   }
                   feeOb[feeItem.serviceType][feeItem.serviceProject]={fee:feeItem.fee};
               }else{
                    feeOb[feeItem.serviceType]={fee:feeItem.fee};
               }
           });
           deferred.resolve({re: 1, data: feeOb});
       }
    });
    return deferred.promise;
}

function getLifeProductItemByItemId(productId) {
    var deferred=Q.defer();
    models.InsuranceLifeProduct.find({where: {productId: productId}}).then(function(ins) {
        deferred.resolve({re: 1, data: ins});
    })
    return deferred.promise;
}

function getLifeOrderPlanItemsByPlanId(planId) {
    var deferred=Q.defer();
    models.InsuranceLifeOrderPlanItem.findAll({where: {planId: planId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0) {
            var statistics={
                target:ins.length,
                planItems:[]
            }
            for(var i=0;i<ins.length;i++) {
                var planItem=ins[i].dataValues;
                var cb=function(ob,item) {
                    getLifeProductItemByItemId(item.productId).then(function(json) {
                        item.product=json.data;

                        ob.planItems.push(item);
                        if(ob.planItems.length==ob.target)
                            deferred.resolve({re: 1, data: ob.planItems});
                    });
                };
                cb(statistics,planItem);
            }

        }else{
            deferred.resolve({re: 2, data: ''});
        }
    });
    return deferred.promise;
}

function getLifeOrderPlansByOrderId(orderId) {
    var deferred=Q.defer();
    models.InsuranceLifeOrderPlan.findAll({where: {orderId: orderId}}).then(function(ins) {
        if(ins!==undefined&&ins!==null&&ins.length>0) {
            var statistics={
                target:ins.length,
                plans:[]
            };
            for(var i=0;i<ins.length;i++) {
                var plan=ins[i].dataValues;
                var cb=function(ob,item) {

                    models.InsuranceCompanyInfo.find({where: {companyId: plan.companyId}}).then(function(ins) {
                        item.companyName=ins.companyName;
                        getLifeOrderPlanItemsByPlanId(item.planId).then(function(json) {
                            item.items=json.data;
                            ob.plans.push(item);
                            if(ob.plans.length==ob.target)
                                deferred.resolve({re: 1, data: ob.plans});
                        });
                    });
                };
                cb(statistics,plan);
            }

        }else{
            deferred.resolve({re: 2, data: ''});
        }
    })
    return deferred.promise;
}

module.exports = {
    init: init,
    verifyUserPasswd: verifyUserPasswd,
    registerUser: registerUser,
    getPersonId: getPersonId,
    addCarInfo: addCarInfo,
    getCarAndOwnerInfo: getCarAndOwnerInfo,
    getLifeInfo:getLifeInfo,
    changePassword:changePassword,
    getLifeInsuranceProducts:getLifeInsuranceProducts,
    getLifeInsuranceOrders:getLifeInsuranceOrders,
    getCarOrders:getCarOrders,
    getScore:getScore,
    generateLifeInsuranceOrder:generateLifeInsuranceOrder,
    generateCarInsuranceOrder:generateCarInsuranceOrder,
    getRelativePersons:getRelativePersons,
    createRelativePerson:createRelativePerson,
    createInsurancePerson:createInsurancePerson,
    rollbackTest:rollbackTest,
    createAttachment:createAttachment,
    createPhotoAttachment:createPhotoAttachment,
    getCurDayOrderNumTest:getCurDayOrderNumTest,
    getCarInsuranceMeals:getCarInsuranceMeals,
    getOrderState:getOrderState,
    getOrderPlan:getOrderPlan,
    getOrderPlanItem:getOrderPlanItem,
    getInsuranceCompany:getInsuranceCompany,
    checkCarOrderState:checkCarOrderState,
    getCarOrderPriceItems:getCarOrderPriceItems,
    userApplyUnchangedLifeOrder:userApplyUnchangedLifeOrder,
    userUpdateLifeOrder:userUpdateLifeOrder,
    userApplyCarOrder:userApplyCarOrder,
    getLifeOrderScore:getLifeOrderScore,
    generateCode:generateCode,
    createCarServicePerson:createCarServicePerson,
    createInfoPersonInfo:createInfoPersonInfo,
    getInsuranceLifeProductFee:getInsuranceLifeProductFee,
    getInsuranceLifeProductRatio:getInsuranceLifeProductRatio,
    servicePersonRegiste:servicePersonRegiste,
    getOrderStateFromServiceOrder:getOrderStateFromServiceOrder,
    getServiceOrderByState:getServiceOrderByState,
    activatePersonOnline:activatePersonOnline,
    pushTextMsg:pushTextMsg,
    generateCarServiceOrder:generateCarServiceOrder,
    uploadGeolocation:uploadGeolocation,
    getMaintainServiceRoutine:getMaintainServiceRoutine,
    updateServiceOrderStateAndServicePersonId:updateServiceOrderStateAndServicePersonId,
    uploadVideo:uploadVideo,
    servicePersonTakeOrder:servicePersonTakeOrder,
    fetchServiceOrderByCustomerId:fetchServiceOrderByCustomerId,
    updateServiceOrderState:updateServiceOrderState,
    getCarInfo:getCarInfo,
    getProvinces:getProvinces,
    fetchCitiesByProvince:fetchCitiesByProvince,
    fetchTownsByCity:fetchTownsByCity,
    updateCandidateState:updateCandidateState,
    fetchMaintenanceInArea:fetchMaintenanceInArea,
    getServicePersonByMaintenance:getServicePersonByMaintenance,
    getServicePersonsByUnits:getServicePersonsByUnits,
    sendCustomMessage:sendCustomMessage,
    getUnitByServicePerson:getUnitByServicePerson,
    getServicePersonIdByPersonId:getServicePersonIdByPersonId,
    uploadAudio:uploadAudio,
    fetchServicePersonInHistory:fetchServicePersonInHistory,
    getServicePersonByUnitId:getServicePersonByUnitId,
    getOrdersFromServiceCandidate:getOrdersFromServiceCandidate,
    getServicePersonIdsByOrderId:getServicePersonIdsByOrderId,
    fetchInsuranceCarInfoByCustomerId:fetchInsuranceCarInfoByCustomerId,
    createInsuranceInfoPersonInfo:createInsuranceInfoPersonInfo,
    uploadCarAndOwnerInfo:uploadCarAndOwnerInfo,
    getCarOrdersInHistory:getCarOrdersInHistory,
    getCarOrderInPricedState:getCarOrderInPricedState,
    applyCarOrderPrice:applyCarOrderPrice,
    getCarManageFees:getCarManageFees,
    updateInsuranceCarInfo:updateInsuranceCarInfo,
    getLifeOrders:getLifeOrders,
    getLifeOrderPlansByOrderId:getLifeOrderPlansByOrderId
}
