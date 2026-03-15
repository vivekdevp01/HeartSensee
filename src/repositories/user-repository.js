const CrudRepository = require("./crud-repository");
const { User } = require("../models");
// const { where } = require('sequelize');
// const { Where } = require('sequelize/lib/utils');
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
  async getByEmail(email) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async get(id, options = {}) {
    // options can contain `include` and `attributes`
    return User.findByPk(id, options);
  }
  async listAll() {
    return User.findAll({ where: { role: "admin" } });
  }
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }
}
module.exports = UserRepository;
