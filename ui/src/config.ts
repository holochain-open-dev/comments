export interface CommentsConfig {
  zomeName: string;
  avatarMode: 'identicon' | 'avatar';
  additionalFields: string[];
  minNicknameLength: number;
}

export const defaultConfig: CommentsConfig = {
  zomeName: 'comments',
  avatarMode: 'avatar',
  additionalFields: [],
  minNicknameLength: 3,
};
