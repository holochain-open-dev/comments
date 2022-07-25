use hdk::prelude::*;
use hdk::prelude::holo_hash::EntryHashB64;


use std::collections::BTreeMap;

mod utils;

use hc_zome_comments_types::*;
use hc_zome_comments_integrity::*;
use utils::try_get_and_convert;

/// Creates the comment for the agent executing this call.
#[hdk_extern]
pub fn create_comment(create_input: CreateCommentInput) -> ExternResult<(EntryHash, Comment)> {
    let agent_info = agent_info()?;
    let time = sys_time()?;

    let comment = Comment {
        author: agent_info.agent_initial_pubkey.into(),
        created_at: time,
        content: create_input.content,
        comment_about: create_input.comment_about.clone(),
    };

    create_entry(EntryTypes::Comment(comment.clone()))?;

    let comment_hash = hash_entry(&comment)?;

    create_link(
        create_input.comment_about,
        comment_hash.clone(),
        LinkTypes::CommentAbout,
        LinkTag::new("comments"),
    )?;

    Ok((comment_hash.into(), comment))
}

#[hdk_extern]
pub fn get_comments_for_entry(
    entry_hash: EntryHashB64,
) -> ExternResult<BTreeMap<EntryHashB64, Comment>> {
    let mut comments: BTreeMap<EntryHashB64, Comment> = BTreeMap::new();

    let links = get_links(entry_hash, LinkTypes::CommentAbout, Some(LinkTag::new("comments")))?;

    for link in links {
        let comment: Comment = try_get_and_convert(EntryHash::from(link.target.clone()))?;

        comments.insert(EntryHash::from(link.target).into(), comment);
    }

    Ok(comments)
}
