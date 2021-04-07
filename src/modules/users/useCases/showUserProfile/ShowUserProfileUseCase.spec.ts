import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepository: InMemoryUsersRepository

describe('AuthenticateUser useCase', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it('should be able to show an user profile', async () => {
    const passwordHash = await hash('1234567', 8);

    const user = await usersRepository.create({
      name: 'User profile test',
      email: 'user@email.com',
      password: passwordHash,
    })

    const profile = await showUserProfileUseCase.execute(user.id!)

    expect(profile).toHaveProperty('id')
  })

  it('should not be able to show profile from a non-existing user', async () => {
    expect(async () => {
      showUserProfileUseCase.execute('unexisting-user')
    }).rejects.toBeInstanceOf(Error)
  })

})
