import { AgentPubKeyB64, EntryHashB64 } from '@holochain-open-dev/core-types';

export interface Comment {
  createdAt: number;
  author: AgentPubKeyB64;
  content: string;
  commentAbout: EntryHashB64;
}

export interface CreateCommentInput {
  content: string;
  commentAbout: EntryHashB64;
}
