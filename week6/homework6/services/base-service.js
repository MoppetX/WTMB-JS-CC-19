module.exports = class Service {
  constructor(model) {
    this.model = model;
  }

  update(query, update) {
    return this.model.updateOne(query, update);
  }

  findAll() {
    return this.model.find();
  }

  add(item) {
    return this.model.create(item);
  }

  deleteById(id) {
    return this.model.deleteOne({ _id: id });
  }

  delete(query) {
    return this.model.deleteMany(query);
  }

  findById(id) {
    return this.model.findById(id);
  }

  find(query) {
    return this.model.find(query);
  }

  // async saveAll() {
  //   return this.model.findA();
  // }
};

// mongoose query options
//
// Model.deleteMany()
// Model.deleteOne()
// Model.find()
// Model.findById()
// Model.findByIdAndDelete()
// Model.findByIdAndRemove()
// Model.findByIdAndUpdate()
// Model.findOne()
// Model.findOneAndDelete()
// Model.findOneAndRemove()
// Model.findOneAndReplace()
// Model.findOneAndUpdate()
// Model.replaceOne()
// Model.updateMany()
// Model.updateOne()
