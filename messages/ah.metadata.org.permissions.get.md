# summary

Get All Available User Permissions

# description

Command to get all available User permisions in your org

# flags.csv.summary

Show Result as CSV.

# flags.csv.description

Option to show the result as CSV instead a table if not select --json flag

# message.running-get

Getting all available User Permisions...

# message.finished

Getting Permissions finished

# error.no-data

Not permissions found to list

# examples

- Get all available User permisions in your org and show the result as JSON

  <%= config.bin %> <%= command.id %> --json

- Get all available User permisions in your org and show the result as Table

  <%= config.bin %> <%= command.id %>

- Get all available User permisions in your org and save output as JSON

  <%= config.bin %> <%= command.id %> --output-file "path/to/the/output/permissions.json" --json

- Get all available User permisions in your org and save output as CSV

  <%= config.bin %> <%= command.id %> --output-file "path/to/the/output/permissions.json" --csv
