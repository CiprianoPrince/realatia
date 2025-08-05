export enum EInquiryCategory {
    BUSINESS_INQUIRY = 'BUSINESS_INQUIRY',
    PROPERTY_QUESTION = 'PROPERTY_QUESTION',
    URGENT = 'URGENT',
    GENERAL = 'GENERAL',
    PARTNERSHIP = 'PARTNERSHIP',
    SERVICE_REQUEST = 'SERVICE_REQUEST',
}

export enum EInquiryStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    SPAM = 'SPAM',
}

export enum EInquiryPriority {
    LOW = 'LOW',
    NORMAL = 'NORMAL',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum EMessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    DOCUMENT = 'DOCUMENT',
    VOICE = 'VOICE',
}

export enum EConversationType {
    DIRECT = 'DIRECT',
    GROUP = 'GROUP',
    BUSINESS_INQUIRY = 'BUSINESS_INQUIRY',
}

export enum EConversationStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
    BLOCKED = 'BLOCKED',
}
