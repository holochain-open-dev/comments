# Frontend Docs >> CommentsStore ||20

The `CommentsStore` is a JS class that contains `svelte` stores, to which you can subscribe to get reactive updates in your elements.

```js
import { CommentsStore } from "@holochain-open-dev/comments";

const config = {
  avatarMode: "identicon",
  additionalFields: ["Location", "Bio"], // Custom app level comment fields
};
const store = new CommentsStore(cellClient, config);
```

> Learn how to setup the `CellClient` object [here](https://www.npmjs.com/package/@holochain-open-dev/cell-client).

The config for the `CommentsStore` has these options:

```ts
export interface CommentsConfig {
  zomeName: string; // default: 'comments'
  avatarMode: "identicon" | "avatar"; // default: 'avatar'
  additionalFields: string[]; // default: []
  minNicknameLength: number; // default: 3
}
```

Learn more about the stores and how to integrate them in different frameworks [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#stores).
