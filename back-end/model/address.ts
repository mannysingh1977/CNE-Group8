import {Address as AddressPrisma} from '@prisma/client'

export class Address {
    private id: number | undefined;
    private street: string;
    private houseNumber: string;
    private city: string;
    private state: string;
    private postalCode: string;
    private country: string;

    constructor(address: { street: string, city: string, state: string, houseNumber: string, postalCode: string, country: string, id?: number | undefined }) {
        this.validate(address);
        this.id = address.id;
        this.street = address.street;
        this.houseNumber = address.houseNumber;
        this.city = address.city;
        this.state = address.state;
        this.postalCode = address.postalCode;
        this.country = address.country;
    };

    validate(address: { street: string, city: string, state: string, houseNumber: string, postalCode: string, country: string, id?: number | undefined }) {
        if (!address.street) {
            throw new Error('Street is required')
        }
        if (!address.houseNumber) {
            throw new Error('House number is required')
        }
        if (!address.city) {
            throw new Error('City is required')
        }
        if (!address.state) {
            throw new Error('State is required')
        }
        if (!address.postalCode) {
            throw new Error('Postal code is required')
        }
        if (!address.country) {
            throw new Error('Country is required')
        }
    }

    public getId(): number | undefined {
        return this.id;
    };

    public getStreet(): string {
        return this.street;
    }

    public getHouseNumber(): string {
        return this.houseNumber
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
        return (
            this.street == address.street &&
            this.houseNumber == address.houseNumber &&
            this.city == address.city &&
            this.state == address.state &&
            this.postalCode == address.postalCode &&
            this.country == address.country
        );
    }

    static from({
        street,
        houseNumber,
        city,
        state,
        postalCode,
        country
    }: AddressPrisma & { id?: number }) {
        return new Address({
            id: undefined,
            street,
            houseNumber,
            city,
            state,
            postalCode,
            country
        })
    }

    // public setId(id: number): void {
    //     this.id = id;
    // }

    // public setStreet(street: string): void {
    //     this.street = street;
    // }

    // public setCity(city: string): void {
    //     this.city = city;
    // }

    // public setState(state: string): void {
    //     this.state = state;
    // }

    // public setPostalCode(postalCode: string): void {
    //     this.postalCode = postalCode;
    // }

    // public setCountry(country: string): void {
    //     this.country = country;
    // }
}

/*
scheduleRouter.post('/', (req: Resuest, res:Response) =>{
    try{
        const Schedule = <ScheduleInput>req.body;
        const result = scheduleService.createSchedule(schedule);
        res.status(200).json(result);
    } catch (error: unknown){
        let msg= "unknown error";
        if(error instanceof Error){
            msg = error.message;
        }
    }
});


*/