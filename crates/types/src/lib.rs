use hdi::prelude::*;
use hdi::prelude::holo_hash::{EntryHashB64, AgentPubKeyB64};

/// Comment entry definition.
///
/// The comment must
#[hdk_entry_helper]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct Comment {
    pub comment_about: EntryHashB64,
    pub content: String,
    pub author: AgentPubKeyB64,
    pub created_at: Timestamp,
}


/// Used as a return type of all functions.
#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateCommentInput {
    pub comment_about: EntryHashB64,
    pub content: String,
}
