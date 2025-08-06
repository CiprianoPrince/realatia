import { AggregateRoot } from '@shared/domain/aggregates';
import { UserId } from '@shared/domain/value-objects';
import { BillingHistory } from '../../entities';
import {
    PaymentFailed,
    PaymentProcessed,
    SubscriptionCancelled,
    SubscriptionCreated,
    SubscriptionDowngraded,
    SubscriptionRenewed,
    SubscriptionUpgraded,
} from '../../events';
import { EBillingCycle, ESubscriptionPlan, ESubscriptionStatus } from '../../types';
import { Amount, SubscriptionId } from '../../value-objects';

export class Subscription extends AggregateRoot<SubscriptionId> {
    private billingHistory: BillingHistory[] = [];

    private constructor(
        id: SubscriptionId,
        private readonly userId: UserId,
        private plan: ESubscriptionPlan,
        private billingCycle: EBillingCycle,
        private status: ESubscriptionStatus,
        private amount: Amount,
        private currentPeriodStart: Date,
        private currentPeriodEnd: Date,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date(),
        private cancelledAt?: Date,
        private trialEnd?: Date
    ) {
        super(id);
    }

    static create(
        userId: UserId,
        plan: ESubscriptionPlan,
        billingCycle: EBillingCycle,
        amount: Amount,
        trialDays?: number
    ): Subscription {
        const subscriptionId = SubscriptionId.generate();
        const now = new Date();
        const currentPeriodEnd = new Date(now);

        // Calculate period end based on billing cycle
        if (billingCycle === EBillingCycle.MONTHLY) {
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        } else {
            currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        }

        let status = ESubscriptionStatus.ACTIVE;
        let trialEnd: Date | undefined;

        if (trialDays && trialDays > 0) {
            status = ESubscriptionStatus.TRIAL;
            trialEnd = new Date(now);
            trialEnd.setDate(trialEnd.getDate() + trialDays);
        }

        const subscription = new Subscription(
            subscriptionId,
            userId,
            plan,
            billingCycle,
            status,
            amount,
            now,
            currentPeriodEnd,
            now,
            now,
            undefined,
            trialEnd
        );

        const subscriptionCreatedEvent: SubscriptionCreated = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'SubscriptionCreated',
            occurredOn: new Date(),
            userId: userId.getValue(),
            subscriptionId: subscriptionId.getValue(),
            plan,
            billingCycle,
        };

        subscription.addDomainEvent(subscriptionCreatedEvent);

        return subscription;
    }

    upgradePlan(newPlan: ESubscriptionPlan, newAmount: Amount): void {
        if (this.status !== ESubscriptionStatus.ACTIVE && this.status !== ESubscriptionStatus.TRIAL) {
            throw new Error('Cannot upgrade inactive subscription');
        }

        const oldPlan = this.plan;
        this.plan = newPlan;
        this.amount = newAmount;
        this.updatedAt = new Date();

        const subscriptionUpgradedEvent: SubscriptionUpgraded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'SubscriptionUpgraded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            oldPlan,
            newPlan,
        };

        this.addDomainEvent(subscriptionUpgradedEvent);
    }

    downgradePlan(newPlan: ESubscriptionPlan, newAmount: Amount): void {
        if (this.status !== ESubscriptionStatus.ACTIVE && this.status !== ESubscriptionStatus.TRIAL) {
            throw new Error('Cannot downgrade inactive subscription');
        }

        const oldPlan = this.plan;
        this.plan = newPlan;
        this.amount = newAmount;
        this.updatedAt = new Date();

        const subscriptionDowngradedEvent: SubscriptionDowngraded = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'SubscriptionDowngraded',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            oldPlan,
            newPlan,
        };

        this.addDomainEvent(subscriptionDowngradedEvent);
    }

    cancel(reason?: string): void {
        if (this.status === ESubscriptionStatus.CANCELLED) {
            throw new Error('Subscription is already cancelled');
        }

        this.status = ESubscriptionStatus.CANCELLED;
        this.cancelledAt = new Date();
        this.updatedAt = new Date();

        const subscriptionCancelledEvent: SubscriptionCancelled = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'SubscriptionCancelled',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            cancelledAt: this.cancelledAt,
            reason,
        };

        this.addDomainEvent(subscriptionCancelledEvent);
    }

    processPayment(paymentMethodId: string): BillingHistory {
        if (this.status !== ESubscriptionStatus.ACTIVE && this.status !== ESubscriptionStatus.PAST_DUE) {
            throw new Error('Cannot process payment for inactive subscription');
        }

        const billing = BillingHistory.create(this.getId(), this.amount, new Date(), paymentMethodId);

        this.billingHistory.push(billing);

        return billing;
    }

    markPaymentAsCompleted(billingId: string, invoiceUrl: string): void {
        const billing = this.billingHistory.find((b) => b.getId() === billingId);
        if (!billing) {
            throw new Error('Billing record not found');
        }

        billing.markAsCompleted(invoiceUrl);

        // Update subscription status and renew period
        if (this.status === ESubscriptionStatus.PAST_DUE) {
            this.status = ESubscriptionStatus.ACTIVE;
        }

        this.renewPeriod();
        this.updatedAt = new Date();

        const paymentProcessedEvent: PaymentProcessed = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentProcessed',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            billingHistoryId: billingId,
            amount: billing.getAmount().getValue(),
            currency: billing.getAmount().getCurrency(),
        };

        this.addDomainEvent(paymentProcessedEvent);
    }

    markPaymentAsFailed(billingId: string, failureReason: string): void {
        const billing = this.billingHistory.find((b) => b.getId() === billingId);
        if (!billing) {
            throw new Error('Billing record not found');
        }

        billing.markAsFailed(failureReason);
        this.status = ESubscriptionStatus.PAST_DUE;
        this.updatedAt = new Date();

        const paymentFailedEvent: PaymentFailed = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'PaymentFailed',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            billingHistoryId: billingId,
            amount: billing.getAmount().getValue(),
            currency: billing.getAmount().getCurrency(),
            failureReason,
        };

        this.addDomainEvent(paymentFailedEvent);
    }

    private renewPeriod(): void {
        const newPeriodStart = this.currentPeriodEnd;
        const newPeriodEnd = new Date(newPeriodStart);

        if (this.billingCycle === EBillingCycle.MONTHLY) {
            newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        } else {
            newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
        }

        this.currentPeriodStart = newPeriodStart;
        this.currentPeriodEnd = newPeriodEnd;

        const subscriptionRenewedEvent: SubscriptionRenewed = {
            eventId: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            eventType: 'SubscriptionRenewed',
            occurredOn: new Date(),
            userId: this.userId.getValue(),
            subscriptionId: this.getId().getValue(),
            newExpiryDate: newPeriodEnd,
        };

        this.addDomainEvent(subscriptionRenewedEvent);
    }

    isActive(): boolean {
        return this.status === ESubscriptionStatus.ACTIVE || this.status === ESubscriptionStatus.TRIAL;
    }

    isInTrial(): boolean {
        return this.status === ESubscriptionStatus.TRIAL && this.trialEnd && this.trialEnd > new Date();
    }

    isPastDue(): boolean {
        return this.status === ESubscriptionStatus.PAST_DUE;
    }

    daysUntilExpiry(): number {
        const now = new Date();
        const expiry = this.isInTrial() ? this.trialEnd! : this.currentPeriodEnd;
        const diffTime = expiry.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Getters
    getUserId(): UserId {
        return this.userId;
    }
    getPlan(): ESubscriptionPlan {
        return this.plan;
    }
    getBillingCycle(): EBillingCycle {
        return this.billingCycle;
    }
    getStatus(): ESubscriptionStatus {
        return this.status;
    }
    getAmount(): Amount {
        return this.amount;
    }
    getCurrentPeriodStart(): Date {
        return this.currentPeriodStart;
    }
    getCurrentPeriodEnd(): Date {
        return this.currentPeriodEnd;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
    getCancelledAt(): Date | undefined {
        return this.cancelledAt;
    }
    getTrialEnd(): Date | undefined {
        return this.trialEnd;
    }
    getBillingHistory(): BillingHistory[] {
        return [...this.billingHistory];
    }
}
