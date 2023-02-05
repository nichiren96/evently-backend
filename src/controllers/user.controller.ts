import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import bcryptjs from "bcryptjs"

export const Users = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    const users = await repository.find()

    res.send(users.map(u => {
        const { password, ...data } = u

        return data
    }))
}


export const CreateUser = async (req: Request, res: Response) => {
    const { role_id, ...body } = req.body
    const hashedPassword = await bcryptjs.hash("1234", 10)

    const repository = getManager().getRepository(User)

    const { password, ...user } = await repository.save({
        ...body,
        password: hashedPassword
    })

    res.status(201).send(user)

}


export const GetUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    const { password, ...user } = await repository.findOneBy({ id: +req.params.id })

    res.send(user)
}


export const UpdateUser = async (req: Request, res: Response) => {

    const { role_id, ...body } = req.body

    const repository = getManager().getRepository(User)

    await repository.update(req.params.id, body)

    const { password, ...user } = await repository.findOneBy({ id: +req.params.id })

    res.status(202).send(user)
}

export const DeleteUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    await repository.delete({ id: +req.params.id })

    res.status(204).send(null)
}