import { hashToString } from 'holochain-ui-test-utils';

export class CommentsMock {
  constructor() {
    this.agents = [];
  }

  create_comment({ username }, provenance) {
    const agent = {
      agent_pub_key: hashToString(provenance),
      comment: { username, fields: {} },
    };
    this.agents.push(agent);

    return agent;
  }

  search_comments({ username_prefix }) {
    return this.agents
      .filter(a => a.comment.username.startsWith(username_prefix.slice(0, 3)))
      .map(a => ({
        agent_pub_key: a.agent_pub_key,
        ...a,
      }));
  }

  get_my_comment(_, provenance) {
    const agent = this.findAgent(hashToString(provenance));

    if (!agent)
      return {
        agent_pub_key: hashToString(provenance),
      };
    return {
      agent_pub_key: agent.agent_pub_key,
      comment: agent ? agent.comment : undefined,
    };
  }

  get_agent_comment({ agent_address }) {
    const agent = this.findAgent(agent_address);
    return agent ? agent.username : undefined;
  }

  findAgent(agent_address) {
    return this.agents.find(user => user.agent_pub_key === agent_address);
  }
}
