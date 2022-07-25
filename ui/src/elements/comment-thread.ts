import { html, LitElement } from 'lit';
import { query, property, state } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { EntryHashB64 } from '@holochain-open-dev/core-types';
import {
  Button,
  CircularProgress,
  TextField,
} from '@scoped-elements/material-web';
import { AgentAvatar } from '@holochain-open-dev/profiles';

import { sharedStyles } from './utils/shared-styles';
import { CommentsStore } from '../comments-store';
import { commentsStoreContext } from '../context';
import { Comment } from '../types';
import { StoreSubscriber } from 'lit-svelte-stores';

/**
 * @element update-comment
 * @fires comment-updated - Fired after the comment has been created. Detail will have this shape: { comment: { nickname, fields } }
 */
export class CommentThread extends ScopedElementsMixin(LitElement) {
  @property({ type: String, attribute: 'entry-hash' })
  entryHash!: EntryHashB64;

  /** Dependencies */

  /**
   * `CommentsStore` that is requested via context.
   * Only set this property if you want to override the store requested via context.
   */
  @contextProvided({ context: commentsStoreContext })
  @property({ type: Object })
  store!: CommentsStore;

  /** Private properties */

  @query('#new-comment-field')
  _newCommentField!: TextField;

  @state()
  private _loading = true;

  private _commentsForEntry = new StoreSubscriber(this, () =>
    this.store?.commentsFor(this.entryHash)
  );

  async firstUpdated() {
    await this.store.fetchCommentsForEntry(this.entryHash);
    this._loading = false;
  }

  async createComment() {
    const content = this._newCommentField.value;
    await this.store.createComment(content, this.entryHash);
  }

  renderComment(commentEntryHash: EntryHashB64, comment: Comment) {
    return html`
      <div class="column">
        <div class="row">
          <agent-avatar .agentPubKey=${comment.author}></agent-avatar>

          <span>${comment.content}</span>
        </div>

        <comment-thread
          style="margin-left: 16px"
          .entryHash=${commentEntryHash}
        ></comment-thread>
      </div>
    `;
  }

  render() {
    if (this._loading)
      return html`<div
        class="column"
        style="align-items: center; justify-content: center; flex: 1;"
      >
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;

    return html`
      <div class="column">
        ${Object.entries(this._commentsForEntry.value).map(
          ([commentHash, comment]) => this.renderComment(commentHash, comment)
        )}

        <mwc-textfield
          id="new-comment-field"
          label="New Comment"
          outlined
        ></mwc-textfield>
        <mwc-button
          label="Create comment"
          @click=${() => this.createComment()}
        ></mwc-button>
      </div>
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'mwc-textfield': TextField,
      'mwc-circular-progress': CircularProgress,
      'agent-avatar': AgentAvatar,
      'mwc-button': Button,
      'comment-thread': CommentThread,
    };
  }
  static get styles() {
    return [sharedStyles];
  }
}
