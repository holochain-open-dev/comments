import { AgentPubKeyB64, EntryHashB64 } from '@holochain-open-dev/core-types';

export interface Comment {
  commentAbout: EntryHashB64;
  content: string;
  createdAt: number;
  author: AgentPubKeyB64;
}

export interface CreateCommentInput {
  commentAbout: EntryHashB64;
  content: string;
}
