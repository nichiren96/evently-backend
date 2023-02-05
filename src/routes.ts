import { Router } from "express"
import { Login, Register } from "./controllers/auth.controller"

export const routes = (router: Router) => {
    router.post("/api/register", Register)
    router.post("/api/login", Login)
}