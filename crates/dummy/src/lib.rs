use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

#[hdk_entry(id = "dummy")]
pub struct DummyEntry(String);

entry_defs![DummyEntry::entry_def()];

#[hdk_extern]
pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {
    create_entry(&dummy)?;

    let hash = hash_entry(&dummy)?;

    Ok(hash.into())
}
