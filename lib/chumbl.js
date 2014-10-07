//*********************************************************************************************************************************************************************
//requires
var _baseUrl=null;

var _environment =  process.env.NODE_ENV || 'development';
if (_environment=="development") {
    _baseUrl="http://localhost:1337";
}else if (_environment=="qa") {
    _baseUrl="http://chumbl-api-qa.azurewebsites.net";
}else{
    _baseUrl= "https://api.chumbl.com";
}

var krc=require("kwaai-restcall");
var _restService=krc({
    headers:{"Content-Type": "application/json"},
    baseUrl:_baseUrl
});


//*********************************************************************************************************************************************************************
//exports
//*********************************************************************************************************************************************************************


var timestore={
    getValues:
        function(options,callback){
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
            if (!options.targetDate){url=url.replace("{targetDate}","")};
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }


    ,getTimeline:
        function(options,callback){
            var attributes="";
            if (options.attributes){attributes=options.attributes.join(",");}
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/timeline/{startDate}/{endDate}?attributes=" + attributes;
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,queryEntities:
        function(options,callback){

            var url="/{chumblr}/timestores/{timestoreId}/entities/{targetDate}";
            if (!options.targetDate){url=url.replace("/{targetDate}","")};
            if (options.query){url+="?"+options.query;}

            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,setValues:
        function(options,callback){
            var url="/{chumblr}/timestores/{timestoreId}/{entityId}/{targetDate}";
            if (!options.targetDate){url=url.replace("/{targetDate}","")};
            options.data=options.values;
            options.verb="post";
            options.url=url;
            makeRestRequest(options,callback);
        }


    ,getTimestores:
        function(options,callback){
            options.verb="get";
            var url="/{chumblr}/timestores";
            if (options.query){
                url+="?" + options.query + "&select=_id,name";
            }
            else{
                url+="?select=_id,name";
            }
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,getTimestore:function(options,callback){
        options.verb="get";
        options.url="/{chumblr}/timestores/{timestoreId}";
        makeRestRequest(options,callback);
    }

    ,addTimestore:function(options,callback){
        options.verb="post";
        options.url="/{chumblr}/timestores";
        options.data=options.timestore;
        makeRestRequest(options,callback);
    }

    ,updateTimestore:function(options,callback){
        options.verb="put";
        options.url="/{chumblr}/timestores/{timestoreId}";
        options.data=options.timestore;
        makeRestRequest(options,callback);
    }

}

var transaction={
    saveTransaction:
        function(options,callback){

            options.data=options.transaction;
            options.verb="post";
            options.url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
            makeRestRequest(options,callback);

        }

    ,getTransaction:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/{id}";
            makeRestRequest(options,callback);
        }
    ,getTransactions:
        function(options,callback){
            var url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}";
            if (options.query){
                url+="?" + options.query;
            }
            options.verb="get";
            options.url=url
            makeRestRequest(options,callback);
        }

    ,getTransactionCount:
        function(options,callback){
            var url="/{chumblr}/transactiontypes/{transactionTypeId}/transactions/{entityId}/count";
            if (options.query){
                url+="?" + options.query;
            }
            options.verb="get";
            options.url=url;
            makeRestRequest(options,callback);
        }

    ,getTransactionTypes:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/transactiontypes?select=_id,name";
            makeRestRequest(options,callback);
        }

    ,getTransactionType:function(options,callback){
        if (options.transactionTypeName){
            options.url="/{chumblr}/transactiontypes/{transactionTypeName}";
        }else{
            options.url="/{chumblr}/transactiontypes/{transactionTypeId}";
        }
        options.verb="get";

        makeRestRequest(options,callback);
    }
}

var lookup={

    getLookups:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups?select=_id,name";
            makeRestRequest(options,callback);
        }

    ,getLookup:
        function(options,callback){
            if (options.lookupName){
                options.url="/{chumblr}/lookups/{lookupName}";
            }else{
                options.url="/{chumblr}/lookups/{lookupId}";
            }
            options.verb="get";

            makeRestRequest(options,callback);

        }
    ,getLookupValues:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups/{lookupId}/values";
            makeRestRequest(options,callback);
        }
    ,getLookupSchema:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/lookups/{lookupId}/schema";
            makeRestRequest(options,callback);
        },

    vLookup:
        function(options,callback){
            var lookupId=null;
            if (options.lookupName){
                lookupId=options.lookupName;
            }else{
                lookupId=options.lookupId;
            }

            function lookupRetrieved(err,lookupTable){
                if (err){return callback(err)}
                if (!lookupTable){return callback("lookup table unavailable for vlookup:" + lookupId);}

                function lookupValuesRetrieved(err,lookupValues){
                    if (err){return callback(err)}
                    if (!lookupValues){return callback("lookup table unavailable for vlookup:" + lookupId);}
                    var foundValue=null;
                    for (var i=0;i<lookupValues.length;i++){
                        if (lookupValues[i][options.lookupColumn]===options.value){
                            if (lookupValues[i][options.returnColumn]||lookupValues[i][options.returnColumn]===0){
                                foundValue=lookupValues[i][options.returnColumn];
                            }
                            break;
                        }
                    }
                    return callback(null,foundValue);
                }

                options.lookupId=lookupTable._id.toString();
                lookup.getLookupValues(options,lookupValuesRetrieved);
            }

            lookup.getLookup(options,lookupRetrieved);
         }
}

var chomp={
    getChompQItem:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/chompq/{chompQId}";
            makeRestRequest(options,callback);
        }
    ,addQItemStatus:
        function(options,callback){
            options.data=options.status;
            options.verb="post";
            options.url="/{chumblr}/chompq/{chompQId}/status";
            makeRestRequest(options,callback);
        }

    ,getChomps:
        function(options,callback){
            options.verb="get";
            var url="/{chumblr}/chomps?select=_id,name";
            if (options.query){
                url+="?" + options.query;
            }
            options.url=url;
            makeRestRequest(options,callback);
        }
    ,getChomp:function(options,callback){
        options.verb="get";
        options.url="/{chumblr}/chomps/{chompId}";
        makeRestRequest(options,callback);
    },

    runChomp:function(options,callback){
        options.verb="post";
        options.url="/{chumblr}/chomps/{chompId}/run";
        options.data=options.inputData;
        makeRestRequest(options,callback);
    },

    addChomp:function(options,callback){
        options.verb="post";
        options.url="/{chumblr}/chomps";
        options.data=options.chomp;
        makeRestRequest(options,callback);
    },
    updateChomp:function(options,callback){
        options.verb="put";
        options.url="/{chumblr}/chomps/{chompId}";
        options.data=options.chomp;
        makeRestRequest(options,callback);
    },

    addScheduledRun:function(options,callback){
        options.verb="post";
        options.url="/{chumblr}/chomps/{chompId}/scheduledruns";
        options.data=options.scheduledRun;
        makeRestRequest(options,callback);
    },

    getScheduledRuns:function(options,callback){
        options.verb="get";
        var url="/{chumblr}/chomps/{chompId}/scheduledruns";
        if (options.query){
            url+="?" + options.query;
        }
        options.url=url;
        makeRestRequest(options,callback);
    },
    getRunQ:function(options,callback){
        options.verb="get";
        var url="/{chumblr}/chomps/{chompId}/runq";
        if (options.query){
            url+="?" + options.query;
        }
        options.url=url;
        makeRestRequest(options,callback);
    }


}


var variables={
    getVariables:
        function(options,callback){
            options.verb="get";
            options.url="/{chumblr}/variables?select=_id,name";
            makeRestRequest(options,callback);
        }

    ,getVariable:
        function(options,callback){
            if (options.variableName){
                options.url="/{chumblr}/variables/{variableName}";
            }
            else{
                options.url="/{chumblr}/variables/{variableId}";
            }
            options.verb="get";

            makeRestRequest(options,callback);

        }
    ,getVariableValue:
        function(options,callback){
            if (options.variableName){
                options.url="/{chumblr}/variables/{variableName}";
            }
            else{
                options.url="/{chumblr}/variables/{variableId}";
            }
            options.verb="get";

            function variableRetrieved(err,variable){
                if (err){return callback(err);}
                if (!variable){return callback(null,null);}
                return callback(null,variable.value);
            }

            variables.getVariable(options,variableRetrieved);

        }
}

var api=
{
    timestore:timestore,
    transaction:transaction,
    chomp:chomp,
    lookup:lookup,
    variables:variables
}


module.exports=api;


function makeRestRequest(options,callback){

    if (!options.headers){options.headers={};}

    if (options.token){
        options.headers.externalauthtoken=options.token;
        options.auth={user:options.token,password:"xxxxxx"};
    }if (!options.auth && options.username && options.password){
        options.auth={user:options.username,password:options.password};
    }

    function serviceCalled(err,result){
        return callback(err,result);
    }

    _restService.callRestService(options,serviceCalled);
}

