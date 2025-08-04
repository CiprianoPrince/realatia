import { Address, PhoneNumber, ValueObject } from '@shared/domain/value-objects';

export class ContactInformation extends ValueObject {
    constructor(
        private readonly primaryPhone: PhoneNumber,
        private readonly secondaryPhone?: PhoneNumber,
        private readonly businessAddress?: Address
    ) {
        super();
    }

    getPrimaryPhone(): PhoneNumber {
        return this.primaryPhone;
    }
    getSecondaryPhone(): PhoneNumber | undefined {
        return this.secondaryPhone;
    }
    getBusinessAddress(): Address | undefined {
        return this.businessAddress;
    }

    withSecondaryPhone(phone: PhoneNumber): ContactInformation {
        return new ContactInformation(this.primaryPhone, phone, this.businessAddress);
    }

    withBusinessAddress(address: Address): ContactInformation {
        return new ContactInformation(this.primaryPhone, this.secondaryPhone, address);
    }

    equals(other: ValueObject): boolean {
        return other instanceof ContactInformation && this.primaryPhone.equals(other.primaryPhone);
    }

    toString(): string {
        return this.primaryPhone.toString();
    }
}
