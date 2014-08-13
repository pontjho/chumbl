var chumbl=require('./lib/chumbl.js');


function result(err,values){
    if (err){return console.error(err)}
    console.log(values);
}

chumbl.timestore.getValues({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    timestoreId:"53df7dd5c45312480fecaa90"
},result)

chumbl.timestore.setValues({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    timestoreId:"53df7dd5c45312480fecaa90",
    values:{earnrate:5}
},result)

chumbl.timestore.getValues({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    timestoreId:"53df7dd5c45312480fecaa90"
},result)

chumbl.timestore.getTimeline({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    timestoreId:"53df7dd5c45312480fecaa90",
    startDate:"2014-01-01T00:00:00Z",
    endDate:"2015-01-01T00:00:00Z",
    attributes:["earnrate"]
},result)

chumbl.timestore.queryEntities({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    timestoreId:"53df7dd5c45312480fecaa90",
    query:"reference:1000H2"
},result)


chumbl.chomp.getChompQItem({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    id:"53ebac9fcbcfcf041bbe51a7"
},result)