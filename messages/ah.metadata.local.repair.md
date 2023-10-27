# summary

Check or Repair project dependencies.

# description

Command to Check or Repair dependencies errors on your local project. (Only check data and types stored in your local project, do not connect to the org).

# flags.all.summary

Check or Repair all.

# flags.all.description

Check or Repair all supported metadata types. (Support up to API v53.0)

# flags.type.summary

Check or Repair specified metadata types.

# flags.type.description

Check or Repair specified metadata types. You can choose single type or a list separated by commas, also you can choose to repair a specified objects like "MetadataTypeAPIName:MetadataObjectAPIName" or "MetadataTypeAPIName:ObjectAPIName:ItemAPIName". For example, "CustomApplication:AppName1" for repair only AppName1 Custom App. This option does not take effet if select repair all

# flags.only-check.summary

Only Check Erros.

# flags.only-check.description

Option to check (and not repair) error dependencies and return the errors by file

# flags.compress.summary

Compress modified files.

# flags.compress.description

Add this option to compress modified files by repair operation.

# flags.ignore.summary

Ignore check or repair using Ignore File.

# flags.ignore.description

Option to ignore to check or repair the metadata included in ignore file.

# flags.ignore-file.summary

Path to the ignore file.

# flags.ignore-file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# message.running-repair

Repair dependencies...

# message.running-check

Check dependencies...

# message.validate-file

Validate ignore file

# message.processing-object

Processing object %s from %s

# message.processing-item

Processing item %s(%s) from %s

# error.missing-types

You must select repair all or repair specific types

# examples

- Repair all suported metadata types and compress modified files

  <%= config.bin %> <%= command.id %> -a -c

- Repair The Custom Application App1, All profiles, The permission Sets Perm1 and Perm2 and the Custom Field Custom_field\_\_c from Account object

  <%= config.bin %> <%= command.id %> -t "CustomApplication:App1,Profile,PermissionSet:Perm1,PermissionSet:Perm2,CustomField:Account:Custom_field\_\_c"

- Repair all profiles from the project root redirect errors to a file

  <%= config.bin %> <%= command.id %> -t "Profile" --output-file "path/to/the/output/checkResult.json""
