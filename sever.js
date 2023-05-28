require("dotenv").config();
const connectMongo = require("./src/services/mongo.services");
const app = require("./src/app");
const http = require("http").createServer(app);

const PORT = process.env.PORT || 8000;

const init = async () => {
  await connectMongo();
  http.listen(PORT, () => {
    console.log(`server listening on port ${PORT} ...`);
  });
};

init();
