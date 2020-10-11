import { createServer } from "./middleware/server";

const Port = 3000

createServer()
  .then((server: any) => {
    server.listen(process.env.PORT || Port, '127.0.0.1', () => {
      console.info(`Listening on http://localhost:${Port}`)
    })
  })
  .catch((err: Error) => {
    console.error(`Error: ${err}`)
  })
