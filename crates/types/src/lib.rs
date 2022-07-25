use hdi::prelude::*;

/// Comment entry definition.
///
/// The comment must
#[hdk_entry_helper]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct Comment {
    pub comment_about: EntryHash,
    pub content: String,
    pub author: AgentPubKey,
    pub created_at: Timestamp,
}


/// Used as a return type of all functions.
#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateCommentInput {
    pub comment_about: EntryHash,
    pub content: String,
}
