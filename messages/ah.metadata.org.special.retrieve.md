# summary

Retrieve Special Metadata Types.

# description

Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you can retrieve only the Custom Object XML Files without retrieve anything more.

# flags.all.summary

Retrieve all.

# flags.all.description

Retrieve all supported Metadata Types (%s)

# flags.type.summary

Retrieve Specifics Metadata Types.

# flags.type.description

Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1, Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1 for the object Account or "RecordType:Account" to retrieve all Record Types for Account

# flags.download-all.summary

Download from All Namespaces

# flags.download-all.description

Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not selected, only download and retrieve data from your org namespace

# flags.compress.summary

Compress modified XML Files

# flags.compress.description

Add this option to compress modified files by retrieve operation

# message.loading-org

Describing Org Metadata Types

# message.after-download

%s downloaded

# message.on-retrieve

Retriving Metadata Types. This operation can will take several minutes, please wait.

# message.copy-files

Copying %s to %s

# message.running-retrieve

Retrieving Data...

# message.retrieve-in-progress

(%s) Retrieve in progress. Please wait.

# message.retrieve-finished

Retrieve metadata finished successfully

# error.missing-types

You must select retrieve all or retrieve specific types

# examples

- Retrieve all special types with XML Compression

  <%= config.bin %> <%= command.id %> --all -c

- Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types (All Case RecordTypes and RTName Record Type from Account)

  <%= config.bin %> <%= command.id %> -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, RecordType:Account:RtName"
