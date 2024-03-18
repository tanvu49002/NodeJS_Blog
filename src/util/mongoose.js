const multipleMongooseToObject = (mongooses) =>
    mongooses.map((mongoose) => mongoose.toObject());
const mongooseToObject = (mongoose) =>
    mongoose ? mongoose.toObject() : mongoose;
module.exports = {
    multipleMongooseToObject,
    mongooseToObject,
};
