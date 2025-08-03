export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum VerificationStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}
