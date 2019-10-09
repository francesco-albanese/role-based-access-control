const mongoose = require('mongoose')
const { User } = require('.')

const userData = { email: 'test@email.com', password: '123456' }

describe('User model test', () => {

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('create & save user successfully', async () => {
    const validUser = new User(userData)
    const savedUser = await validUser.save()
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBeDefined();
    expect(savedUser.password).toBeDefined();
    expect(savedUser.role).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.role).toBe('basic');
  });

  it('should not insert undefined fields', async () => {
    const userWithInvalidField = new User({ email: 'bla@bla.com', password: 'bl', does: 'notexist' })
    const savedUser =  await userWithInvalidField.save()
    expect(savedUser.does).toBeUndefined();
    expect(savedUser.email).toBeDefined();
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).toBe(userWithInvalidField.password);
    expect(savedUser.email).toBe(userWithInvalidField.email);
  });

  it('should throw a validation error if a required field is missing', async () => {
    const userWithMissingField = new User({ email: 'test@ema.il' })
    try {
      await userWithMissingField.save()
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(e.errors.password).toBeDefined();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close()
  });
});
