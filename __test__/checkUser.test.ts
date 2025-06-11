import { checkUser } from '../lib/checkUser';
import { db } from '../lib/db';
import { currentUser } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
}));

jest.mock('../lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockedCurrentUser = currentUser as jest.Mock;
const mockedDbUserFindUnique = db.user.findUnique as jest.Mock;
const mockedDbUserCreate = db.user.create as jest.Mock;

describe('checkUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if there is no logged-in user', async () => {

    mockedCurrentUser.mockResolvedValue(null);

    const result = await checkUser();
    expect(result).toBeNull();
  });

  it('should return the user from the database if they already exist', async () => {
    const existingUser = {
      id: 'db_user_123',
      clerkUserId: 'clerk_user_123',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    mockedCurrentUser.mockResolvedValue({
      id: 'clerk_user_123',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'http://example.com/image.png',
      emailAddresses: [{ emailAddress: 'john.doe@example.com' }],
    });

    mockedDbUserFindUnique.mockResolvedValue(existingUser);

    const result = await checkUser();

    expect(result).toEqual(existingUser);
    expect(mockedDbUserFindUnique).toHaveBeenCalledWith({ where: { clerkUserId: 'clerk_user_123' } });
    expect(mockedDbUserCreate).not.toHaveBeenCalled();
  });

  it('should create a new user and return it if they do not exist in the database', async () => {
    const newUser = {
      clerkUserId: 'clerk_user_456',
      name: 'Jane Doe',
      imageUrl: 'http://example.com/jane.png',
      email: 'jane.doe@example.com',
    };

    mockedCurrentUser.mockResolvedValue({
      id: 'clerk_user_456',
      firstName: 'Jane',
      lastName: 'Doe',
      imageUrl: 'http://example.com/jane.png',
      emailAddresses: [{ emailAddress: 'jane.doe@example.com' }],
    });

    mockedDbUserFindUnique.mockResolvedValue(null);
    mockedDbUserCreate.mockResolvedValue(newUser);

    const result = await checkUser();

    expect(result).toEqual(newUser);
    expect(mockedDbUserFindUnique).toHaveBeenCalledWith({ where: { clerkUserId: 'clerk_user_456' } });
    expect(mockedDbUserCreate).toHaveBeenCalledWith({
      data: {
        clerkUserId: 'clerk_user_456',
        name: 'Jane Doe',
        imageUrl: 'http://example.com/jane.png',
        email: 'jane.doe@example.com',
      },
    });
  });
});
