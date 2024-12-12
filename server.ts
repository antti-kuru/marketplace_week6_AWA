import express, {Express, Router} from "express"
import router from "./src/routes/app"
import path from "path"
import mongoose, {Connection} from "mongoose"
import morgan from "morgan"



const app: Express = express()
const port: number = 3000


const mongoDB : string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "Error connecting MongoDB"))



app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "../public")))

app.use("/", router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})



