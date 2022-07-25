use hdi::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct DummyEntry(String);


#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
#[entry_def()]
DummyEntry(DummyEntry),
}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
  Ok(ValidateCallbackResult::Valid)
}