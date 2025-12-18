import axios from "axios";

export const api = axios.create({
    //baseURL: 'http://192.168.1.111:3001/api', //raspberry
    baseURL: 'http://192.168.1.116:3001/api', //local
    timeout: 10000,
});