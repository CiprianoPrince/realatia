import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import { PaymentMethodAdded, PaymentMethodSetAsDefault, PaymentMethodUpdated } from '../../events';
import { EPaymentMethodType } from '../../types';
import { BillingAddress, CardDetails, PayPalAccount } from '../../value-objects';

export class PaymentMethod extends AggregateRoot<string> {
    private constructor(
        id: string,
        private readonly userId: UserId,
        private readonly type: EPaymentMethodType,
        private cardDetails?: CardDetails,
        private paypalAccount?: PayPalAccount,
        private billingAddress?: BillingAddress,
        private isDefault: boolean = false,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) {
        super(id);
    }

    static createCreditCard(userId: UserId, cardDetails: CardDetails, billingAddress?: BillingAddress): PaymentMethod {
        const id = `pm_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        const paymentMethod = new PaymentMethod(
            id,
            userId,
            EPaymentMethodType.CREDIT_CARD,
            cardDetails,
            undefined,
            billingAddress
        );

        const paymentMethodAddedEvent: PaymentMethodAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentMethodAdded',
            occurredOn: new Date(),
            userId: userId.getValue(),
            paymentMethodId: id,
            paymentMethodType: EPaymentMethodType.CREDIT_CARD,
        };

        paymentMethod.addDomainEvent(paymentMethodAddedEvent);

        return paymentMethod;
    }

    static createPayPal(userId: UserId, paypalAccount: PayPalAccount, billingAddress?: BillingAddress): PaymentMethod {
        const id = `pm_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        const paymentMethod = new PaymentMethod(
            id,
            userId,
            EPaymentMethodType.PAYPAL,
            undefined,
            paypalAccount,
            billingAddress
        );

        const paymentMethodAddedEvent: PaymentMethodAdded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentMethodAdded',
            occurredOn: new Date(),
            userId: userId.getValue(),
            paymentMethodId: id,
            paymentMethodType: EPaymentMethodType.PAYPAL,
        };

        paymentMethod.addDomainEvent(paymentMethodAddedEvent);

        return paymentMethod;
    }

    updateCardDetails(cardDetails: CardDetails): void {
        if (this.type !== EPaymentMethodType.CREDIT_CARD && this.type !== EPaymentMethodType.DEBIT_CARD) {
            throw new Error('Cannot update card details for non-card payment method');
        }

        this.cardDetails = cardDetails;
        this.updatedAt = new Date();

        const paymentMethodUpdatedEvent: PaymentMethodUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentMethodUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            paymentMethodId: this.getId(),
            updatedFields: ['cardDetails'],
        };

        this.addDomainEvent(paymentMethodUpdatedEvent);
    }

    updateBillingAddress(billingAddress: BillingAddress): void {
        this.billingAddress = billingAddress;
        this.updatedAt = new Date();

        const paymentMethodUpdatedEvent: PaymentMethodUpdated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentMethodUpdated',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            paymentMethodId: this.getId(),
            updatedFields: ['billingAddress'],
        };

        this.addDomainEvent(paymentMethodUpdatedEvent);
    }

    setAsDefault(): void {
        this.isDefault = true;
        this.updatedAt = new Date();

        const paymentMethodSetAsDefaultEvent: PaymentMethodSetAsDefault = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentMethodSetAsDefault',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            paymentMethodId: this.getId(),
        };

        this.addDomainEvent(paymentMethodSetAsDefaultEvent);
    }

    unsetAsDefault(): void {
        this.isDefault = false;
        this.updatedAt = new Date();
    }

    isExpired(): boolean {
        if (this.cardDetails) {
            return this.cardDetails.isExpired();
        }
        return false;
    }

    getDisplayName(): string {
        if (this.cardDetails) {
            return this.cardDetails.toString();
        }
        if (this.paypalAccount) {
            return this.paypalAccount.toString();
        }
        return this.type;
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getType(): EPaymentMethodType {
        return this.type;
    }
    getCardDetails(): CardDetails | undefined {
        return this.cardDetails;
    }
    getPayPalAccount(): PayPalAccount | undefined {
        return this.paypalAccount;
    }
    getBillingAddress(): BillingAddress | undefined {
        return this.billingAddress;
    }
    getIsDefault(): boolean {
        return this.isDefault;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
