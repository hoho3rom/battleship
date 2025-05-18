import { httpServer } from "./src/http_server/index.js";
import { startWsServer } from "./src/ws_server/index.js";

const HTTP_PORT = 8181;

startWsServer();

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);