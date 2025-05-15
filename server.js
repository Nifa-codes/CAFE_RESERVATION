require("dotenv").config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.on("error", (error) => {
  console.error(error);
});
server.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
