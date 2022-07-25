import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHash } from '@holochain/client';
import {
  AgentPubKeyB64,
  EntryHashB64,
  serializeHash,
} from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { CommentsService } from './comments-service';
import { Comment } from './types';
import { writable, Writable, derived, Readable } from 'svelte/store';
import { defaultConfig, CommentsConfig } from './config';

export interface CommentsState {
  // entry hash of the comment_about entry -> Comment
  commentsByEntryHash: Record<EntryHashB64, Record<EntryHashB64, Comment>>;
}

// {
//  commentsByEntryHash: {
//    'ABOUT_HASH': {
//      "COMMENT1_HASH": {
//        createdAt: 9084209384,
//        content: ...
//      },
//      "COMMENT2_HASH": {
//        createdAt: 9084209384,
//        content: ...
//      }
//    }
//  }
// }

export class CommentsStore {
  /** Private */
  private _service: CommentsService;
  private _comments: Writable<CommentsState> = writable({
    commentsByEntryHash: {},
  });

  /** Static info */
  public myAgentPubKey: AgentPubKeyB64;

  /** Readable stores */

  // Returns a store with the comment of the given agent
  commentsFor(
    entryHash: EntryHashB64
  ): Readable<Record<EntryHashB64, Comment>> {
    return derived(
      this._comments,
      comments => comments.commentsByEntryHash[entryHash]
    );
  }

  config: CommentsConfig;

  constructor(
    protected cellClient: CellClient,
    config: Partial<CommentsConfig> = {}
  ) {
    this.config = merge(defaultConfig, config);
    this._service = new CommentsService(cellClient, this.config.zomeName);
    this.myAgentPubKey = serializeHash(cellClient.cell.cell_id[1]);
  }

  /** Actions */

  /**
   * Fetches the comments for the given entry in the DHT
   */
  async fetchCommentsForEntry(entryHash: EntryHashB64): Promise<void> {
    const allComments = await this._service.getCommentsForEntry(entryHash);

    this._comments.update(comments => {
      comments.commentsByEntryHash[entryHash] = allComments;

      return comments;
    });
  }

  /**
   * Create comment
   *
   * Note that there is no guarantee on nickname uniqness
   *
   * @param comment comment to be created
   */
  async createComment(content: string, about: EntryHashB64): Promise<void> {
    const [commentHash, comment] = await this._service.createComment({
      content,
      commentAbout: about,
    });

    this._comments.update(comments => {
      if (!comments.commentsByEntryHash[about])
        comments.commentsByEntryHash[about] = {};
      comments.commentsByEntryHash[about][commentHash] = comment;
      return comments;
    });
  }
}
