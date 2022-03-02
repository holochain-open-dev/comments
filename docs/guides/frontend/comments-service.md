# Frontend Docs >> CommentsService ||30

The `CommentsService` is a state-less class that provides typings wrapping the zome calls that can be made to `hc_zome_comments`.

```js
import { CommentsService } from '@holochain-open-dev/comments';

const service = new CommentsService(cellClient);

service.getMyComment().then(myComment => console.log(myComment));
```

Learn more about the services [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#services). 