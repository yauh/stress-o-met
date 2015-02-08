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
    operations: {
        type: Number,
        label: "# of Operations (per interval)"
    },
    interval: {
        type: Number,
        label: "Interval in s"
    },
    duration: {
        type: Number,
        label: "Duration in minutes"
    }
});
