import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { CreateCommentInput, Comment } from './types';

export class CommentsService {
  constructor(public cellClient: CellClient, public zomeName = 'comments') {}

  /**
   * Create a comment about an entry
   */
  async createComment(
    input: CreateCommentInput
  ): Promise<[EntryHashB64, Comment]> {
    return this.callZome('create_comment', input);
  }

  /**
   * Get the comments for the given entry
   *
   * @param entryHash the entry to get the comment for the given entry
   * @returns all the comments for the given entry
   */
  async getCommentsForEntry(
    entryHash: EntryHashB64
  ): Promise<Record<EntryHashB64, Comment>> {
    return this.callZome('get_comments_for_entry', entryHash);
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
