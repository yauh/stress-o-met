console.log("loaded methods.js");
//use this to cancel any running operation
var cancel = false;
Meteor.methods({
    'testDbConnection': function (data) {
        check(data, {
            mongoUrl: String,
            collectionName: String
        });

        console.log('testing:', data.mongoUrl, data.collectionName);
        var database = new MongoInternals.RemoteCollectionDriver(data.mongoUrl);
        var numberOfDocs = database.open(data.collectionName).find().count();
        console.log('my work here is done, I return with a ' + numberOfDocs);
        return database.open(data.collectionName).find().count();
    },
    'insertToMongo': function (data) {
        check(data, {
            mongoUrl: String,
            collectionName: String,
            rate: Number,
            interval: Number,
            duration: Number
        });
        data.burst = false; // perhaps later we will enhance it to allow bursts
        console.log('method insertToMongo called');
        console.log(data.mongoUrl, data.collectionName, data.rate, data.interval, data.duration);

        var database = new MongoInternals.RemoteCollectionDriver(data.mongoUrl);
        var rate = new RateLimit(data.rate, data.interval, data.burst);
        var operationCount = 0;

        // TODO: Make docObject customizable
        var operationObject = {};
        operationObject.collectionName = data.collectionName;
        operationObject.doc = {foo: 'bar'};

        var testDuration = 10; // TODO: change back to data.duration;
        var endTime = moment();
        // duration is given in minutes, TODO: change back unit from s to m
        endTime.add(testDuration, 's');

        // TODO: Async
        // insert docs at rate into DB for duration

        insertCount = performOperations(database, rate, endTime, operationObject);

        //}
        console.log("done with ", operationCount, "operations");
        return insertCount;


    },
    // clicking the cancel button should cancel load testing immediately
    'cancel': function () {
        console.log('user wants us to cancel');
        cancel = true;
    }
});

// This should be a generic function to be re-used for methods (eventually)
// function takes connection (mongo or meteor server),
// rate (object),
// endTime (moment object)
// and operationsObject that contains the actual operation and any data (split into command and data?)

performOperations = function (database, rate, endTime, operationObject) {
    // this will be useful as our return value
    var operationsCount = 0;

    // Tenmporary debug logging
    console.log("running from  " + moment());
    console.log("running until " + endTime);
    console.log("is it pre-endTime?", moment().isBefore(endTime));

    //while (moment().isBefore(endTime)) { // TODO: This is what we actually want, but it's a mess inside async

    // old and working, but should be using while
    for (var i = 0; i < 10; i++) {
        operationsCount++;
        (function (numOperation) {
            rate.schedule(Meteor.bindEnvironment(function () {
                database.open(operationObject.collectionName).insert({foo: 'bar'}, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(result);
                    }
                });

                console.log('Operation %d', numOperation);
            }));
        })(operationsCount);
    }
    // TODO: Prevent premature notification in the UI
    return operationsCount;
};