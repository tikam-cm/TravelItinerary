import * as express from 'express';
import 'dotenv/config'

const PORT = process.env.PORT; //change it later to a getter method
const app = express();

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`)
})