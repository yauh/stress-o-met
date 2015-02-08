console.log("loaded methods.js");
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
        // console.log('connecting to:', data.mongoUrl, data.collectionName);
        var database = new MongoInternals.RemoteCollectionDriver(data.mongoUrl);
        var dbinserts = new RateLimit(data.rate, data.interval, data.burst);
        var operationCount = 0;
        for (var i = 0; i < 10; i++) {
            operationCount++;
            (function (numOperation) {
                setTimeout(Meteor.bindEnvironment(function () {
                    dbinserts.schedule(Meteor.bindEnvironment(function () {
                        database.open(data.collectionName).insert({foo: 'bar'});
                        console.log('Operation %d', numOperation);
                    }));
                }));
            })(operationCount);
        }
        return operationCount;
        //var i;
        //
        //insertToMongo = function (data, callback) {
        //    var dbinserts = new RateLimit(data.rate, data.interval, data.burst);
        //    for (var i = 0; i < 1000; i++) {
        //        (function (numOperation) {
        //            setTimeout(function () {
        //                dbinserts.schedule(function () {
        //                    database.open(data.collectionName).insert({foo: 'bar'}, function (err, res) {
        //                        if (err) throw new Error(err.message);
        //                        else callback && callback(null, console.log('Operation %d', numOperation));
        //                    });
        //                });
        //            });
        //        })(i);
        //    }
        //};
        //
        //var doDbInserts = Meteor.wrapAsync(insertToMongo);
        //var result = doDbInserts(data);  // <-- no wait() here!


    }
});

