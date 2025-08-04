import { ValueObject } from '@shared/domain/value-objects';

export class State extends ValueObject {
    private static readonly VALID_STATES = [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
    ];

    constructor(private readonly code: string) {
        super();
        if (!State.VALID_STATES.includes(code.toUpperCase())) {
            throw new Error('Invalid state code');
        }
    }

    getCode(): string {
        return this.code.toUpperCase();
    }

    equals(other: ValueObject): boolean {
        return other instanceof State && this.code.toUpperCase() === other.code.toUpperCase();
    }

    toString(): string {
        return this.code.toUpperCase();
    }
}
