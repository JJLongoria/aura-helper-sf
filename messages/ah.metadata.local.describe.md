# summary

Describe Local Metadata Types.

# description

Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have in your local project.

# flags.all.summary

Describe all metadata types.

# flags.all.description

Describe all metadata types stored in your local project.

# flags.type.summary

Describe the specified metadata types.

# flags.type.description

Describe the specified metadata types. You can select a single metadata or a list separated by commas. This option does not take effect if you choose describe all.

# flags.group.summary

Group global Quick Actions into GlobalActions.

# flags.group.description

Option to group global Quick Actions into GlobalActions group, false to list as object and item.

# flags.csv.summary

Show result as CSV.

# flags.csv.description

Option to show the result as CSV instead a table if not select --json flag

# message.describe-local-types

Describing Local Metadata Types

# message.running-describe

Describing Types...

# message.finished

Describe Types finished

# error.missing-types

You must select describe all or describe specific types

# error.no-data

Not metadata types found to describe

# examples

- Describe all metadata types, showing progress and show result as CSV and save output as CSV

  <%= config.bin %> <%= command.id %> -a -p --output-file "path/to/the/output/file.csv" --csv

- Describe all metadata types, showing progress and show result as JSON and save output as JSON

  <%= config.bin %> <%= command.id %> -a -p --output-file "path/to/the/output/file.json" --json

- Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

  <%= config.bin %> <%= command.id %> -t "CustomObject, CustomField, Profile, ValidationRule" -p

- Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

  <%= config.bin %> <%= command.id %> -t "CustomObject" -t "CustomField" -t "Profile -t "ValidationRule" -p

- Describe CustomObject and CustomField metadata types, showing result as JSON

  <%= config.bin %> <%= command.id %> -t "CustomObject, CustomField" --json

- Describe CustomObject and CustomField metadata types, showing result as JSON

  <%= config.bin %> <%= command.id %> -t "CustomObject" -t "CustomField" --json
