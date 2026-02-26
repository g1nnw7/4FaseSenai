import axios from "axios";

export const api = axios.create({  // criação de uma instância do axios
    baseURL: "http://localhost:3001",  //porta do backend
}); 