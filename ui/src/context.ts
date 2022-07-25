import { createContext } from '@lit-labs/context';
import { CommentsStore } from './comments-store';

export const commentsStoreContext = createContext<CommentsStore>(
  'hc_zome_comments/store'
);
