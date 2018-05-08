/**
 * @license MIT
 */

import {
    BaseModel,
    IdentityModel,
    VotingModel,
} from '../models';

const md = require('ssb-markdown');

const emojiNamedCharacters = require('emoji-named-characters');

const twemoji = require('twemoji');

export class PostingModel extends BaseModel {
    public author: IdentityModel;
    public authorId: string;
    public date: Date;
    public votes: VotingModel[] = [];
    public comments: PostingModel[] = [];
    public content: string;
    public rootId?: string;
    public primaryChannel?: string;

    public constructor(init?: Partial<PostingModel>) {
        super();
        Object.assign(this, init);
    }

    public get latestActivity(): Date {
        let newest = this.date;

        for (const comment of this.comments) {
            if (comment.date > newest) {
                newest = comment.date;
            }
        }

        return newest;
    }

    public get html(): string {
        return md.block(this.content, {
            emoji: (emoji) => {
                if (emoji in emojiNamedCharacters) {
                    return twemoji.parse(emojiNamedCharacters[emoji].character, {
                        folder: 'emoji',
                        ext: '.svg',
                        base: '/assets/'
                    });
                } else {
                    return `:${emoji}:`;
                }
            },
            imageLink: (id) => {
                return `http://localhost:8989/blobs/get/${id}`;
            },
            toUrl: (id: string) => {
                if (id.startsWith('&')) {
                    return `http://localhost:8989/blobs/get/${id}`;
                } else {
                    return `ssb://${id}`;
                }
            }
        });
    }
}
