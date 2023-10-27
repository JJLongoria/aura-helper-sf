# summary

Create a Package XML file and/or Destructive XML file from Git Changes

# description

Create a Package XML file and/or Destructive XML file from Git Changes to create a delta package to deploy and/or delete Metadata. Compare between two branches, commits or tags (even only your active branch) to create the files

# flags.ignore.summary

Use ignore file to ignore metadata types.

# flags.ignore.description

Use ignore file to ignore metadata types from package file.

# flags.ignore-file.summary

Path to the ignore file.

# flags.ignore-file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# flags.output-path.summary

Generated Files Output Path

# flags.output-path.description

Path to save the generated files. By default save result on <actualDir>

# flags.type.summary

Merge Files Strategy

# flags.type.description

Option to choose the generated file type(s). The options are:

- both (b): Generate both package and destructive files. Default option.
- package (p): Generate only package file.
- destructive (d): Generate only destructive file.

# flags.delete-before.summary

Create Destructive XML file to delete files before deploy new changes.

# flags.delete-before.description

Option to create the Descructive XML file to deploy it before package file (delete files before deploy new changes insted delete files after deploy changes).

# flags.source.summary

Source branch, commit, tag... to compare changes and create delta files.

# flags.source.description

Source branch, commit, tag... to compare changes and create delta files. That is the new code source or the "source salesforce org to get changes". You can select only source to create files from active branch changes (If not select source, also get the active branch)

# flags.target.summary

Source branch, commit, tag... to compare changes and create delta files.

# flags.target.description

Target branch, commit, tag... to compare changes and create delta files. That is the old code source or the "target salesforce org to deploy changes"

# flags.raw.summary

Return the raw data instead create xml files.

# flags.raw.description

Option to return the raw data instead create xml files. This option returns a JSON Object with the extracted data from git changes. Only work with --json flag

# flags.ignore-destructive.summary

Use Ignore fie to ignore metadata to delete.

# flags.ignore-destructive.description

Use ignore file to ignore metadata types from destructive file.

# flags.ignore-destructive-file.summary

Path to the ignore file.

# flags.ignore-destructive-file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# message.get-active-branch

Get active branch

# message.running-diff

Running Git Diff

# message.analizing-diff

Analyzing Diffs to get Metadata changes

# message.ignoring-metadata

Ignoring Metadata from package

# message.validate-ignore

Validate ignore file(s)

# message.ignoring-destructive-metadata

Ignoring Metadata from destructive

# message.creating-file

Creating %s file

# message.file-created

Files created on %s

# message.running-crate-package

Creating Package from GIT...

# examples

- Create package and destructive files from active branch changes

  <%= config.bin %> <%= command.id %>

- Create package and destructive files from changes between active branch and Develop

  <%= config.bin %> <%= command.id %> --type both -t Develop --json"

- Create only the package file from changes between two commits

  <%= config.bin %> <%= command.id %> --type package -s 1n3a5d3 -t 4a345da"

- Create only the destructive file from changes between two tags

  <%= config.bin %> <%= command.id %> --type destructive --deletebefore -s v2.0.0 -t v1.0.0 --raw --json"

- Create package and destructive files from changes between UAT branch and main branch, ignoring metadata on destructive with from custom ahignore file

  <%= config.bin %> <%= command.id %> --type both -s UAT -t main -u --ignoredestructive --destructiveignorefile "./.ahignoreDestructive.json" --json"
