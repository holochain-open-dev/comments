import { Context, createContext } from '@holochain-open-dev/context';
import { CommentsStore } from './comments-store';

export const commentsStoreContext: Context<CommentsStore> = createContext(
  'hc_zome_comments/store'
);
