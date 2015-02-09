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
            operations: Number,
            interval: Number,
            duration: Number
        });
        data.burst = false; // perhaps later we will enhance it to allow bursts
        waitLimitMs = Math.floor((data.interval / data.operations) * 1000); // defines the wait time between two operations in ms
        console.log("stats:", waitLimitMs, data.operations, data.interval);
        console.log('method insertToMongo called');
        console.log(data.mongoUrl, data.collectionName, data.operations, data.interval, data.duration);

        var database = new MongoInternals.RemoteCollectionDriver(data.mongoUrl);
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

        insertCount = performOperations(database, endTime, operationObject, waitLimitMs);

        //}
        console.log("done with ", operationCount, "operations");

        // TODO: Prevent premature notification in the UI (callback?)
        return insertCount;
    },
    // TODO: Not functional yet, but cancel should be possible at any time
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
// TODO: add callback

performOperations = function (database, endTime, operationObject, waitLimitMs) {
    // this will be useful as our return value
    var operationsCount = 0;

    // Temporary debug logging
    //console.log("running from  " + moment());
    //console.log("running until " + endTime);
    //console.log("is it pre-endTime?", moment().isBefore(endTime));

    // actually perform the insertion operation
    function insertDoc() {
        operationsCount++;
        database.open(operationObject.collectionName).insert({foo: 'bar'}, Meteor.bindEnvironment(function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        }));
    };

    var insertDocWithLimit = _.rateLimit(Meteor.bindEnvironment(insertDoc), waitLimitMs, true);
    for (var i = 0; i < 10; i++) { // TODO: This should become while (moment().isBefore(endTime)), for testing only do 10
        insertDocWithLimit(i);
    }

    return operationsCount;
};