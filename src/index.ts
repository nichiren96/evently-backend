import express, { Request, Response } from "express"
import cors from "cors"
import { routes } from "./routes"
import { createConnection } from "typeorm"

createConnection().then(connextion => {

    const app = express()

    app.use(express.json())
    app.use(cors({
        origin: ["http:localhost:3000"]
    }))

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello World")
    })

    routes(app)

    app.listen(8000, () => {
        console.log("Listening on port 8000")
    })
})
