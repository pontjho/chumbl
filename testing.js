var chumbl=require('./lib/chumbl.js');


function result(err,values){
    if (err){return console.error(err)}



    console.log(values)

}

chumbl.lookup.getLookupValues({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    lookupId:"53df7ec7c45312480fecaa91"
},result)



/*
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



chumbl.chomp.addStatus({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    entityId:"12345",
    id:"53ebac9fcbcfcf041bbe51a7",
    status:{
        status:"Completed",
        data:{test:"completed"}
    }
},result)



chumbl.lookups.getLookups({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test"
},result)

chumbl.lookups.getLookupValues({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    lookupId:"53df7ec7c45312480fecaa91"
},result)

 chumbl.lookups.getLookupSchema({
 chumblr:"dinersclubmiles",
 username:"diners@encentivize.co.za",
 password:"test",
 lookupId:"53df7ec7c45312480fecaa91"
 },result)

chumbl.lookups.getLookup({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    lookupId:"53df7ec7c45312480fecaa91"
},result)



chumbl.timestore.getTimestores({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test"

},result)


chumbl.timestore.getTimestore({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    timestoreId:"53df7dd5c45312480fecaa90"

},result)



chumbl.chomp.getChompQItem({
    chumblr:"dinersclubmiles",
    token:"57b7930e920309eb97fa7f54766f5c014c9464f3",

    chompQId:"53ee0667711babf01d9792e8"
},result)



 username:"diners@encentivize.co.za",
 password:"test",




chumbl.timestore.queryEntities({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    timestoreId:"53df7dd5c45312480fecaa90",
    query:"reference:1000H2"
},result
)


chumbl.transaction.getTransactionCount({
    chumblr:"dinersclubmiles",
    username:"diners@encentivize.co.za",
    password:"test",
    transactionTypeId:"53eef162876c13502036a505",
    entityId:"12345",
    query:"reference=RF2390334"
},result)

    */