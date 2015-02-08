console.log("loaded client.js");
Meteor.startup(function () {
    Notifications.defaultOptionsByType[Notifications.TYPES.SUCCESS] = _.defaults({
            timeout: 5000
        },
        Notifications.defaultOptions);
});

Template.mongodb.helpers({
    status: function () {
        return Session.get('status');
    }
});

Template.mongodb.events({
    'click button#test-db-connection': function (evt, tpl) {
        evt.preventDefault();
        var mongoUrl = $("input[name=mongoUrl]").val();
        var collectionName = $("input[name=collectionName]").val();
        console.log(mongoUrl, collectionName);
        Meteor.call('testDbConnection', {
            mongoUrl: mongoUrl,
            collectionName: collectionName
        }, function (error, result) {

            if (error) {
                Notifications.error('Could not connect to MongoDB', 'Could not establish a connection to ' + mongoUrl + ' or the ' + collectionName + ' collection.');
                console.log("error connecting to MongoDB:", error);

            }
            else {
                console.log(result);
                Notifications.success('Successfully connected to MongoDB', 'Successfully connected to ' + mongoUrl + '.<br/>' + +result + ' docs in the ' + collectionName + ' collection.', {timeout: 5000});
                console.log("successfully connected to MongoDB, found " + result + " document(s)");
            }
        });
    },
    'click button#run-mongo-stress': function (evt, tpl) {
        evt.preventDefault();
        // var arrayOfLines = $("#input").val().split("\n");
        var mongoUrl = $("input[name=mongoUrl]").val();
        var collectionName = $("input[name=collectionName]").val();
        var operations = parseInt($("input[name=operations]").val());
        var interval = parseInt($("input[name=interval]").val());
        var duration = parseInt($("input[name=duration]").val());
        Meteor.call('insertToMongo', {
            mongoUrl: mongoUrl,
            collectionName: collectionName,
            operations: operations,
            interval: interval,
            duration: duration
        }, function (error, result) {

            if (error) {
                Notifications.error('Whoops', 'Error encountered:', error);
                console.log("error connecting to MongoDB", error);

            }
            else {
                console.log(result);
                Notifications.success('Done', 'Inserted ' + result + ' docs.');
                console.log("Inserted " + result + " docs.");
            }
        });
    },
    'click button#cancel': function(evt){
        evt.preventDefault();
        Meteor.call('cancel');
        console.log('sent cancel request to server');
    }
});

Template.rateCalculator.events({
    'click button#calc-rate': function (evt, tpl) {
        evt.preventDefault();
        var operations = $("input[id=calc-operations]").val();
        var timeunit = $("select[id=calc-time-unit]").val();
        console.log(operations, timeunit);
        $("input[name=operations]").val(Math.floor(operations/timeunit));
        $("input[name=interval]").val('1');

    }
})
