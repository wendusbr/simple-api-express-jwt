import { randomUUID } from 'node:crypto'

export class DatabaseMemory {
    static users = new Map() // {name, email, password}

    static list(email) {
        return Array.from(this.users.entries()).map((user) => {
            const id = user[0]
            const data = user[1]

            return {
                id,
                ...data
            }
        })
        .filter((user) => {
            if(email)
                return user.email === email

            return true
        })
    }

    static create(user) {
        const id = randomUUID()

        this.users.set(id, user)

        return {
            id,
            ...user
        }
    }
}