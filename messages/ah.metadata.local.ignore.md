# summary

Ignore Metadata from your project

# description

Command for ignore metadata from your project. Use .ahignore.json file for perform this operation. This command will be delete the ignored metadata from your project folder

# flags.all.summary

Ignore All Metadata types on file.

# flags.all.description

Ignore all metadata types according to the ignore file.

# flags.type.summary

Ignore specific Metadata Types.

# flags.type.description

Ignore the specified metadata types according to the ignore file. You can select a sigle or a list separated by commas. This options does not take effect if you choose ignore all.

# flags.file.summary

Path to the ignore file.

# flags.file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# flags.compress.summary

Compress modified files.

# flags.compress.description

Add this option to compress modified files by ignore operation.

# message.processing-metadata-type

Processing %s Metadata Type

# message.ignore-sucess

Ignore metadata finished successfully

# message.running-ignore

Ignoring Metadata...

# error.missing-types

You must select ignore all or ignore specific types

# error.wrong-file

Wrong --file path. Error: %s

# examples

- Ignore All Metadata Types on ignore file and compress modified files

  <%= config.bin %> <%= command.id %> -a -c --json

- Ignore Specific Metadata Types on ignore file with different ignore file (not default ignore file from project)

  <%= config.bin %> <%= command.id %> -t "CustomApplication, Profile, CustomLabels" -i "Path/to/the/file/.myignoreFile.json" -p
