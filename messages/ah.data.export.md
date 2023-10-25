# summary

Export Salesforce Data.

# description

Command to export data from the selected org to work with data:import command.

# flags.query.summary

Query to Extract Data

# flags.query.description

Query to extract data. You can use a simple query (Select [fields] from [object] [where] ...) or a complex query (select [fields], [query], [query] from [object] [where] ...) for export data in tree format

# flags.output-path.summary

Generated Files Output Path

# flags.output-path.description

Path to save the generated output files. By default save result on <actualDir>/export

# flags.prefix.summary

Files Prefix

# flags.prefix.description

Prefix to add to the generated files

# message.running-export

Exporting Data...

# message.start-extracting-data

Start Extracting data from %s

# message.extracted-data-success

Data extracted succesfully on %s

# examples

- Extract Accounts data with related contacts

  <%= config.bin %> <%= command.id %> -q "Select Id, Name, BillingNumber, (Select Id, Name, AccountId, Phone from Contacts) from Account" --output-file "./export/accounts"

- Extract Accounts data with Records Types

  <%= config.bin %> <%= command.id %> -q "Select Id, Name, BillingNumber, RecordType.DeveloperName from Account" -output-file "./export/accounts"
