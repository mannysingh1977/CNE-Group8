export class Address {
    private id?: string;
    private street: string;
    private houseNumber: string;
    private city: string;
    private state: string;
    private postalCode: string;
    private country: string;

    constructor(address: {
      street: string;
      houseNumber: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      id?: string;
    }) {
      this.validate(address);
      this.id = address.id;
      this.street = address.street;
      this.houseNumber = address.houseNumber;
      this.city = address.city;
      this.state = address.state;
      this.postalCode = address.postalCode;
      this.country = address.country;
    }

    validate(address: {
      street: string;
      houseNumber: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      id?: string;
    }) {
      if (!address.street) {
        throw new Error('Street is required');
      }
      if (!address.houseNumber) {
        throw new Error('House number is required');
      }
      if (!address.city) {
        throw new Error('City is required');
      }
      if (!address.state) {
        throw new Error('State is required');
      }
      if (!address.postalCode) {
        throw new Error('Postal code is required');
      }
      if (!address.country) {
        throw new Error('Country is required');
      }
    }

    public getId(): string | undefined {
      return this.id;
    }

    public getStreet(): string {
      return this.street;
    }

    public getHouseNumber(): string {
      return this.houseNumber;
    }

    public getCity(): string {
      return this.city;
    }

    public getState(): string {
      return this.state;
    }

    public getPostalCode(): string {
      return this.postalCode;
    }

    public getCountry(): string {
      return this.country;
    }

    public equals(address: Address): boolean {
      return (this.getStreet() == address.getStreet()
        && this.getHouseNumber() == address.getHouseNumber()
        && this.getPostalCode() == address.getPostalCode()
        && this.getState() == address.getState()
        && this.getCity() == address.getCity()
        && this.getCountry() == address.getCountry() )
    }

    toObject(): object {
      return {
        id: this.id,
        street: this.street,
        houseNumber: this.houseNumber,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country,
      };
    }

    static fromObject(address: {
      street: string;
      houseNumber: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      id?: string;
    }): Address {
      return new Address(address);
    }
  }
