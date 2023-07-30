const dbConnection = {
  url: `mongodb://${process.env.host || "localhost"}:${
    process.env.dbPort || 27017
  }/${process.env.dbName || "bringy"}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
export default dbConnection;
