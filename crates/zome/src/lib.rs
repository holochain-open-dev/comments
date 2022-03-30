//! ## hc_zome_comments
//!
//! Comments zome for any Holochain app.
//!
//! If you need to manage comments (nickname, name, avatar, age and other useful personal information)
//! you can directly include this zome in your DNA.
//!
//! Read about how to include both this zome and its frontend module in your application [here](https://holochain-open-dev.github.io/comments).

use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

mod utils;

use hc_zome_comments_types::*;
use utils::try_get_and_convert;

entry_defs![PathEntry::entry_def(), Comment::entry_def()];

/// Creates the comment for the agent executing this call.
#[hdk_extern]
pub fn create_comment(create_input: CreateCommentInput) -> ExternResult<(EntryHashB64, Comment)> {
    let agent_info = agent_info()?;
    let time = sys_time()?;

    let comment = Comment {
        author: agent_info.agent_initial_pubkey.into(),
        created_at: time,
        content: create_input.content,
        comment_about: create_input.comment_about.clone(),
    };

    create_entry(&comment)?;

    let comment_hash = hash_entry(&comment)?;

    create_link(
        create_input.comment_about.into(),
        comment_hash.clone(),
        LinkTag::new("comments"),
    )?;

    Ok((comment_hash.into(), comment))
}

#[hdk_extern]
pub fn get_comments_for_entry(
    entry_hash: EntryHashB64,
) -> ExternResult<BTreeMap<EntryHashB64, Comment>> {
    let mut comments: BTreeMap<EntryHashB64, Comment> = BTreeMap::new();

    let links = get_links(entry_hash.into(), Some(LinkTag::new("comments")))?;

    for link in links {
        let comment: Comment = try_get_and_convert(link.target.clone())?;

        comments.insert(link.target.into(), comment);
    }

    Ok(comments)
}
