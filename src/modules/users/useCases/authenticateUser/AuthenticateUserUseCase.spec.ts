import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('AuthenticateUser useCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate', async () => {
    const passwordHash = await hash('1234567', 8);

    await inMemoryUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: passwordHash,
    })

    const authInfo = await authenticateUserUseCase.execute({
      email: 'user@email.com',
      password: '1234567'
    })

    expect(authInfo).toHaveProperty('token')
  })

  it('should not be able to authenticate with a non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'non-existent@email.com',
        password: '123'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate with an incorrect password', async () => {
    const passwordHash = await hash('1234567', 8);

    await inMemoryUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: passwordHash,
    })

    await expect(
      authenticateUserUseCase.execute({
        email: 'user@email.com',
        password: 'incorrect-password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
