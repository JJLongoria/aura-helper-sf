# summary

Create a Package XML file or Destructive XML file from Aura Helper JSON

# description

Create a Package XML file or Destructive XML file from Aura Helper JSON Metadata File

# flags.source.summary

Source JSON file

# flags.source.description

Metadata JSON file path to create the Package or Destructive file

# flags.output-dir.summary

Generated Files Output Path

# flags.output-dir.description

Path to save the generated files. By default save result on <actualDir>

# flags.to-delete.summary

Create a Destructive XML file to delete metadata

# flags.to-delete.description

Option to create the package to delete metadata (Destructive XML File)

# flags.delete-before.summary

Create Destructive XML file to delete files before deploy new changes.

# flags.delete-before.description

Option to create the Descructive XML file to deploy it before package file (delete files before deploy new changes insted delete files after deploy changes).

# flags.ignore.summary

Use ignore file to ignore metadata types.

# flags.ignore.description

Use ignore file to ignore metadata types from package file.

# flags.ignore-file.summary

Path to the ignore file.

# flags.ignore-file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# flags.wildcards.summary

Use wildcards when apply

# flags.wildcards.description

Option to use wildcards instead the explicit names when apply

# message.ignoring-metadata

Ignoring Metadata from package

# message.validate-ignore

Validate ignore file(s)

# message.creating-file

Creating %s file

# message.file-created

Files created on %s

# message.running-crate-package

Creating Package from JSON...

# message.reading-json

Reading JSON File

# examples

- Create package file from Aura Helper JSON file

  <%= config.bin %> <%= command.id %> -s path/to/metadata/json/file.json

- Create package file from Aura Helper JSON file and ignoring metadata types using the default ignore file

  <%= config.bin %> <%= command.id %> -s path/to/metadata/json/file.json --ignore

- Create destructive file to delete after deploy changes from Aura Helper JSON file and ignoring metadata types using the default ignore file

  <%= config.bin %> <%= command.id %> -s path/to/metadata/json/file.json --to-delete --ignore

- Create destructive file to delete before deploy changes from Aura Helper JSON file and ignoring metadata types using the default ignore file

  <%= config.bin %> <%= command.id %> -s path/to/metadata/json/file.json --to-delete --delete-before
