# summary

Compress XML Metadata Files.

# description

Compress XML Metadata Files for best conflict handling with SVC systems. Works with relative or absolute paths.

# flags.all.summary

Compress All Project Files

# flags.all.description

Compress all XML files with support compression in your project.

# flags.directory.summary

Compress XML Files from specific directory

# flags.directory.description

Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose compress all.

# flags.file.summary

Compress XML Files from specific directory

# flags.file.description

Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose compress all.

# message.file-not-compressed

File %s does not support XML compression. '( %d%)'

# message.file-compressed

File %s compressed succesfully. '( %d%)'

# message.compress-success

Compress XML files finish successfully

# message.compress-progress

Compressing XML Files...

# message.compress-percentage

Compressing XML Files... (%d%)

# error.missing-compress-target

You must select compress all, entire directory(s) or single file(s)

# examples

- Compress all project XML Files

  <%= config.bin %> <%= command.id %> -a

- Compress all XML Files from objects folder (and subfolders)

  <%= config.bin %> <%= command.id %> -d force-app/main/default/objects --json

- Compress all XML Files from objects folder (and subfolders) and applications folder

  <%= config.bin %> <%= command.id %> -d "force-app/main/default/objects" -d "force-app/main/default/applications"

- Compress all XML Files from objects folder (and subfolders) and applications folder

  <%= config.bin %> <%= command.id %> -d "force-app/main/default/objects, force-app/main/default/applications"

- Compress specific XML File with progress report

  <%= config.bin %> <%= command.id %> -f "force-app/main/default/objects/Account/Account.object-meta-xml" -p

- Compress specific XML Files with JSON output

  <%= config.bin %> <%= command.id %> -f "force-app/main/default/objects/Account/Account.object-meta-xml" -f "force-app/main/default/objects/Case/Case.object-meta-xml" --json

- Compress specific XML Files with JSON output

  <%= config.bin %> <%= command.id %> -f "force-app/main/default/objects/Account/Account.object-meta-xml, force-app/main/default/objects/Case/Case.object-meta-xml" --json
