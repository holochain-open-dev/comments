import { html, fixture, expect } from '@open-wc/testing';
import { setupApolloClientMock } from './mocks';
import { HodCreateCommentForm } from '../dist';
import { setupApolloClientElement } from '@holochain-open-dev/common';

describe('HodCreateCommentForm', () => {
  it('create comment has a placeholder', async () => {
    const client = await setupApolloClientMock();

    customElements.define(
      'hod-create-comment-form',
      setupApolloClientElement(HodCreateCommentForm, client)
    );

    const el = await fixture(
      html` <hod-create-comment-form></hod-create-comment-form> `
    );

    expect(el.shadowRoot.innerHTML).to.include('CREATE PROFILE');
  });
});
