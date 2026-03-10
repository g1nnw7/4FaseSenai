import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
})