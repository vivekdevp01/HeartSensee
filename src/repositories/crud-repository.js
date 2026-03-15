const NotFound = require("../errors/notfound");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async destroy(data) {
    try {
      const response = await this.model.destroy({
        where: {
          id: data,
        },
      });
      if (!response) {
        throw new NOT_FOUND("Couldn't find", data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  async get(id) {
    try {
      const response = await this.model.findByPk(id);
      if (!response) {
        throw new NotFound("Couldn't find", id);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getAll() {
    try {
      const response = await this.model.findAll();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async update(id, data) {
    try {
      const existingresponse = await this.model.findByPk(id);
      if (!existingresponse) {
        throw new NotFound("Couldn't find", id);
      }
      const response = await this.model.update(data, {
        where: {
          id: id,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = CrudRepository;
