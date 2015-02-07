console.log("loaded schemas.js");
MongoTesterSchema = new SimpleSchema({
    mongoUrl: {
        type: String,
        label: "Mongo URL",
        max: 200
    },
    collectionName: {
        type: String,
        label: "Collection Name"
    },
    rate: {
        type: Number,
        label: "Max Ops per interval"
    },
    interval: {
        type: Number,
        label: "Interval in ms"
    }
});
