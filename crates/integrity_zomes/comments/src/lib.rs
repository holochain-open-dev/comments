//! ## hc_zome_comments
//!
//! Comments zome for any Holochain app.
//!
//! If you need to manage comments (nickname, name, avatar, age and other useful personal information)
//! you can directly include this zome in your DNA.
//!
//! Read about how to include both this zome and its frontend module in your application [here](https://holochain-open-dev.github.io/comments).


use hdi::prelude::*;
use hc_zome_comments_types::*;

#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
	Comment(Comment),
}


#[hdk_link_types]
pub enum LinkTypes {
	CommentAbout,
}


#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
  Ok(ValidateCallbackResult::Valid)
}

