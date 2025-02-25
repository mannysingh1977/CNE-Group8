// no testing for seller, newsLetter and role, because they are required and have a default value
// Address is tested in address.test.ts

import { Address } from '../../model/address';
import { User } from '../../model/user';

const address = new Address({
    street: 'Bondgenotenlaan',
    houseNumber: '10',
    city: 'Leuven',
    state: 'Leuven',
    postalCode: '3000',
    country: 'Belgium',
});

const user = new User({
    name: 'John Doe',
    phoneNumber: '0612345678',
    emailAddress: 'email@gmail.com',
    password: 'password',
    address: address,
    seller: false,
    newsLetter: true,
    role: 'User',
});

const VALID_NAME = "Jantje";
const VALID_PHONE_NUMBER = "0612345678";
const VALID_EMAIL_ADDRESS = "iets@tiets.be";
const VALID_PASSWORD = "password";
const VALID_ADDRESS = new Address({
    street: 'Bondgenotenlaan',
    houseNumber: '10',
    city: 'Leuven',
    state: 'Leuven',
    postalCode: '3000',
    country: 'Belgium',
});

test('given: valid user info, when: creating user, then: user is created', () => {
    expect(user.getName()).toEqual('John Doe');
    expect(user.getPhoneNumber()).toEqual('0612345678');
    expect(user.getEmailAddress()).toEqual('email@gmail.com');
    expect(user.getPassword()).toEqual('password');
    expect(user.getAddress()).toEqual(address);
    expect(user.getSeller()).toEqual(false);
    expect(user.getNewsLetter()).toEqual(true);
    expect(user.getRole()).toEqual('User');
});

test('given: two identical users, when: asking if equal, then: true is returned', () => {
    const user2 = new User({
        name: 'John Doe',
        phoneNumber: '0612345678',
        emailAddress: 'email@gmail.com',
        password: 'password',
        address: address,
        seller: false,
        newsLetter: true,
        role: 'User',
    });
    expect(user.equals(user2)).toBe(true);
});

test('given: two different users, when: asking if equal, then: false is returned', () => {
    const user2 = new User({
        name: 'Jane Doe',
        phoneNumber: '0612345678',
        emailAddress: 'fjqsdk@iets.be',
        password: 'password',
        address: address,
        seller: false,
        newsLetter: true,
        role: 'User'
    });
    expect(user.equals(user2)).toBe(false);
});
test('given: user with empty name, when: creating user, then: error is thrown', () => {
    expect(() => new User({
        name: '',
        phoneNumber: VALID_PHONE_NUMBER,
        emailAddress: VALID_EMAIL_ADDRESS,
        password: VALID_PASSWORD,
        address: VALID_ADDRESS,
        seller: false,
        newsLetter: true,
        role: 'User'
    })).toThrow('User name is required');
});

test('given: user with empty phone number, when: creating user, then: error is thrown', () => {
    expect(() => new User({
        name: VALID_NAME,
        phoneNumber: '',
        emailAddress: VALID_EMAIL_ADDRESS,
        password: VALID_PASSWORD,
        address: VALID_ADDRESS,
        seller: false,
        newsLetter: true,
        role: 'User'
    })).toThrow('User phone number is required');
});

test('given: user with empty email address, when: creating user, then: error is thrown', () => {
    expect(() => new User({
        name: VALID_NAME,
        phoneNumber: VALID_PHONE_NUMBER,
        emailAddress: '',
        password: VALID_PASSWORD,
        address: VALID_ADDRESS,
        seller: false,
        newsLetter: true,
        role: 'User'
    })).toThrow('User email address is required');
});

test('given: user with empty password, when: creating user, then: error is thrown', () => {
    expect(() => new User({
        name: VALID_NAME,
        phoneNumber: VALID_PHONE_NUMBER,
        emailAddress: VALID_EMAIL_ADDRESS,
        password: '',
        address: VALID_ADDRESS,
        seller: false,
        newsLetter: true,
        role: 'User'
    })).toThrow('User password is required');
});

