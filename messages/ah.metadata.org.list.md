# summary

List all Metadata Types from the auth org.

# description

Command for list all metadata from the auth org

# flags.csv.summary

Show the result as CSV

# flags.csv.description

Option to show the result as CSV instead a table if not select --json flag.

# message.running-list

Listing Types...

# error.no-data

Not metadata types found to list

# examples

- List Metadata Types with progress report

  <%= config.bin %> <%= command.id %> -p

- List Metadata Types from specific Api Version

  <%= config.bin %> <%= command.id %> -a "48.0"

- List Metadata Types and show as CSV

  <%= config.bin %> <%= command.id %> --csv

- List Metadata Types from other project and save the result in a file as JSON

  <%= config.bin %> <%= command.id %> -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json

- List Metadata Types from other project and save the result in a file as CSV

  <%= config.bin %> <%= command.id %> -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --csv
