# summary

Import Salesforce Data.

# description

Command to import the data extracted with data:export command into the project connected org.

# flags.file.summary

File to Import.

# flags.file.description

Path to the exported file with data:export command to import into the auth org. Must be the -plan file.

# flags.limit.summary

Record by Batch

# flags.limit.description

Number of records to insert at one time. Max records per batch are 200. (200 by default)

# flags.source-org.summary

Source Org Username or Alias

# flags.source-org.description

Username or Alias to the source org for import data from the org, not from a file

# flags.query.summary

Query to Extract Data

# flags.query.description

Query to extract data. You can use a simple query (Select [fields] from [object] [where] ...) or a complex query (select [fields], [query], [query] from [object] [where] ...) for export data in tree format

# message.import-success

Data imported succesfully into your Auth Org

# message.running-import

Importing Data...

# message.start-extracting-data

Start Extracting data from Org with username or alias %s

# message.loading-record-types

Loading stored Record Types from target org

# message.record-types-loaded

Loaded Record Yypes from target org

# message.save-references-map

Saving Reference Map

# message.resolving-record-types

Resolving Record Types references

# message.resolving-record-type

Resolving Record Type references on %s records

# message.resolving-self-references

Resolving Self references

# message.resolving-references

Resolving References

# message.creating-batches

Creating Batches to insert data

# message.batches-created

Batches to insert data created. Total Records: %s ; Total Batches: %s

# message.start-insert-job

Start job to insert data. This operation can take several minutes. Please wait.

# message.execute-insert-operation

Performing insert operation on %s record(s)

# message.running-batch

Running Batch %s

# message.execute-insert-child-operations

Performing insert operation on %s child record(s)

# message.error-founds

Errors found on import, rolling back

# message.rollback

Rolling back %s record(s)

# message.rollback-finished

Roll back on %s record(s) finished succesfully

# message.data-imported-success

Data imported succesfully into your Auth Org

# error.record-type

DeveloperName not found on RecordType data. Please, put Recordtype.DeveloperName into the query to correct mapping of record types

# error.record-type-not-exists

Noy found any Record Type to %s with Developer Name %s

# error.record-type-not-exists-obj

Has no record types for %s on target org. Please, create record types and then, import the data

# error.not-plan-file

Wrong --file path. Please, select a plan file (File ended with -plan.json)

# error.source-not-selected

You must select a Source Org or file to import data

# error.query-not-provided

Wrong --query. Query are required to extract data from --source-org

# error.files-not-exists

The next files does not exists or do not has access permission: %s

# error.data-not-imported

Data does not import because found errors. Go to %s for see the errors by batch

# examples

- Import data from another org with username or alias "aliasOrg"

  <%= config.bin %> <%= command.id %> -s "aliasOrg" -q "Select Id, Name, BillingNumber, (Select Id, Name, AccountId, Phone from Contacts) from Account",

- Import data from extracted file with 50 records per batch

  <%= config.bin %> <%= command.id %> -f "./export/accounts/accounts-plan.json" -n 50
