const db = require("../../data/dbConfig");

const get = () => {
  return db("users");
};

const create = async (user) => {
  const [id] = await db("users").insert(user);
  return db("users").where({ id }).first();
};

const remove = async (id) => {
  const deletedUser = await db("users").where({ id }).first();
  await db("users").delete().where({ id });
  return deletedUser;
};

module.exports = {
  create,
  get,
  remove,
};
