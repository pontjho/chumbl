//*********************************************************************************************************************************************************************
//requires
//*********************************************************************************************************************************************************************
var restClient = require('node-rest-client').Client;

var _options={baseUrl:"http://localhost:1337"}
//*********************************************************************************************************************************************************************
//exports
//*********************************************************************************************************************************************************************


var timestore={
    getValues:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            callChumblGet(url,options,callback);
        }


    ,getTimeline:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/timeline/:startDate/:endDate?attributes=" + options.attributes.join(",");
            callChumblGet(url,options,callback);
        }

    ,queryEntities:
        function(options,callback){

            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/entities/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            if (options.query){url+="?query="+options.query;}

            callChumblGet(url,options,callback);
        }

    ,setValues:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/timestores/:timestoreId/:entityId/:targetDate";
            if (!options.targetDate){url=url.replace("/:targetDate","")};
            options.data=options.values;
            callChumblPost(url,options,callback);
        }


}

var transactions={
    saveTransaction:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId";
            options.data=options.transaction;
            callChumblPost(url,options,callback);

        }

    ,getTransaction:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId/:id";
            callChumblGet(url,options,callback);
        }
    ,getTransactions:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/transactiontypes/:transactionTypeId/transactions/:entityId";
            if (options.query){
                url+="?" + options.query;
            }
            callChumblGet(url,options,callback);
        }
}




var chomp={
    getChompQItem:
        function(options,callback){
            var url=_options.baseUrl+"/:chumblr/chompq/:id";
            callChumblGet(url,options,callback);
        }
}

var api=
{
    timestore:timestore,
    transactions:transactions,
    chomp:chomp
}


module.exports=api;

function parseUrl(url,options){
    for (var k in options){
        url=url.replace(":" + k,options[k])
    }
    return url;
}

function callChumblGet(url,options,callback){

    var client=null;
    var args={
        headers:{
            "Content-Type": "application/json"
        }
    }
    if (!options.token){
        var options_auth={user:options.username,password:options.password};
        client=new restClient(options_auth);
    }
    else{
        args.headers.externalauthtoken=options.token;
        client=new restClient();
    }

    function apiCalled(result,response){
        return parseResult(response.statusCode,result,callback);
    }

    url=parseUrl(url,options);

    client.get(url, args, apiCalled);

}

function callChumblPost(url,options,callback){
    var client=null;
    var args={
        headers:{
            "Content-Type": "application/json"

        },
        data:options.data
    }

    if (!options.token){
        var options_auth={user:options.username,password:options.password};
        client=new restClient(options_auth);
    }
    else{
        args.headers.externalauthtoken=options.token;
        client=new restClient();
    }

    function apiCalled(result,response){
        return parseResult(response.statusCode,result,callback);
    }

    url=parseUrl(url,options);

    client.post(url, args, apiCalled);
}


function parseResult(statusCode,result,callback){
    if (statusCode>=500){
        return callback(result);
    }
    else if (statusCode==204){
        return callback(null,null);
    }
    else if (statusCode>=200&&statusCode<300){
        return callback(null,JSON.parse(result));
    }
    else if (statusCode==404){
        return callback(null,null);
    }
    else if (statusCode==401){
        return callback("Not Authorised",null);
    }
    else if (statusCode==400){
        return callback("Bad Request",null);
    }
    else{
        return callback(null,null);
    }

}
