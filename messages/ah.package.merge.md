# summary

Create Package or Destructive XML files from several package or destructive files.

# description

Create a Package XML file and/or Destructive XML file(s) from several package or destructive files. You can choose to many options to create the files.

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

# flags.ignore-destructive.summary

Use Ignore fie to ignore metadata to delete.

# flags.ignore-destructive.description

Use ignore file to ignore metadata types from destructive file.

# flags.ignore-destructive-file.summary

Path to the ignore file.

# flags.ignore-destructive-file.description

Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By default use %s file from your project root

# flags.file.summary

Paths to the package XML and/or Destructive files to Merge

# flags.file.description

Paths to the package XML and/or Destructive XML files to merge separated by commas

# flags.strategy.summary

Merge Files Strategy

# flags.strategy.description

Merge Files Strategy. You can merge the selected files using different strategies. The options are:

- by-type (t): Merge files by type, that is, the package XML files into ine package xml file and destructive files into one destructive. Default option.
- only-package (p): Merge only package files into one package file.
- only-destructive (d): Merge only destructive files into one destructive file.
- full-package (fp): Merge all files into one package file.
- full-destructive (fd): Merge all files into one destructive file.

# flags.output-dir.summary

Generated Files Output Path

# flags.output-dir.description

Path to save the generated files. By default save result on <actualDir>

# message.validate-ignore

Validate ignore file(s)

# message.runnig-merge

Mergin Packages...

# message.files-created

File(s) created on %s

# error.missing-data

To merge package files you must select at least two files to merge

# examples

- Merge two package files and two destructive files into one package and one destructive file to delete files after deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml"

- Merge two package files and two destructive files into one package and one destructive file to delete files before deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "by-type" --delete-before

- Merge only package files into one package file

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "only-package"

- Merge only the destructive files into one destructive file to delete files after deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "only-destructive"

- Merge only the destructive files into one destructive file to delete files before deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "only-destructive" --delete-before

- Merge all files into one package file

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "full-package"

- Merge all files into destructive file to delete files after deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "full-destructive"

- Merge all files files into destructive file to delete files before deploy

  <%= config.bin %> <%= command.id %> -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, path/to/destructiveChangesPost1.xml" --strategy "full-destructive" --delete-before
