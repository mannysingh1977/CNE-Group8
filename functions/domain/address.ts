export class Address {
  constructor(
    private street: string,
    private number: string,
    private city: string,
    private zipCode: string,
    private country: string
  ) {}

  getStreet(): string {
    return this.street;
  }

  getNumber(): string {
    return this.number;
  }

  getCity(): string {
    return this.city;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  getCountry(): string {
    return this.country;
  }

  setStreet(street: string): void {
    this.street = street;
  }

  setNumber(number: string): void {
    this.number = number;
  }

  setCity(city: string): void {
    this.city = city;
  }

  setZipCode(zipCode: string): void {
    this.zipCode = zipCode;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  toObject(): AddressDTO {
    return {
      street: this.street,
      number: this.number,
      city: this.city,
      zipCode: this.zipCode,
      country: this.country,
    };
  }

  static fromObject(obj: AddressDTO): Address {
    return new Address(
      obj.street,
      obj.number,
      obj.city,
      obj.zipCode,
      obj.country
    );
  }
}

export interface AddressDTO {
  street: string;
  number: string;
  city: string;
  zipCode: string;
  country: string;
}
