use hdk::prelude::*;
use hdk::prelude::holo_hash::EntryHashB64;
use hc_zome_dummy_integrity::*;

#[hdk_extern]
pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {
    create_entry(EntryTypes::DummyEntry(dummy.clone()))?;

    let hash = hash_entry(dummy)?;

    Ok(hash.into())
}
