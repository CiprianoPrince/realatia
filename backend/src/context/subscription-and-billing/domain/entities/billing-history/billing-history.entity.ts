import { Entity } from '@shared/domain/entities';
import { EPaymentStatus } from '../../types';
import { Amount, SubscriptionId } from '../../value-objects';

export class BillingHistory extends Entity<string> {
    constructor(
        id: string,
        private readonly subscriptionId: SubscriptionId,
        private readonly amount: Amount,
        private readonly billingDate: Date,
        private readonly paymentStatus: EPaymentStatus,
        private readonly paymentMethodId: string,
        private readonly invoiceUrl?: string,
        private readonly failureReason?: string
    ) {
        super(id);
    }

    static create(
        subscriptionId: SubscriptionId,
        amount: Amount,
        billingDate: Date,
        paymentMethodId: string
    ): BillingHistory {
        const id = `billing_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        return new BillingHistory(id, subscriptionId, amount, billingDate, EPaymentStatus.PENDING, paymentMethodId);
    }

    markAsCompleted(invoiceUrl: string): void {
        if (this.paymentStatus !== EPaymentStatus.PENDING) {
            throw new Error('Can only complete pending payments');
        }
        Object.assign(this, { paymentStatus: EPaymentStatus.COMPLETED, invoiceUrl });
    }

    markAsFailed(failureReason: string): void {
        if (this.paymentStatus !== EPaymentStatus.PENDING) {
            throw new Error('Can only fail pending payments');
        }
        Object.assign(this, { paymentStatus: EPaymentStatus.FAILED, failureReason });
    }

    getSubscriptionId(): SubscriptionId {
        return this.subscriptionId;
    }
    getAmount(): Amount {
        return this.amount;
    }
    getBillingDate(): Date {
        return this.billingDate;
    }
    getPaymentStatus(): EPaymentStatus {
        return this.paymentStatus;
    }
    getPaymentMethodId(): string {
        return this.paymentMethodId;
    }
    getInvoiceUrl(): string | undefined {
        return this.invoiceUrl;
    }
    getFailureReason(): string | undefined {
        return this.failureReason;
    }

    isSuccessful(): boolean {
        return this.paymentStatus === EPaymentStatus.COMPLETED;
    }
}
