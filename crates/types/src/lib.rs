use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

/// Comment entry definition.
///
/// The comment must 
#[hdk_entry(id = "comment", visibility = "public")]
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
