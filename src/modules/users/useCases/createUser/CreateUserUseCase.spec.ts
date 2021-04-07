import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError'
import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase
let usersRepository: InMemoryUsersRepository

describe('CreateUser useCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User test', email: 'user@test.com', password: '123'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with an existing email', async () => {
    await createUserUseCase.execute({
      name: 'User test', email: 'user@test.com', password: '123'
    })

    await expect(
      createUserUseCase.execute({
        name: 'User test', email: 'user@test.com', password: '123'
      })
    ).rejects.toBeInstanceOf(CreateUserError)
  })
})
