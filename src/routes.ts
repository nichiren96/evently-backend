import { Router } from "express"
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller"
import { AuthMiddleware } from "./middlewares/auth.middleware"

export const routes = (router: Router) => {
    router.post("/api/register", Register)
    router.post("/api/login", Login)
    router.get("/api/user", AuthMiddleware, AuthenticatedUser)
    router.put("/api/users/info", AuthMiddleware, UpdateInfo)
    router.put("/api/users/password", AuthMiddleware, UpdatePassword)
    router.post("/api/logout", AuthMiddleware, Logout)
}