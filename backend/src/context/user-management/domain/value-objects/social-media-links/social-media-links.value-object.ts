import { ValueObject } from '@shared/domain/value-objects';

export class SocialMediaLinks extends ValueObject {
    constructor(private readonly links: Map<string, string> = new Map()) {
        super();
        for (const [platform, url] of links) {
            if (!this.isValidUrl(url)) {
                throw new Error(`Invalid URL for ${platform}: ${url}`);
            }
        }
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    getLink(platform: string): string | undefined {
        return this.links.get(platform);
    }

    getAllLinks(): Map<string, string> {
        return new Map(this.links);
    }

    addLink(platform: string, url: string): SocialMediaLinks {
        const newLinks = new Map(this.links);
        newLinks.set(platform, url);
        return new SocialMediaLinks(newLinks);
    }

    removeLink(platform: string): SocialMediaLinks {
        const newLinks = new Map(this.links);
        newLinks.delete(platform);
        return new SocialMediaLinks(newLinks);
    }

    equals(other: ValueObject): boolean {
        if (!(other instanceof SocialMediaLinks)) return false;

        if (this.links.size !== other.links.size) return false;

        for (const [key, value] of this.links) {
            if (other.links.get(key) !== value) return false;
        }

        return true;
    }

    toString(): string {
        return Array.from(this.links.entries())
            .map(([platform, url]) => `${platform}: ${url}`)
            .join(', ');
    }
}
