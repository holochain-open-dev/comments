use hdk::prelude::*;

pub fn try_get_and_convert<T: TryFrom<SerializedBytes>>(entry_hash: EntryHash) -> ExternResult<T> {
    match get(entry_hash.clone(), GetOptions::default())? {
        Some(record) => try_from_record(record),
        None => Err(err("Entry not found")),
    }
}

pub fn try_from_record<T: TryFrom<SerializedBytes>>(record: Record) -> ExternResult<T> {
    match record.entry() {
        record::RecordEntry::Present(entry) => try_from_entry::<T>(entry.clone()),
        _ => Err(err("Could not convert record")),
    }
}

pub fn try_from_entry<T: TryFrom<SerializedBytes>>(entry: Entry) -> ExternResult<T> {
    match entry {
        Entry::App(content) => match T::try_from(content.into_sb()) {
            Ok(e) => Ok(e),
            Err(_) => Err(err("Could not convert entry")),
        },
        _ => Err(err("Could not convert entry")),
    }
}

pub(crate) fn err(reason: &str) -> WasmError {
    wasm_error!(WasmErrorInner::Guest(String::from(reason)))
}
