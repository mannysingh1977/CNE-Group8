import { Address } from '../../model/address';

const VALID_STREET = 'Bondgenotenlaan';
const VALID_CITY = 'Leuven';
const VALID_HOUSENUMBER = '1';
const VALID_STATE = 'Leuven';
const VALID_POSTALCODE = '3000';
const VALID_COUNTRY = 'Belgium';

test('given: valid address info, when: creating address, then: address is created', () => {
    const address = new Address({
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    });

    expect(address.getStreet()).toEqual(VALID_STREET);
    expect(address.getCity()).toEqual(VALID_CITY);
    expect(address.getState()).toEqual(VALID_STATE);
    expect(address.getPostalCode()).toEqual(VALID_POSTALCODE);
    expect(address.getCountry()).toEqual(VALID_COUNTRY);
});

test('given: no street, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: '',
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    };

    expect(() => new Address(addressData)).toThrow('Street is required');
});

test('given: no house number, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: VALID_STREET,
        houseNumber: '',
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    };

    expect(() => new Address(addressData)).toThrow('House number is required');
});

test('given: no city, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: '',
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    };

    expect(() => new Address(addressData)).toThrow('City is required');
});

test('given: no state, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: '',
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    };

    expect(() => new Address(addressData)).toThrow('State is required');
});

test('given: no country, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: '',
    };

    expect(() => new Address(addressData)).toThrow('Country is required');
});

test('given: no postal code, when: creating address, then: error is thrown', () => {
    const addressData = {
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: '',
        country: VALID_COUNTRY,
    };

    expect(() => new Address(addressData)).toThrow('Postal code is required');
});

test('given: two identical addresses, when: asking if equal, then: true is returned', () => {
    const address1 = new Address({
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    });
    const address2 = new Address({
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    });

    expect(address1.equals(address2)).toBe(true);
});

test('given: two different addresses, when: asking if equal, then: false is returned', () => {
    const address1 = new Address({
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: VALID_COUNTRY,
    });
    const address2 = new Address({
        street: VALID_STREET,
        houseNumber: VALID_HOUSENUMBER,
        city: VALID_CITY,
        state: VALID_STATE,
        postalCode: VALID_POSTALCODE,
        country: 'Netherlands',
    });

    expect(address1.equals(address2)).toBe(false);
});


