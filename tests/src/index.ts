import { Config, InstallAgentsHapps, Orchestrator } from "@holochain/tryorama";
import Base64 from "js-base64";
import path from "path";

const conductorConfig = Config.gen();

// Construct proper paths for your DNAs
const commentsDna = path.join(__dirname, "../../workdir/dna/comments-test.dna");

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [commentsDna],
  ],
  [
    // happ 0
    [commentsDna],
  ],
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

function serializeHash(hash) {
  return `u${Base64.fromUint8Array(hash, true)}`;
}

const zomeName = 'comments';

let orchestrator = new Orchestrator();

orchestrator.registerScenario("create a comment and get it", async (s, t) => {
  const [alice, bob] = await s.players([conductorConfig]);

  // install your happs into the coductors and destructuring the returned happ data using the same
  // array structure as you created in your installation array.
  const [[alice_comments], [bob_comments]] = await alice.installAgentsHapps(
    installation
  );


  let alicePubkeyB64 = serializeHash(alice_comments.agent);
  let bobPubKeyB64 = serializeHash(bob_comments.agent);

  let myComment = await alice_comments.cells[0].call(
    zomeName,
    "get_my_comment",
    null
  );
  t.notOk(myComment);

  let commentHash = await alice_comments.cells[0].call(
    zomeName,
    "create_comment",
    {
      nickname: "alice",
      fields: {
        avatar: "aliceavatar",
      },
    }
  );
  t.ok(commentHash);

  await sleep(500);

  // set nickname as alice to make sure bob's is not getting deleted
  // with alice's update
  commentHash = await bob_comments.cells[0].call(zomeName, "create_comment", {
    nickname: "alice_bob",
    fields: {
      avatar: "bobboavatar",
    },
  });
  t.ok(commentHash);

  await sleep(5000);

  commentHash = await alice_comments.cells[0].call(
    zomeName,
    "update_comment",
    {
      nickname: "alice2",
      fields: {
        avatar: "aliceavatar2",
        update: "somenewfield",
      },
    }
  );
  t.ok(commentHash);

  myComment = await alice_comments.cells[0].call(
    zomeName,
    "get_my_comment",
    null
  );
  t.ok(myComment.agentPubKey);
  t.equal(myComment.comment.nickname, "alice2");

  let allcomments = await bob_comments.cells[0].call(
    zomeName,
    "get_all_comments",
    null
  );
  t.equal(allcomments.length, 2);

  let multipleComments = await bob_comments.cells[0].call(
    zomeName,
    "get_agents_comment",
    [alicePubkeyB64, bobPubKeyB64]
  );
  t.equal(multipleComments.length, 2);

  let comments = await bob_comments.cells[0].call(
    zomeName,
    "search_comments",
    {
      nicknamePrefix: "sdf",
    }
  );
  t.equal(comments.length, 0);

  comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
    nicknamePrefix: "alic",
  });
  t.equal(comments.length, 2);
  t.ok(comments[0].agentPubKey);
  t.equal(comments[1].comment.nickname, "alice2");

  comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
    nicknamePrefix: "ali",
  });
  t.equal(comments.length, 2);
  t.ok(comments[0].agentPubKey);
  t.equal(comments[1].comment.nickname, "alice2");
  t.equal(comments[1].comment.fields.avatar, "aliceavatar2");

  comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
    nicknamePrefix: "alice",
  });
  t.equal(comments.length, 2);
  t.ok(comments[1].agentPubKey);
  t.equal(comments[1].comment.nickname, "alice2");

  comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
    nicknamePrefix: "alice_",
  });
  t.equal(comments.length, 2);
  t.ok(comments[0].agentPubKey);
  t.equal(comments[0].comment.nickname, "alice_bob");
  t.equal(comments[0].comment.fields.avatar, "bobboavatar");
});

orchestrator.run();
orchestrator = new Orchestrator();

orchestrator.registerScenario(
  "create a comment with upper case and search it with lower case",
  async (s, t) => {
    const [alice, bob] = await s.players([conductorConfig]);

    // install your happs into the coductors and destructuring the returned happ data using the same
    // array structure as you created in your installation array.
    const [[alice_comments], [bob_comments]] = await alice.installAgentsHapps(
      installation
    );

    let commentHash = await alice_comments.cells[0].call(
      zomeName,
      "create_comment",
      {
        nickname: "ALIce",
        fields: {
          avatar: "aliceavatar",
        },
      }
    );
    t.ok(commentHash);
    await sleep(5000);

    let comments = await bob_comments.cells[0].call(
      zomeName,
      "search_comments",
      {
        nicknamePrefix: "ali",
      }
    );
    t.equal(comments.length, 1);
    t.ok(comments[0].agentPubKey);
    t.equal(comments[0].comment.nickname, "ALIce");

    comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
      nicknamePrefix: "aLI",
    });
    t.equal(comments.length, 1);
    t.ok(comments[0].agentPubKey);
    t.equal(comments[0].comment.nickname, "ALIce");

    comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
      nicknamePrefix: "AlI",
    });
    t.equal(comments.length, 1);
    t.ok(comments[0].agentPubKey);
    t.equal(comments[0].comment.nickname, "ALIce");

    comments = await bob_comments.cells[0].call(zomeName, "search_comments", {
      nicknamePrefix: "ALI",
    });
    t.equal(comments.length, 1);
    t.ok(comments[0].agentPubKey);
    t.equal(comments[0].comment.nickname, "ALIce");
  }
);

orchestrator.run();
