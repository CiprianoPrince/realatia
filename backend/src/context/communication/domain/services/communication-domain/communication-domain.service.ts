import { Injectable } from '@nestjs/common';
import { UserId } from '@shared/domain/value-objects';
import { InquiryRepository } from '../../ports';

@Injectable()
export class CommunicationDomainService {
    async canUserSendInquiry(
        senderId: UserId,
        recipientId: UserId,
        inquiryRepository: InquiryRepository
    ): Promise<boolean> {
        // Check if user has sent too many inquiries today (rate limiting)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysInquiries = await inquiryRepository.findByRecipientId(recipientId);
        const userInquiriesToday = todaysInquiries.filter(
            (inquiry) =>
                inquiry.getRequesterInfo().getEmail() === senderId.getValue() && inquiry.getCreatedAt() >= today
        );

        // Limit: 5 inquiries per day to the same recipient
        return userInquiriesToday.length < 5;
    }
}
