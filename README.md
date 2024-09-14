# Aura Helper SF

[![NPM](https://img.shields.io/npm/v/aura-helper-sf.svg?label=aura-helper-sf)](https://www.npmjs.com/package/aura-helper-sf)
[![Downloads/week](https://img.shields.io/npm/dw/aura-helper-sf.svg)](https://npmjs.org/package/aura-helper-sf)
[![License](https://img.shields.io/github/license/jjlongoria/aura-helper-sf?logo=github)](https://github.com/JJLongoria/aura-helper-sf/blob/master/LICENSE)

SF CLI Plugin to work with Salesforce Projects. This application are entire developed using Aura Helper Framework and has powerfull commands to manage your projects, create Continous Integration and DevOps workflows and support developers to make some utils task on every project like import and export data, create package files (including from git differences), compare metadata from two orgs or from your local project and the auth org, and to much more. It is the Aura Helper CLI natural evolution to integrate better to other salesforce tools.

## [**Features**](#features)

- Simplify your work with **Salesforce and Git** with the command for [**create packages**](#package-command-git) (for deploy and delete) from git changes. **Compare** two _branches_, _commits_ or _tags_ for create the files for deploy your package.
- [**Repair**](#ahmetadatalocalrepair) file _dependencies errors_ on your project files or [**Check only**](#ahmetadatalocalrepair) to resolve errors manually.
- [**Compress your XML Files**](#metadata-commands) structure for make easy _identify changes_ and resolve _git conflicts_. Also need less storage and work faster.
- [**Retrieve special Metadata Types**](#ahmetadatalocalspecialretrieve) like _profiles_ or _permissions_ sets (and others) with all data without retrieve any file more with a simple command. Also can [**Retrieve special Metadata Types**](#ahmetadataorgspecialretrieve) from the connected org.
- [**Compare**](#ahmetadataorgcompare) your _local data_ with your _authorized organization_ for get the differences for delete, retrieve or anything you want. Or [**Compare**](#ahmetadataorgbetweencompare) the Metadata Types _between two orgs_ to see the differences.
- [**Merge**](#ahpackagemerge) diferent **package** or **destructive** files into one file with only one command.
- [**Ignore**](#ahmetadatalocalignore) any metadata type from your local project or from the package files for maintance different configuration into your sandbox and production enviroments with simple file and command.
- Specially designed for **DevOps workflows**.
- [**Code Quality Report**](#) with SFDX Scanner, Quality Gates to control the quality of your code like SonarQube, with integration with CI and DevOps tools. Also create an HTML Report with statistics and details of the code analisys.
- And much more

### **Specially Designed for DevOps Workflows**

---

<br/>

Supported Operative Systems:

- Windows
- Linux
- Mac OS X

---

## _Table of Contents_

- [Aura Helper SF](#aura-helper-sf)
  - [**Features**](#features)
    - [**Specially Designed for DevOps Workflows**](#specially-designed-for-devops-workflows)
  - [_Table of Contents_](#table-of-contents)
- [**Installation Guide**](#installation-guide)
  - [**SF CLI Plugins manager (Recommended)**](#sf-cli-plugins-manager-recommended)
  - [**NPM Installation**](#npm-installation)
  - [**Clone Repository Installation**](#clone-repository-installation)
- [**Aura Helper SF Commands**](#aura-helper-sf-commands)
  - [`sf ah apex execute`](#sf-ah-apex-execute)
  - [`sf ah apex execute org`](#sf-ah-apex-execute-org)
  - [`sf ah apex org execute`](#sf-ah-apex-org-execute)
  - [`sf ah compare metadata`](#sf-ah-compare-metadata)
  - [`sf ah compare org`](#sf-ah-compare-org)
  - [`sf ah compress`](#sf-ah-compress)
  - [`sf ah compress xml`](#sf-ah-compress-xml)
  - [`sf ah data export`](#sf-ah-data-export)
  - [`sf ah data import`](#sf-ah-data-import)
  - [`sf ah execute apex`](#sf-ah-execute-apex)
  - [`sf ah execute apex org`](#sf-ah-execute-apex-org)
  - [`sf ah execute org apex`](#sf-ah-execute-org-apex)
  - [`sf ah get org permissions`](#sf-ah-get-org-permissions)
  - [`sf ah get permissions org`](#sf-ah-get-permissions-org)
  - [`sf ah git tests extract`](#sf-ah-git-tests-extract)
  - [`sf ah local retrieve special`](#sf-ah-local-retrieve-special)
  - [`sf ah local special retrieve`](#sf-ah-local-special-retrieve)
  - [`sf ah logs clean`](#sf-ah-logs-clean)
  - [`sf ah metadata compare`](#sf-ah-metadata-compare)
  - [`sf ah metadata local compress`](#sf-ah-metadata-local-compress)
  - [`sf ah metadata local describe`](#sf-ah-metadata-local-describe)
  - [`sf ah metadata local ignore`](#sf-ah-metadata-local-ignore)
  - [`sf ah metadata local list`](#sf-ah-metadata-local-list)
  - [`sf ah metadata local repair`](#sf-ah-metadata-local-repair)
  - [`sf ah metadata local special retrieve`](#sf-ah-metadata-local-special-retrieve)
  - [`sf ah metadata org apex execute`](#sf-ah-metadata-org-apex-execute)
  - [`sf ah metadata org apex tests extract`](#sf-ah-metadata-org-apex-tests-extract)
  - [`sf ah metadata org compare`](#sf-ah-metadata-org-compare)
  - [`sf ah metadata org describe`](#sf-ah-metadata-org-describe)
  - [`sf ah metadata org list`](#sf-ah-metadata-org-list)
  - [`sf ah metadata org permissions get`](#sf-ah-metadata-org-permissions-get)
  - [`sf ah metadata org special retrieve`](#sf-ah-metadata-org-special-retrieve)
  - [`sf ah org apex execute`](#sf-ah-org-apex-execute)
  - [`sf ah org compare`](#sf-ah-org-compare)
  - [`sf ah org execute apex`](#sf-ah-org-execute-apex)
  - [`sf ah org get permissions`](#sf-ah-org-get-permissions)
  - [`sf ah org permissions get`](#sf-ah-org-permissions-get)
  - [`sf ah org retrieve special`](#sf-ah-org-retrieve-special)
  - [`sf ah org special retrieve`](#sf-ah-org-special-retrieve)
  - [`sf ah package git create`](#sf-ah-package-git-create)
  - [`sf ah package json convert`](#sf-ah-package-json-convert)
  - [`sf ah package json create`](#sf-ah-package-json-create)
  - [`sf ah package merge`](#sf-ah-package-merge)
  - [`sf ah permissions get org`](#sf-ah-permissions-get-org)
  - [`sf ah permissions org get`](#sf-ah-permissions-org-get)
  - [`sf ah scan report open`](#sf-ah-scan-report-open)
  - [`sf ah scan report quality`](#sf-ah-scan-report-quality)
  - [`sf ah scan report run`](#sf-ah-scan-report-run)
  - [`sf ah special local retrieve`](#sf-ah-special-local-retrieve)
  - [`sf ah special org retrieve`](#sf-ah-special-org-retrieve)
  - [`sf ah version`](#sf-ah-version)
  - [`sf ah xml compress`](#sf-ah-xml-compress)
- [**Ignore File**](#ignore-file)
  - [Example:](#example)
    - [IMPORTANT](#important)
- [**Metadata JSON Format**](#metadata-json-format)
  - [Example:](#example-1)
- [**Dependencies Repair Response**](#dependencies-repair-response)
  - [**Example**:](#example-2)
- [**Dependencies Check Response**](#dependencies-check-response)
  - [**Example**:](#example-3)
- [Issues](#issues)
- [Contributing](#contributing)
  - [CLA](#cla)
  - [Build](#build)

---

# [**Installation Guide**](#installation-guide)

You can install the plugins using [SF CLI plugins manager](#installation-sf) or cloning the repository and link it with SF CLI.

## [**SF CLI Plugins manager (Recommended)**](#installation-sf)

To install Aura Helper SF CLI run the next command:

    sf plugins install aura-helper-sf

## [**NPM Installation**](#installation-npm)

To install Aura Helper SF run the next command:

    npm install -g aura-helper-sf

## [**Clone Repository Installation**](#installation-clone)

To install cloning the source code repository, follow the next steps

1.  Clone the repository
2.  Go to the root project folder
3.  Run the next command

        sf plugins link

# [**Aura Helper SF Commands**](#aura-helper-sf-commands)

All commands from Aura Helper SF have the next structure:

    sf <command:name> [command:input] [options]

Al commands start by **ah**. For example

    sf ah topic command [command:input] [options]

---

<!-- commands -->

## `sf ah apex execute`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah apex execute --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah apex execute -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah apex execute -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah apex execute org`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah apex execute org --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah apex execute org -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah apex execute org -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah apex org execute`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah apex org execute --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah apex org execute -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah apex org execute -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah compare metadata`

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

```
USAGE
  $ sf ah compare metadata -o <value> [--json] [-r <value>] [-s <value>] [-a <value>] [-p] [--output-file <value>]
  [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             (required) Target Org to Compare.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source-org=<value>             Source Org to compare.
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compare Metadata Types and Objects between two orgs or between your local project and your auth org

  Command to compare your local project with your auth org for get the differences. The result are the metadata types
  and objects that you have in your org, but don't have in your local project. Also can compare between two different
  orgs and return the metadata that exists on target org but not exists on source org

ALIASES
  $ sf ah metadata compare
  $ sf ah compare metadata
  $ sf ah org compare
  $ sf ah compare org

EXAMPLES
  Compare Metadata Types and Objects between your local project and your auth org

    $ sf ah compare metadata -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between two orgs

    $ sf ah compare metadata -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

    $ sf ah compare metadata -t test.username@salesforceOrg.com.qa --csv

  Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

    $ sf ah compare metadata -t test.username@salesforceOrg.com.qa --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Target Org to Compare.

    Target Salesforce org to compare.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<value>  Source Org to compare.

    Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the
    command will compare your local project with your auth org

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah compare org`

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

```
USAGE
  $ sf ah compare org -o <value> [--json] [-r <value>] [-s <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             (required) Target Org to Compare.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source-org=<value>             Source Org to compare.
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compare Metadata Types and Objects between two orgs or between your local project and your auth org

  Command to compare your local project with your auth org for get the differences. The result are the metadata types
  and objects that you have in your org, but don't have in your local project. Also can compare between two different
  orgs and return the metadata that exists on target org but not exists on source org

ALIASES
  $ sf ah metadata compare
  $ sf ah compare metadata
  $ sf ah org compare
  $ sf ah compare org

EXAMPLES
  Compare Metadata Types and Objects between your local project and your auth org

    $ sf ah compare org -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between two orgs

    $ sf ah compare org -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

    $ sf ah compare org -t test.username@salesforceOrg.com.qa --csv

  Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

    $ sf ah compare org -t test.username@salesforceOrg.com.qa --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Target Org to Compare.

    Target Salesforce org to compare.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<value>  Source Org to compare.

    Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the
    command will compare your local project with your auth org

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah compress`

Compress XML Metadata Files.

```
USAGE
  $ sf ah compress [--json] [-r <value>] [--all | -f <value> | -d <value>] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory
  -f, --file=<path/to/file>...            Compress XML Files from specific directory
  -r, --root=<path/to/project/root>       [default: ./] Root Project Path
  --all                                   Compress All Project Files
  --sort-order=<option>                   [default: simpleFirst] Sort order for XML Files compression
                                          <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compress XML Metadata Files.

  Compress XML Metadata Files for best conflict handling with SVC systems. Works with relative or absolute paths.

ALIASES
  $ sf ah compress
  $ sf ah xml compress
  $ sf ah compress xml

EXAMPLES
  Compress all project XML Files

    $ sf ah compress -a

  Compress all XML Files from objects folder (and subfolders)

    $ sf ah compress -d force-app/main/default/objects --json

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah compress -d "force-app/main/default/objects" -d "force-app/main/default/applications"

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah compress -d "force-app/main/default/objects, force-app/main/default/applications"

  Compress specific XML File with progress report

    $ sf ah compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -p

  Compress specific XML Files with JSON output

    $ sf ah compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -f ^
      "force-app/main/default/objects/Case/Case.object-meta-xml" --json

  Compress specific XML Files with JSON output

    $ sf ah compress -f "force-app/main/default/objects/Account/Account.object-meta-xml, ^
      force-app/main/default/objects/Case/Case.object-meta-xml" --json

FLAG DESCRIPTIONS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -f, --file=<path/to/file>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --all  Compress All Project Files

    Compress all XML files with support compression in your project.

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah compress xml`

Compress XML Metadata Files.

```
USAGE
  $ sf ah compress xml [--json] [-r <value>] [--all | -f <value> | -d <value>] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory
  -f, --file=<path/to/file>...            Compress XML Files from specific directory
  -r, --root=<path/to/project/root>       [default: ./] Root Project Path
  --all                                   Compress All Project Files
  --sort-order=<option>                   [default: simpleFirst] Sort order for XML Files compression
                                          <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compress XML Metadata Files.

  Compress XML Metadata Files for best conflict handling with SVC systems. Works with relative or absolute paths.

ALIASES
  $ sf ah compress
  $ sf ah xml compress
  $ sf ah compress xml

EXAMPLES
  Compress all project XML Files

    $ sf ah compress xml -a

  Compress all XML Files from objects folder (and subfolders)

    $ sf ah compress xml -d force-app/main/default/objects --json

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah compress xml -d "force-app/main/default/objects" -d "force-app/main/default/applications"

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah compress xml -d "force-app/main/default/objects, force-app/main/default/applications"

  Compress specific XML File with progress report

    $ sf ah compress xml -f "force-app/main/default/objects/Account/Account.object-meta-xml" -p

  Compress specific XML Files with JSON output

    $ sf ah compress xml -f "force-app/main/default/objects/Account/Account.object-meta-xml" -f ^
      "force-app/main/default/objects/Case/Case.object-meta-xml" --json

  Compress specific XML Files with JSON output

    $ sf ah compress xml -f "force-app/main/default/objects/Account/Account.object-meta-xml, ^
      force-app/main/default/objects/Case/Case.object-meta-xml" --json

FLAG DESCRIPTIONS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -f, --file=<path/to/file>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --all  Compress All Project Files

    Compress all XML files with support compression in your project.

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah data export`

Export Salesforce Data.

```
USAGE
  $ sf ah data export -q <value> [--json] [-r <value>] [-a <value>] [-o <value>] [-p] [--output-dir <value>]
    [--prefix <value>]

FLAGS
  -a, --api-version=<value>           API version to use if different from the default
  -o, --target-org=<value>            Login username or alias for the target org
  -p, --progress                      Report Command Progress
  -q, --query=Select ... from ...     (required) Query to Extract Data
  -r, --root=<path/to/project/root>   [default: ./] Root Project Path
  --output-dir=<path/to/output/file>  [default: ./export] Generated Files Output Path
  --prefix=<filePrefix>               Files Prefix

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Export Salesforce Data.

  Command to export data from the selected org to work with data:import command.

EXAMPLES
  Extract Accounts data with related contacts

    $ sf ah data export -q "Select Id, Name, BillingNumber, (Select Id, Name, AccountId, Phone from Contacts) from ^
      Account" --output-file "./export/accounts"

  Extract Accounts data with Records Types

    $ sf ah data export -q "Select Id, Name, BillingNumber, RecordType.DeveloperName from Account" --output-file ^
      "./export/accounts"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -q, --query=Select ... from ...  Query to Extract Data

    Query to extract data. You can use a simple query (Select [fields] from [object] [where] ...) or a complex query
    (select [fields], [query], [query] from [object] [where] ...) for export data in tree format

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --output-dir=<path/to/output/file>  Generated Files Output Path

    Path to save the generated output files. By default save result on <actualDir>/export

  --prefix=<filePrefix>  Files Prefix

    Prefix to add to the generated files
```

_See code: [lib/commands/ah/data/export.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/data/export.ts)_

## `sf ah data import`

Import Salesforce Data.

```
USAGE
  $ sf ah data import -q <value> [--json] [-r <value>] [-a <value>] [-o <value>] [-p] [-f <value>] [-l <value>] [-s
    <value>]

FLAGS
  -a, --api-version=<value>           API version to use if different from the default
  -f, --file=<path/to/exported/file>  File to Import.
  -l, --limit=<recordsPerBatch>       [default: 200] Record by Batch
  -o, --target-org=<value>            Login username or alias for the target org
  -p, --progress                      Report Command Progress
  -q, --query=Select ... from ...     (required) Query to Extract Data
  -r, --root=<path/to/project/root>   [default: ./] Root Project Path
  -s, --source-org=<usernameOrAlias>  Source Org Username or Alias

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Import Salesforce Data.

  Command to import the data extracted with data:export command into the project connected org.

EXAMPLES
  Import data from another org with username or alias "aliasOrg"

    $ sf ah data import -o "aliasOrg" -q "Select Id, Name, BillingNumber, (Select Id, Name, AccountId, Phone from ^
      Contacts) from Account",

  Import data from extracted file with 50 records per batch

    $ sf ah data import -f "./export/accounts/accounts-plan.json" -n 50

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -f, --file=<path/to/exported/file>  File to Import.

    Path to the exported file with data:export command to import into the auth org. Must be the -plan file.

  -l, --limit=<recordsPerBatch>  Record by Batch

    Number of records to insert at one time. Max records per batch are 200. (200 by default)

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -q, --query=Select ... from ...  Query to Extract Data

    Query to extract data. You can use a simple query (Select [fields] from [object] [where] ...) or a complex query
    (select [fields], [query], [query] from [object] [where] ...) for export data in tree format

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<usernameOrAlias>  Source Org Username or Alias

    Username or Alias to the source org for import data from the org, not from a file
```

_See code: [lib/commands/ah/data/import.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/data/import.ts)_

## `sf ah execute apex`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah execute apex --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah execute apex -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah execute apex -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah execute apex org`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah execute apex org --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah execute apex org -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah execute apex org -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah execute org apex`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah execute org apex --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah execute org apex -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah execute org apex -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah get org permissions`

Get All Available User Permissions

```
USAGE
  $ sf ah get org permissions [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah get org permissions --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah get org permissions

  Get all available User permisions in your org and save output as JSON

    $ sf ah get org permissions --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah get org permissions --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah get permissions org`

Get All Available User Permissions

```
USAGE
  $ sf ah get permissions org [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah get permissions org --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah get permissions org

  Get all available User permisions in your org and save output as JSON

    $ sf ah get permissions org --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah get permissions org --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah git tests extract`

Extract Tests data from commits.

```
USAGE
  $ sf ah git tests extract -s <value> [--json] [-r <value>] [-a <value>] [--output-file <value>] [-t <value>]
    [--start-tag <value>] [--end-tag <value>]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source=<value>                 (required) Source Branch, Commit or Tag.
  -t, --target=<value>                 Target Branch, Commit or Tag.
  --end-tag=<value>                    [default: --TESTS END--] End Tag to extract test Classes
  --output-file=<path/to/output/file>  [default: ./export] Output file
  --start-tag=<value>                  [default: --TESTS START--] Start Tag to extract test Classes

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Extract Tests data from commits.

  Command to extract all test classes from commits messages from GIT differences between branches, commits or tags

EXAMPLES
  Extracting tests data from differences between branchX and main branches

    $ sf ah git tests extract -s branchX -t main

  Extracting tests data from differences between branchX and main branches with json output

    $ sf ah git tests extract -s branchX -t main --json

  Extracting tests data from differences between branchX and main branches with custom start and end tag

    $ sf ah git tests extract -s branchX -t main --start-tag \"MyCustom Test Start Tag\" --end-tag \"MyCustom Test ^
      End Tag\" --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source=<value>  Source Branch, Commit or Tag.

    Source branch, commit, tag... to extract test classes from commit messages.

  -t, --target=<value>  Target Branch, Commit or Tag.

    Target branch, commit, tag... to extract test classes from commit messages.

  --end-tag=<value>  End Tag to extract test Classes

    End Tag for Test Classes names on git commit message (default: --TESTS END--)

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output

  --start-tag=<value>  Start Tag to extract test Classes

    Start Tag for Test Classes names on git commit message. (default: --TESTS START--)
```

_See code: [lib/commands/ah/git/tests/extract.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/git/tests/extract.ts)_

## `sf ah local retrieve special`

Summary of a command.

```
USAGE
  $ sf ah local retrieve special [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [-i <value>] [--download-all]
    [-c] [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -i, --include-org=<value>          Include Org Data
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf ah local special retrieve
  $ sf ah special local retrieve
  $ sf ah local retrieve special

EXAMPLES
  Retrieve all special types with XML Compression and including org data

    $ sf ah local retrieve special --all -c -i

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah local retrieve special -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -i, --include-org=<value>  Include Org Data

    With this option, you can retrieve the data from org, but only retrieve the types that you have in your local, in
    other words, update local data with your org data

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah local special retrieve`

Summary of a command.

```
USAGE
  $ sf ah local special retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [-i <value>] [--download-all]
    [-c] [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -i, --include-org=<value>          Include Org Data
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf ah local special retrieve
  $ sf ah special local retrieve
  $ sf ah local retrieve special

EXAMPLES
  Retrieve all special types with XML Compression and including org data

    $ sf ah local special retrieve --all -c -i

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah local special retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -i, --include-org=<value>  Include Org Data

    With this option, you can retrieve the data from org, but only retrieve the types that you have in your local, in
    other words, update local data with your org data

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah logs clean`

Summary of a command.

```
USAGE
  $ sf ah logs clean -o <value> [--json] [-a <value>]

FLAGS
  -a, --api-version=<value>  API version to use if different from the default
  -o, --target-org=<value>   (required) Login username or alias for the target org

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

EXAMPLES
  $ sf ah logs clean

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org
```

_See code: [lib/commands/ah/logs/clean.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/logs/clean.ts)_

## `sf ah metadata compare`

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

```
USAGE
  $ sf ah metadata compare -o <value> [--json] [-r <value>] [-s <value>] [-a <value>] [-p] [--output-file <value>]
  [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             (required) Target Org to Compare.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source-org=<value>             Source Org to compare.
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compare Metadata Types and Objects between two orgs or between your local project and your auth org

  Command to compare your local project with your auth org for get the differences. The result are the metadata types
  and objects that you have in your org, but don't have in your local project. Also can compare between two different
  orgs and return the metadata that exists on target org but not exists on source org

ALIASES
  $ sf ah metadata compare
  $ sf ah compare metadata
  $ sf ah org compare
  $ sf ah compare org

EXAMPLES
  Compare Metadata Types and Objects between your local project and your auth org

    $ sf ah metadata compare -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between two orgs

    $ sf ah metadata compare -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

    $ sf ah metadata compare -t test.username@salesforceOrg.com.qa --csv

  Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

    $ sf ah metadata compare -t test.username@salesforceOrg.com.qa --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Target Org to Compare.

    Target Salesforce org to compare.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<value>  Source Org to compare.

    Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the
    command will compare your local project with your auth org

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah metadata local compress`

Compress XML Metadata Files.

```
USAGE
  $ sf ah metadata local compress [--json] [-r <value>] [--all | -f <value> | -d <value>] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory
  -f, --file=<path/to/file>...            Compress XML Files from specific directory
  -r, --root=<path/to/project/root>       [default: ./] Root Project Path
  --all                                   Compress All Project Files
  --sort-order=<option>                   [default: simpleFirst] Sort order for XML Files compression
                                          <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compress XML Metadata Files.

  Compress XML Metadata Files for best conflict handling with SVC systems. Works with relative or absolute paths.

ALIASES
  $ sf ah compress
  $ sf ah xml compress
  $ sf ah compress xml

EXAMPLES
  Compress all project XML Files

    $ sf ah metadata local compress -a

  Compress all XML Files from objects folder (and subfolders)

    $ sf ah metadata local compress -d force-app/main/default/objects --json

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah metadata local compress -d "force-app/main/default/objects" -d "force-app/main/default/applications"

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah metadata local compress -d "force-app/main/default/objects, force-app/main/default/applications"

  Compress specific XML File with progress report

    $ sf ah metadata local compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -p

  Compress specific XML Files with JSON output

    $ sf ah metadata local compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -f ^
      "force-app/main/default/objects/Case/Case.object-meta-xml" --json

  Compress specific XML Files with JSON output

    $ sf ah metadata local compress -f "force-app/main/default/objects/Account/Account.object-meta-xml, ^
      force-app/main/default/objects/Case/Case.object-meta-xml" --json

FLAG DESCRIPTIONS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -f, --file=<path/to/file>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --all  Compress All Project Files

    Compress all XML files with support compression in your project.

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

_See code: [lib/commands/ah/metadata/local/compress.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/compress.ts)_

## `sf ah metadata local describe`

Describe Local Metadata Types.

```
USAGE
  $ sf ah metadata local describe [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [-g] [--output-file <value>]
    [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -g, --group                          Group global Quick Actions into GlobalActions.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -t, --type=<MetadataTypeName>...     Describe the specified metadata types.
  --all                                Describe all metadata types.
  --csv                                Show result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Describe Local Metadata Types.

  Command to describe all or specific Metadata Types like Custom Objects, Custom Fields, Apex Classes... that you have
  in your local project.

EXAMPLES
  Describe all metadata types, showing progress and show result as CSV and save output as CSV

    $ sf ah metadata local describe -a -p --output-file "path/to/the/output/file.csv" --csv

  Describe all metadata types, showing progress and show result as JSON and save output as JSON

    $ sf ah metadata local describe -a -p --output-file "path/to/the/output/file.json" --json

  Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

    $ sf ah metadata local describe -t "CustomObject, CustomField, Profile, ValidationRule" -p

  Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

    $ sf ah metadata local describe -t "CustomObject" -t "CustomField" -t "Profile -t "ValidationRule" -p

  Describe CustomObject and CustomField metadata types, showing result as JSON

    $ sf ah metadata local describe -t "CustomObject, CustomField" --json

  Describe CustomObject and CustomField metadata types, showing result as JSON

    $ sf ah metadata local describe -t "CustomObject" -t "CustomField" --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -g, --group  Group global Quick Actions into GlobalActions.

    Option to group global Quick Actions into GlobalActions group, false to list as object and item.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<MetadataTypeName>...  Describe the specified metadata types.

    Describe the specified metadata types. You can select a single metadata or a list separated by commas. This option
    does not take effect if you choose describe all.

  --all  Describe all metadata types.

    Describe all metadata types stored in your local project.

  --csv  Show result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/local/describe.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/describe.ts)_

## `sf ah metadata local ignore`

Ignore Metadata from your project

```
USAGE
  $ sf ah metadata local ignore [--json] [-r <value>] [-p] [--all | -t <value>] [--file <value>] [-c] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -c, --compress                     Compress modified files.
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Ignore specific Metadata Types.
  --all                              Ignore All Metadata types on file.
  --file=<path/to/ignore/file>       [default: ./.ahignore.json] Path to the ignore file.
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Ignore Metadata from your project

  Command for ignore metadata from your project. Use .ahignore.json file for perform this operation. This command will
  be delete the ignored metadata from your project folder

EXAMPLES
  Ignore All Metadata Types on ignore file and compress modified files

    $ sf ah metadata local ignore -a -c --json

  Ignore Specific Metadata Types on ignore file with different ignore file (not default ignore file from project)

    $ sf ah metadata local ignore -t "CustomApplication, Profile, CustomLabels" -i ^
      "Path/to/the/file/.myignoreFile.json" -p

FLAG DESCRIPTIONS
  -c, --compress  Compress modified files.

    Add this option to compress modified files by ignore operation.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Ignore specific Metadata Types.

    Ignore the specified metadata types according to the ignore file. You can select a sigle or a list separated by
    commas. This options does not take effect if you choose ignore all.

  --all  Ignore All Metadata types on file.

    Ignore all metadata types according to the ignore file.

  --file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

_See code: [lib/commands/ah/metadata/local/ignore.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/ignore.ts)_

## `sf ah metadata local list`

List all Local Metadata Types.

```
USAGE
  $ sf ah metadata local list [--json] [-r <value>] [-p] [-a <value>] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all Local Metadata Types.

  Command for list all metadata from the local project.

EXAMPLES
  List Metadata Types with progress report

    $ sf ah metadata local list -p

  List Metadata Types from specific Api Version

    $ sf ah metadata local list -a "48.0"

  List Metadata Types and show as CSV

    $ sf ah metadata local list --csv

  List Metadata Types from other project and save the result in a file as JSON

    $ sf ah metadata local list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json

  List Metadata Types from other project and save the result in a file as CSV

    $ sf ah metadata local list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag.

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/local/list.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/list.ts)_

## `sf ah metadata local repair`

Check or Repair project dependencies.

```
USAGE
  $ sf ah metadata local repair [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [--only-check] [-c] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc] [--ignore] [--ignore-file <value>] [--output-file <value>]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -c, --compress                       Compress modified files.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -t, --type=<MetadataTypeName>...     Check or Repair specified metadata types.
  --all                                Check or Repair all.
  --ignore                             Ignore check or repair using Ignore File.
  --ignore-file=<path/to/ignore/file>  [default: ./.ahignore.json] Path to the ignore file.
  --only-check                         Only Check Erros.
  --output-file=<path/to/output/file>  Output file
  --sort-order=<option>                [default: simpleFirst] Sort order for XML Files compression
                                       <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Check or Repair project dependencies.

  Command to Check or Repair dependencies errors on your local project. (Only check data and types stored in your local
  project, do not connect to the org).

EXAMPLES
  Repair all suported metadata types and compress modified files

    $ sf ah metadata local repair -a -c

  Repair The Custom Application App1, All profiles, The permission Sets Perm1 and Perm2 and the Custom Field
  Custom_field\_\_c from Account object

    $ sf ah metadata local repair -t ^
      "CustomApplication:App1,Profile,PermissionSet:Perm1,PermissionSet:Perm2,CustomField:Account:Custom_field\_\_c"

  Repair The Custom Application App1, All profiles, The permission Sets Perm1 and Perm2 and the Custom Field
  Custom_field\_\_c from Account object

    $ sf ah metadata local repair -t "CustomApplication:App1" -t "Profile" -t ^
      "PermissionSet:Perm1,PermissionSet:Perm2" -t "CustomField:Account:Custom_field\_\_c"

  Repair The Custom Application App1, All profiles, The permission Sets Perm1 and Perm2 and the Custom Field
  Custom_field\_\_c from Account object

    $ sf ah metadata local repair -t "CustomApplication:App1" -t "Profile" -t "PermissionSet:Perm1" -t ^
      "PermissionSet:Perm2" -t "CustomField:Account:Custom_field\_\_c"

  Repair all profiles from the project root redirect errors to a file

    $ sf ah metadata local repair -t "Profile" --output-file "path/to/the/output/checkResult.json""

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified files.

    Add this option to compress modified files by repair operation.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<MetadataTypeName>...  Check or Repair specified metadata types.

    Check or Repair specified metadata types. You can choose single type or a list separated by commas, also you can
    choose to repair a specified objects like "MetadataTypeAPIName:MetadataObjectAPIName" or
    "MetadataTypeAPIName:ObjectAPIName:ItemAPIName". For example, "CustomApplication:AppName1" for repair only AppName1
    Custom App. This option does not take effet if select repair all

  --all  Check or Repair all.

    Check or Repair all supported metadata types. (Support up to API v53.0)

  --ignore  Ignore check or repair using Ignore File.

    Option to ignore to check or repair the metadata included in ignore file.

  --ignore-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --only-check  Only Check Erros.

    Option to check (and not repair) error dependencies and return the errors by file

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

_See code: [lib/commands/ah/metadata/local/repair.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/repair.ts)_

## `sf ah metadata local special retrieve`

Summary of a command.

```
USAGE
  $ sf ah metadata local special retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [-i <value>] [--download-all]
    [-c] [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -i, --include-org=<value>          Include Org Data
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf ah local special retrieve
  $ sf ah special local retrieve
  $ sf ah local retrieve special

EXAMPLES
  Retrieve all special types with XML Compression and including org data

    $ sf ah metadata local special retrieve --all -c -i

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah metadata local special retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -i, --include-org=<value>  Include Org Data

    With this option, you can retrieve the data from org, but only retrieve the types that you have in your local, in
    other words, update local data with your org data

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

_See code: [lib/commands/ah/metadata/local/special/retrieve.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/local/special/retrieve.ts)_

## `sf ah metadata org apex execute`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah metadata org apex execute --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah metadata org apex execute -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah metadata org apex execute -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

_See code: [lib/commands/ah/metadata/org/apex/execute.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/apex/execute.ts)_

## `sf ah metadata org apex tests extract`

Command to extract a map of the system classes and their test classes (a test execution must have been run previously)

```
USAGE
  $ sf ah metadata org apex tests extract -o <value> [--json] [-a <value>] [--output-dir <value>] [--filename <value>]
  [--save-result]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -o, --target-org=<value>           (required) Login username or alias for the target org
  --filename=<value>                 Filename to save the output
  --output-dir=<path/to/output/dir>  [default: ./] Output directory
  --save-result                      Flag to indicate if the result should be saved in a file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Command to extract a map of the system classes and their test classes (a test execution must have been run previously)

  Command to extract a map of the system classes and their test classes (a test execution must have been run previously)

EXAMPLES
  $ sf ah metadata org apex tests extract

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  --filename=<value>  Filename to save the output

    Filename to save the output

  --output-dir=<path/to/output/dir>  Output directory

    Path to directory to save the output

  --save-result  Flag to indicate if the result should be saved in a file

    Flag to indicate if the result should be saved in a file
```

_See code: [lib/commands/ah/metadata/org/apex/tests/extract.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/apex/tests/extract.ts)_

## `sf ah metadata org compare`

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

```
USAGE
  $ sf ah metadata org compare -o <value> [--json] [-r <value>] [-s <value>] [-a <value>] [-p] [--output-file <value>]
  [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             (required) Target Org to Compare.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source-org=<value>             Source Org to compare.
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compare Metadata Types and Objects between two orgs or between your local project and your auth org

  Command to compare your local project with your auth org for get the differences. The result are the metadata types
  and objects that you have in your org, but don't have in your local project. Also can compare between two different
  orgs and return the metadata that exists on target org but not exists on source org

ALIASES
  $ sf ah metadata compare
  $ sf ah compare metadata
  $ sf ah org compare
  $ sf ah compare org

EXAMPLES
  Compare Metadata Types and Objects between your local project and your auth org

    $ sf ah metadata org compare -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between two orgs

    $ sf ah metadata org compare -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

    $ sf ah metadata org compare -t test.username@salesforceOrg.com.qa --csv

  Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

    $ sf ah metadata org compare -t test.username@salesforceOrg.com.qa --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Target Org to Compare.

    Target Salesforce org to compare.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<value>  Source Org to compare.

    Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the
    command will compare your local project with your auth org

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/org/compare.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/compare.ts)_

## `sf ah metadata org describe`

Describe Local Metadata Types.

```
USAGE
  $ sf ah metadata org describe [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--all | -t <value>] [-g]
    [--download-all] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -g, --group                          Group global Quick Actions into GlobalActions.
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -t, --type=<MetadataTypeName>...     Describe the specified metadata types.
  --all                                Describe all metadata types.
  --csv                                Show result as CSV.
  --download-all                       Download from All Namespaces
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Describe Local Metadata Types.

  Command to describe all or specific Metadata Types likes Custom Objects, Custom Fields, Apex Classes... that you have
  in your auth org

EXAMPLES
  Describe all metadata types, showing progress and show result as CSV and save output as CSV

    $ sf ah metadata org describe -a -p --output-file "path/to/the/output/file.csv" --csv

  Describe all metadata types, showing progress and show result as JSON and save output as JSON

    $ sf ah metadata org describe -a -p --output-file "path/to/the/output/file.json" --json

  Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

    $ sf ah metadata org describe -t "CustomObject, CustomField, Profile, ValidationRule" -p

  Describe CustomObject, CustomField, Profile and ValidationRule metadata types, showing progress and result as table

    $ sf ah metadata org describe -t "CustomObject" .-t "CustomField" -t "Profile" -t "ValidationRule" -p

  Describe CustomObject and CustomField metadata types, showing result as JSON

    $ sf ah metadata org describe -t "CustomObject, CustomField" --json

  Describe CustomObject and CustomField metadata types, showing result as JSON

    $ sf ah metadata org describe -t "CustomObject" -t "CustomField" --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -g, --group  Group global Quick Actions into GlobalActions.

    Option to group global Quick Actions into GlobalActions group, false to list as object and item.

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<MetadataTypeName>...  Describe the specified metadata types.

    Describe the specified metadata types. You can select a single metadata or a list separated by commas. This option
    does not take effect if you choose describe all

  --all  Describe all metadata types.

    Describe all metadata types from your auth org.

  --csv  Show result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/org/describe.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/describe.ts)_

## `sf ah metadata org list`

List all Metadata Types from the auth org.

```
USAGE
  $ sf ah metadata org list [--json] [-r <value>] [-o <value>] [-p] [-a <value>] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all Metadata Types from the auth org.

  Command for list all metadata from the auth org

EXAMPLES
  List Metadata Types with progress report

    $ sf ah metadata org list -p

  List Metadata Types from specific Api Version

    $ sf ah metadata org list -a "48.0"

  List Metadata Types and show as CSV

    $ sf ah metadata org list --csv

  List Metadata Types from other project and save the result in a file as JSON

    $ sf ah metadata org list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --json

  List Metadata Types from other project and save the result in a file as CSV

    $ sf ah metadata org list -r "path/to/other/project/root" --outputfile "path/to/the/output/file.txt" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag.

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/org/list.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/list.ts)_

## `sf ah metadata org permissions get`

Get All Available User Permissions

```
USAGE
  $ sf ah metadata org permissions get [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>]
  [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah metadata org permissions get --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah metadata org permissions get

  Get all available User permisions in your org and save output as JSON

    $ sf ah metadata org permissions get --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah metadata org permissions get --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

_See code: [lib/commands/ah/metadata/org/permissions/get.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/permissions/get.ts)_

## `sf ah metadata org special retrieve`

Retrieve Special Metadata Types.

```
USAGE
  $ sf ah metadata org special retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [--download-all] [-c]
    [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Retrieve Special Metadata Types.

  Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at
  runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For
  example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you
  can retrieve only the Custom Object XML Files without retrieve anything more.

ALIASES
  $ sf ah org special retrieve
  $ sf ah special org retrieve
  $ sf ah org retrieve special

EXAMPLES
  Retrieve all special types with XML Compression

    $ sf ah metadata org special retrieve --all -c

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah metadata org special retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

_See code: [lib/commands/ah/metadata/org/special/retrieve.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/metadata/org/special/retrieve.ts)_

## `sf ah org apex execute`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah org apex execute --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah org apex execute -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah org apex execute -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah org compare`

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

```
USAGE
  $ sf ah org compare -o <value> [--json] [-r <value>] [-s <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             (required) Target Org to Compare.
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  -s, --source-org=<value>             Source Org to compare.
  --csv                                Show the result as CSV
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compare Metadata Types and Objects between two orgs or between your local project and your auth org

  Command to compare your local project with your auth org for get the differences. The result are the metadata types
  and objects that you have in your org, but don't have in your local project. Also can compare between two different
  orgs and return the metadata that exists on target org but not exists on source org

ALIASES
  $ sf ah metadata compare
  $ sf ah compare metadata
  $ sf ah org compare
  $ sf ah compare org

EXAMPLES
  Compare Metadata Types and Objects between your local project and your auth org

    $ sf ah org compare -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between two orgs

    $ sf ah org compare -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

  Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

    $ sf ah org compare -t test.username@salesforceOrg.com.qa --csv

  Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

    $ sf ah org compare -t test.username@salesforceOrg.com.qa --json

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Target Org to Compare.

    Target Salesforce org to compare.

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source-org=<value>  Source Org to compare.

    Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the
    command will compare your local project with your auth org

  --csv  Show the result as CSV

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah org execute apex`

Execute Anonymous Apex N Times.

```
USAGE
  $ sf ah org execute apex --file <value> [--json] [-r <value>] [-o <value>] [-a <value>] [-i <value>] [-l -p]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -i, --iterations=<value>           [default: 1] Script execution number
  -l, --print-log                    Print Log every execution
  -o, --target-org=<value>           Login username or alias for the target org
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --file=<path/to/apex/file>         (required) Script File Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute Anonymous Apex N Times.

  Command to execute an Anonymous Apex script from file against the auth org N times.

ALIASES
  $ sf ah execute org apex
  $ sf ah execute apex org
  $ sf ah apex execute org
  $ sf ah apex org execute
  $ sf ah org execute apex
  $ sf ah org apex execute
  $ sf ah apex execute
  $ sf ah execute apex

EXAMPLES
  Execute a script 3 times

    $ sf ah org execute apex -f "path/to/script.apex" -i 3

  Execute a script 10 times and print the execution log

    $ sf ah org execute apex -f "path/to/script.apex" --iterations 10 --print-log

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -i, --iterations=<value>  Script execution number

    Option to select the scritp execution number. For example, 3 for execute the script 3 times

  -l, --print-log  Print Log every execution

    Option to print the result log of every execution. Depends on --progress flag

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --file=<path/to/apex/file>  Script File Path

    Path to the Anonymous Apex Script file
```

## `sf ah org get permissions`

Get All Available User Permissions

```
USAGE
  $ sf ah org get permissions [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah org get permissions --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah org get permissions

  Get all available User permisions in your org and save output as JSON

    $ sf ah org get permissions --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah org get permissions --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah org permissions get`

Get All Available User Permissions

```
USAGE
  $ sf ah org permissions get [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah org permissions get --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah org permissions get

  Get all available User permisions in your org and save output as JSON

    $ sf ah org permissions get --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah org permissions get --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah org retrieve special`

Retrieve Special Metadata Types.

```
USAGE
  $ sf ah org retrieve special [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [--download-all] [-c]
    [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Retrieve Special Metadata Types.

  Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at
  runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For
  example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you
  can retrieve only the Custom Object XML Files without retrieve anything more.

ALIASES
  $ sf ah org special retrieve
  $ sf ah special org retrieve
  $ sf ah org retrieve special

EXAMPLES
  Retrieve all special types with XML Compression

    $ sf ah org retrieve special --all -c

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah org retrieve special -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah org special retrieve`

Retrieve Special Metadata Types.

```
USAGE
  $ sf ah org special retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [--download-all] [-c]
    [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Retrieve Special Metadata Types.

  Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at
  runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For
  example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you
  can retrieve only the Custom Object XML Files without retrieve anything more.

ALIASES
  $ sf ah org special retrieve
  $ sf ah special org retrieve
  $ sf ah org retrieve special

EXAMPLES
  Retrieve all special types with XML Compression

    $ sf ah org special retrieve --all -c

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah org special retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah package git create`

Create a Package XML file and/or Destructive XML file from Git Changes

```
USAGE
  $ sf ah package git create [--json] [-r <value>] [-a <value>] [-p] [--type
    package|PACKAGE|p|P|destructive|DESTRUCTIVE|d|D|both|BOTH|b|B] [-s <value>] [-t <value>] [--raw] [--ignore]
    [--ignore-file <value>] [--ignore-destructive] [--ignore-destructive-file <value>] [--output-dir <value>] [-b]

FLAGS
  -a, --api-version=<value>                        API version to use if different from the default
  -b, --delete-before                              Create Destructive XML file to delete files before deploy new
                                                   changes.
  -p, --progress                                   Report Command Progress
  -r, --root=<path/to/project/root>                [default: ./] Root Project Path
  -s, --source=<value>                             Source branch, commit, tag... to compare changes and create delta
                                                   files.
  -t, --target=<value>                             Source branch, commit, tag... to compare changes and create delta
                                                   files.
  --ignore                                         Use ignore file to ignore metadata types.
  --ignore-destructive                             Use Ignore fie to ignore metadata to delete.
  --ignore-destructive-file=<path/to/ignore/file>  [default: ./.ahignore.json] Path to the ignore file.
  --ignore-file=<path/to/ignore/file>              [default: ./.ahignore.json] Path to the ignore file.
  --output-dir=<path/to/output/file>               [default: ./] Generated Files Output Path
  --raw                                            Return the raw data instead create xml files.
  --type=<fileTypeValue>                           [default: both] Merge Files Strategy

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a Package XML file and/or Destructive XML file from Git Changes

  Create a Package XML file and/or Destructive XML file from Git Changes to create a delta package to deploy and/or
  delete Metadata. Compare between two branches, commits or tags (even only your active branch) to create the files

EXAMPLES
  Create package and destructive files from active branch changes

    $ sf ah package git create

  Create package and destructive files from changes between active branch and Develop

    $ sf ah package git create --type both -t Develop --json"

  Create only the package file from changes between two commits

    $ sf ah package git create --type package -s 1n3a5d3 -t 4a345da"

  Create only the destructive file from changes between two tags

    $ sf ah package git create --type destructive --deletebefore -s v2.0.0 -t v1.0.0 --raw --json"

  Create package and destructive files from changes between UAT branch and main branch, ignoring metadata on
  destructive with from custom ahignore file

    $ sf ah package git create --type both -s UAT -t main -u --ignoredestructive --destructiveignorefile ^
      "./.ahignoreDestructive.json" --json"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -b, --delete-before  Create Destructive XML file to delete files before deploy new changes.

    Option to create the Descructive XML file to deploy it before package file (delete files before deploy new changes
    insted delete files after deploy changes).

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source=<value>  Source branch, commit, tag... to compare changes and create delta files.

    Source branch, commit, tag... to compare changes and create delta files. That is the new code source or the "source
    salesforce org to get changes". You can select only source to create files from active branch changes (If not select
    source, also get the active branch)

  -t, --target=<value>  Source branch, commit, tag... to compare changes and create delta files.

    Target branch, commit, tag... to compare changes and create delta files. That is the old code source or the "target
    salesforce org to deploy changes"

  --ignore  Use ignore file to ignore metadata types.

    Use ignore file to ignore metadata types from package file.

  --ignore-destructive  Use Ignore fie to ignore metadata to delete.

    Use ignore file to ignore metadata types from destructive file.

  --ignore-destructive-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --ignore-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --output-dir=<path/to/output/file>  Generated Files Output Path

    Path to save the generated files. By default save result on <actualDir>

  --raw  Return the raw data instead create xml files.

    Option to return the raw data instead create xml files. This option returns a JSON Object with the extracted data
    from git changes. Only work with --json flag

  --type=<fileTypeValue>  Merge Files Strategy

    Option to choose the generated file type(s). The options are:

    - both (b): Generate both package and destructive files. Default option.
    - package (p): Generate only package file.
    - destructive (d): Generate only destructive file.
```

_See code: [lib/commands/ah/package/git/create.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/package/git/create.ts)_

## `sf ah package json convert`

Command to convert a package file to metadata types json format to analyze the package contents.

```
USAGE
  $ sf ah package json convert [--json] [--output-dir <value>] [--input-file <value>] [--filename <value>] [--save-result
    <value>]

FLAGS
  --filename=<value>                    Filename to save the output
  --input-file=<path/to/package/file>   Package file to convert to metadata types json format.
  --output-dir=<path/to/output/file>    [default: ./] Output directory
  --save-result=<path/to/package/file>  Flag to indicate if the result should be saved in a file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Command to convert a package file to metadata types json format to analyze the package contents.

  Command to convert a package file to metadata types json format to analyze the package contents.

EXAMPLES
  $ sf ah package json convert

FLAG DESCRIPTIONS
  --filename=<value>  Filename to save the output

    Filename to save the output

  --input-file=<path/to/package/file>  Package file to convert to metadata types json format.

    Package file to convert to metadata types json format.

  --output-dir=<path/to/output/file>  Output directory

    Path to directory to save the output

  --save-result=<path/to/package/file>  Flag to indicate if the result should be saved in a file

    Flag to indicate if the result should be saved in a file
```

_See code: [lib/commands/ah/package/json/convert.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/package/json/convert.ts)_

## `sf ah package json create`

Create a Package XML file or Destructive XML file from Aura Helper JSON

```
USAGE
  $ sf ah package json create -s <value> [--json] [-r <value>] [-a <value>] [-p] [--ignore] [--ignore-file <value>] [-b]
    [-d] [-w] [--output-dir <value>]

FLAGS
  -a, --api-version=<value>             API version to use if different from the default
  -b, --delete-before                   Create Destructive XML file to delete files before deploy new changes.
  -d, --to-delete                       Create a Destructive XML file to delete metadata
  -p, --progress                        Report Command Progress
  -r, --root=<path/to/project/root>     [default: ./] Root Project Path
  -s, --source=<path/to/metadata/json>  (required) Source JSON file
  -w, --wildcards                       Use wildcards when apply
  --ignore                              Use ignore file to ignore metadata types.
  --ignore-file=<path/to/ignore/file>   [default: ./.ahignore.json] Path to the ignore file.
  --output-dir=<path/to/output/file>    [default: ./] Generated Files Output Path

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a Package XML file or Destructive XML file from Aura Helper JSON

  Create a Package XML file or Destructive XML file from Aura Helper JSON Metadata File

EXAMPLES
  Create package file from Aura Helper JSON file

    $ sf ah package json create -s path/to/metadata/json/file.json

  Create package file from Aura Helper JSON file and ignoring metadata types using the default ignore file

    $ sf ah package json create -s path/to/metadata/json/file.json --ignore

  Create destructive file to delete after deploy changes from Aura Helper JSON file and ignoring metadata types using
  the default ignore file

    $ sf ah package json create -s path/to/metadata/json/file.json --to-delete --ignore

  Create destructive file to delete before deploy changes from Aura Helper JSON file and ignoring metadata types using
  the default ignore file

    $ sf ah package json create -s path/to/metadata/json/file.json --to-delete --delete-before

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -b, --delete-before  Create Destructive XML file to delete files before deploy new changes.

    Option to create the Descructive XML file to deploy it before package file (delete files before deploy new changes
    insted delete files after deploy changes).

  -d, --to-delete  Create a Destructive XML file to delete metadata

    Option to create the package to delete metadata (Destructive XML File)

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -s, --source=<path/to/metadata/json>  Source JSON file

    Metadata JSON file path to create the Package or Destructive file

  -w, --wildcards  Use wildcards when apply

    Option to use wildcards instead the explicit names when apply

  --ignore  Use ignore file to ignore metadata types.

    Use ignore file to ignore metadata types from package file.

  --ignore-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --output-dir=<path/to/output/file>  Generated Files Output Path

    Path to save the generated files. By default save result on <actualDir>
```

_See code: [lib/commands/ah/package/json/create.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/package/json/create.ts)_

## `sf ah package merge`

Create Package or Destructive XML files from several package or destructive files.

```
USAGE
  $ sf ah package merge -f <value> [--json] [-r <value>] [-a <value>] [-p] [-b] [--ignore] [--ignore-file <value>]
    [--ignore-destructive] [--ignore-destructive-file <value>] [--output-dir <value>] [--strategy
    by-type|BY-TYPE|b|B|only-package|ONLY-PACKAGE|p|P|only-destructive|ONLY-DESTRUCTIVE|d|D|full-package|FULL-PACKAGE|fp
    |FP|full-destructive|FULL-DESTRUCTIVE|fd|FD]

FLAGS
  -a, --api-version=<value>                        API version to use if different from the default
  -b, --delete-before                              Create Destructive XML file to delete files before deploy new
                                                   changes.
  -f, --file=<value>...                            (required) Paths to the package XML and/or Destructive files to Merge
  -p, --progress                                   Report Command Progress
  -r, --root=<path/to/project/root>                [default: ./] Root Project Path
  --ignore                                         Use ignore file to ignore metadata types.
  --ignore-destructive                             Use Ignore fie to ignore metadata to delete.
  --ignore-destructive-file=<path/to/ignore/file>  [default: ./.ahignore.json] Path to the ignore file.
  --ignore-file=<path/to/ignore/file>              [default: ./.ahignore.json] Path to the ignore file.
  --output-dir=<path/to/output/file>               [default: ./] Generated Files Output Path
  --strategy=<strategy>                            [default: by-type] Merge Files Strategy

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create Package or Destructive XML files from several package or destructive files.

  Create a Package XML file and/or Destructive XML file(s) from several package or destructive files. You can choose to
  many options to create the files.

EXAMPLES
  Merge two package files and two destructive files into one package and one destructive file to delete files after
  deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml"

  Merge two package files and two destructive files into one package and one destructive file to delete files before
  deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "by-type" --delete-before

  Merge only package files into one package file

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "only-package"

  Merge only the destructive files into one destructive file to delete files after deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "only-destructive"

  Merge only the destructive files into one destructive file to delete files before deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "only-destructive" --delete-before

  Merge all files into one package file

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "full-package"

  Merge all files into destructive file to delete files after deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "full-destructive"

  Merge all files files into destructive file to delete files before deploy

    $ sf ah package merge -s "path/to/package1.xml, path/to/package2.xml, path/to/destructiveChanges1.xml, ^
      path/to/destructiveChangesPost1.xml" --strategy "full-destructive" --delete-before

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -b, --delete-before  Create Destructive XML file to delete files before deploy new changes.

    Option to create the Descructive XML file to deploy it before package file (delete files before deploy new changes
    insted delete files after deploy changes).

  -f, --file=<value>...  Paths to the package XML and/or Destructive files to Merge

    Paths to the package XML and/or Destructive XML files to merge separated by commas

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --ignore  Use ignore file to ignore metadata types.

    Use ignore file to ignore metadata types from package file.

  --ignore-destructive  Use Ignore fie to ignore metadata to delete.

    Use ignore file to ignore metadata types from destructive file.

  --ignore-destructive-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --ignore-file=<path/to/ignore/file>  Path to the ignore file.

    Path to the ignore file. Use this if you not want to use the project root ignore file or have different name. By
    default use .ahignore.json file from your project root

  --output-dir=<path/to/output/file>  Generated Files Output Path

    Path to save the generated files. By default save result on <actualDir>

  --strategy=<strategy>  Merge Files Strategy

    Merge Files Strategy. You can merge the selected files using different strategies. The options are:

    - by-type (t): Merge files by type, that is, the package XML files into ine package xml file and destructive files
    into one destructive. Default option.
    - only-package (p): Merge only package files into one package file.
    - only-destructive (d): Merge only destructive files into one destructive file.
    - full-package (fp): Merge all files into one package file.
    - full-destructive (fd): Merge all files into one destructive file.
```

_See code: [lib/commands/ah/package/merge.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/package/merge.ts)_

## `sf ah permissions get org`

Get All Available User Permissions

```
USAGE
  $ sf ah permissions get org [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah permissions get org --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah permissions get org

  Get all available User permisions in your org and save output as JSON

    $ sf ah permissions get org --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah permissions get org --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah permissions org get`

Get All Available User Permissions

```
USAGE
  $ sf ah permissions org get [--json] [-r <value>] [-o <value>] [-a <value>] [-p] [--output-file <value>] [--csv]

FLAGS
  -a, --api-version=<value>            API version to use if different from the default
  -o, --target-org=<value>             Login username or alias for the target org
  -p, --progress                       Report Command Progress
  -r, --root=<path/to/project/root>    [default: ./] Root Project Path
  --csv                                Show Result as CSV.
  --output-file=<path/to/output/file>  Output file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get All Available User Permissions

  Command to get all available User permisions in your org

ALIASES
  $ sf ah org permissions get
  $ sf ah org get permissions
  $ sf ah get org permissions
  $ sf ah get permissions org
  $ sf ah permissions org get
  $ sf ah permissions get org

EXAMPLES
  Get all available User permisions in your org and show the result as JSON

    $ sf ah permissions org get --json

  Get all available User permisions in your org and show the result as Table

    $ sf ah permissions org get

  Get all available User permisions in your org and save output as JSON

    $ sf ah permissions org get --output-file "path/to/the/output/permissions.json" --json

  Get all available User permisions in your org and save output as CSV

    $ sf ah permissions org get --output-file "path/to/the/output/permissions.json" --csv

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -o, --target-org=<value>  Login username or alias for the target org

    Overrides your default org

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --csv  Show Result as CSV.

    Option to show the result as CSV instead a table if not select --json flag

  --output-file=<path/to/output/file>  Output file

    Path to file for redirect the output
```

## `sf ah scan report open`

Open an Aura Helper Code Analysis Report on a local server.

```
USAGE
  $ sf ah scan report open [-i <value>] [-p <value>]

FLAGS
  -i, --input-dir=<path/to/report/directory>  [default: ./] Path to the report folder to open
  -p, --port=<port>                           [default: 5000] Port to use for the server

DESCRIPTION
  Open an Aura Helper Code Analysis Report on a local server.

  Open an Aura Helper Code Analysis Report to view the results of the scan. To close the server report, press Ctrl+C in
  the terminal window.

EXAMPLES
  Open the report on the current folder

    $ sf ah scan report open

  Open the report on the folder "path/reports"

    $ sf ah scan report open --input-dir "path/reports"

  Open the report on the folder "path/reports" and running on custom port

    $ sf ah scan report open --input-dir "path/reports" --port 7500

FLAG DESCRIPTIONS
  -i, --input-dir=<path/to/report/directory>  Path to the report folder to open

    Path to the report folder to open. Defaults to the current working directory.

  -p, --port=<port>  Port to use for the server

    Port to use for the server. Defaults to 5000.
```

_See code: [lib/commands/ah/scan/report/open.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/scan/report/open.ts)_

## `sf ah scan report quality`

Set Custom Quality Gates for the selected project.

```
USAGE
  $ sf ah scan report quality [--json] [-r <value>] [-i] [--max-debt <value>] [--max-bugs <value>] [--max-blockers <value>]
    [--max-criticals <value>] [--max-majors <value>] [--max-minors <value>] [--max-infos <value>]

FLAGS
  -i, --[no-]interactive             Run command in interactive mode.
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  --max-blockers=<number>            Set the maximum blockers to check on scan report.
  --max-bugs=<number>                Set the maximum bugs to check on scan report.
  --max-criticals=<number>           Set the maximum criticals to check on scan report.
  --max-debt=<1Y 1M 1W 1D 1h 1m>     Set the maximum technical debt to check on scan report.
  --max-infos=<number>               Set the maximum infos to check on scan report.
  --max-majors=<number>              Set the maximum majors to check on scan report.
  --max-minors=<number>              Set the maximum minors to check on scan report.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set Custom Quality Gates for the selected project.

  Set your Custom Quality Gates for the selected project. Only one custom quality gate by project. The Quality Gate is
  used by the command `scan:report` to process the results and finish the scan with pass or not pass result, depending
  on the results of the Quality Gate.

EXAMPLES
  Set the quality gate for the current folder project. The command run in interactive mode, that is, the command will
  ask for the values of the quality gate for every measure.

    $ sf ah scan report quality

  Set the quality gate for the selected project.

    $ sf ah scan report quality --root 'path/to/project/folder' --interactive

  Set the quality gate for the selected project. This command is not interactive (best for CI/CD). The command wil set
  the specified values for the quality gate. If the values are not specified, the measure not take effect on reports,
  that is, always pass the measures you need to check because all not specified measures are set to Not Defined.

    $ sf ah scan report quality --root 'path/to/project/folder' --max-debt "1Y 2M 3W 4D 5h 6m" --max-bugs 10 ^
      --max-blockers 10 --max-criticals 10 --max-majors 10 --max-minors 10 --max-infos 10

FLAG DESCRIPTIONS
  -i, --[no-]interactive  Run command in interactive mode.

    Run command in interactive mode. If the flag is not present, the command will use the default values for the flags.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --max-blockers=<number>  Set the maximum blockers to check on scan report.

    Set the maximum blockers to check on scan report. If the blockers are greater than the maximum, the scan will finish
    with not passed result. By default use the maximum blockers of the selected Quality Gate.

  --max-bugs=<number>  Set the maximum bugs to check on scan report.

    Set the maximum bugs to check on scan report. If the bugs are greater than the maximum, the scan will finish with
    not passed result. By default use the maximum bugs of the selected Quality Gate.

  --max-criticals=<number>  Set the maximum criticals to check on scan report.

    Set the maximum criticals to check on scan report. If the criticals are greater than the maximum, the scan will
    finish with not passed result. By default use the maximum criticals of the selected Quality Gate.

  --max-debt=<1Y 1M 1W 1D 1h 1m>  Set the maximum technical debt to check on scan report.

    Set the maximum technical debt to check on scan report. If the technical debt is greater than the maximum, the scan
    will finish with not passed result. By default use the maximum technical debt of the selected Quality Gate.

  --max-infos=<number>  Set the maximum infos to check on scan report.

    Set the maximum infos to check on scan report. If the infos are greater than the maximum, the scan will finish with
    not passed result. By default use the maximum infos of the selected Quality Gate.

  --max-majors=<number>  Set the maximum majors to check on scan report.

    Set the maximum majors to check on scan report. If the majors are greater than the maximum, the scan will finish
    with not passed result. By default use the maximum majors of the selected Quality Gate.

  --max-minors=<number>  Set the maximum minors to check on scan report.

    Set the maximum minors to check on scan report. If the minors are greater than the maximum, the scan will finish
    with not passed result. By default use the maximum minors of the selected Quality Gate.
```

_See code: [lib/commands/ah/scan/report/quality.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/scan/report/quality.ts)_

## `sf ah scan report run`

Execute an entire project code analisys and generate report

```
USAGE
  $ sf ah scan report run [--json] [-r <value>] [-p] [--output-dir <value>] [--categories Design|Best
    Practices|Security|Performance|Code Style|Documentation|Error Prone|problem|suggestion|Insecure Dependencies]
    [--pmd-rule-set <value>] [--eslint-rule-set <value>] [-q <value>] [--open]

FLAGS
  -p, --progress                             Report Command Progress
  -q, --quality-gate=<quality-gate>          [default: Relaxed] Quality Gate to finish the scan with error
  -r, --root=<path/to/project/root>          [default: ./] Root Project Path
  --categories=<category1,category2,...>...  Categories to analize
  --eslint-rule-set=<path/to/eslint/file>    eslint Custom Rule Set File
  --open                                     Open the generated report
  --output-dir=<path/to/output/file>         [default: ./ScanResult] Generated Files Output Path
  --pmd-rule-set=<path/to/pmd/file>          PMD Custom Rule Set File

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute an entire project code analisys and generate report

  Execute an entire project code analisys and generate a complex and navigable report in HTML like SonarQube or Similars

EXAMPLES
  Running a report for the current folder project and save the results on the default folder

    $ sf ah scan report run

  Running a report for the current folder project and save the results on the default folder and get results as JSON
  (for CI/CD)

    $ sf ah scan report run --output-dir "/path/to/output/folder" --json

  Running a report only for the Security and Performance categories

    $ sf ah scan report run --output-dir "/path/to/output/folder" --categories "Security,Performance"

  Running a report for all categories except Security

    $ sf ah scan report run --output-dir "/path/to/output/folder" --categories "!Security"

  Running a report with the Auta Helper Moderate Quality Gate

    $ sf ah scan report run --output-dir "/path/to/output/folder" --quality-gate Moderate

  Running a report with the project custom Quality Gate. Can create custom quality gates using the command "sf ah scan
  report quality"

    $ sf ah scan report run --output-dir "/path/to/output/folder" --quality-gate Custom

FLAG DESCRIPTIONS
  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -q, --quality-gate=<quality-gate>  Quality Gate to finish the scan with error

    Quality Gate to finish the scan with error. By default use the Low Aura Helper Quality Gate. Available Quality
    Gates: Strict, High, Moderate, Relaxed, Custom. Also can create or modify your custom quality gates for any project.
    Only one custom qualitu gate by project.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --categories=<category1,category2,...>...  Categories to analize

    Categories to analize. By default analize all categories. Available categories: Design,Best
    Practices,Security,Performance,Code Style,Documentation,Error Prone,problem,suggestion,Insecure Dependencies. You
    can use a comma separated list to select multiple categories (e.g. --categories=Security,Performance) or use the
    flag multiple times (e.g. --categories=Security --categories=Performance)

  --eslint-rule-set=<path/to/eslint/file>  eslint Custom Rule Set File

    eslint Custom Rule Set File. By default use the default Rule Set file of Salesforce Code Analizer

  --open  Open the generated report

    Open Automatically the generated report when finish the scan in the default browser.

  --output-dir=<path/to/output/file>  Generated Files Output Path

    Path to save the generated output files. By default save result on <actualDir>/ScanResult

  --pmd-rule-set=<path/to/pmd/file>  PMD Custom Rule Set File

    PMD Custom Rule Set File. By default use the default Rule Set file of Salesforce Code Analizer
```

_See code: [lib/commands/ah/scan/report/run.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/scan/report/run.ts)_

## `sf ah special local retrieve`

Summary of a command.

```
USAGE
  $ sf ah special local retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [-i <value>] [--download-all]
    [-c] [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -i, --include-org=<value>          Include Org Data
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  More information about a command. Don't repeat the summary.

ALIASES
  $ sf ah local special retrieve
  $ sf ah special local retrieve
  $ sf ah local retrieve special

EXAMPLES
  Retrieve all special types with XML Compression and including org data

    $ sf ah special local retrieve --all -c -i

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah special local retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -i, --include-org=<value>  Include Org Data

    With this option, you can retrieve the data from org, but only retrieve the types that you have in your local, in
    other words, update local data with your org data

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah special org retrieve`

Retrieve Special Metadata Types.

```
USAGE
  $ sf ah special org retrieve [--json] [-r <value>] [-a <value>] [-p] [--all | -t <value>] [--download-all] [-c]
    [--sort-order simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -a, --api-version=<value>          API version to use if different from the default
  -c, --compress                     Compress modified XML Files
  -p, --progress                     Report Command Progress
  -r, --root=<path/to/project/root>  [default: ./] Root Project Path
  -t, --type=<value>                 Retrieve Specifics Metadata Types.
  --all                              Retrieve all.
  --download-all                     Download from All Namespaces
  --sort-order=<option>              [default: simpleFirst] Sort order for XML Files compression
                                     <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Retrieve Special Metadata Types.

  Command to retrieve the special metadata types stored in your auth org. The special types are all types generated at
  runtime when retrieving metadata according the package data. Files like permission sets, profiles or translations. For
  example, with this command you can retrieve all permissions from a profile without retrieve anything more. Also you
  can retrieve only the Custom Object XML Files without retrieve anything more.

ALIASES
  $ sf ah org special retrieve
  $ sf ah special org retrieve
  $ sf ah org retrieve special

EXAMPLES
  Retrieve all special types with XML Compression

    $ sf ah special org retrieve --all -c

  Retrieve specific metadata types. Retrive all Profiles, Two Permission Sets (Perm1, Perm2) and Some Record Types
  (All Case RecordTypes and RTName Record Type from Account)

    $ sf ah special org retrieve -t "Profile, PermissionSet:Perm1, PermissionSet:Perm2, RecordType:Case, ^
      RecordType:Account:RtName"

FLAG DESCRIPTIONS
  -a, --api-version=<value>  API version to use if different from the default

    API version to use if different from the default

  -c, --compress  Compress modified XML Files

    Add this option to compress modified files by retrieve operation

  -p, --progress  Report Command Progress

    Option to report the command progress (into the selected format) or show a spinner loader

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  -t, --type=<value>  Retrieve Specifics Metadata Types.

    Retrieve specifics metadata types. You can choose one or a comma separated list of elements. Also you can choose
    retrieve a specific profile, object o record type. Schema -> "Type1" or "Type1,Type2" or "Type1:Object1,
    Type1:Object2" or "Type1:Object1:Item1" for example: "Profile, PermissinSet" to retrieve all profiles and permission
    sets. "Profile:Admin" to retrieve the admin profile. "RecordType:Account:RecordType1" to retrieve the RecordType1
    for the object Account or "RecordType:Account" to retrieve all Record Types for Account

  --all  Retrieve all.

    Retrieve all supported Metadata Types (Profile,PermissionSet,Translations,RecordType,CustomObject)

  --download-all  Download from All Namespaces

    Option to download all Metadata Types from any Namespaces (including managed packages). If this options is not
    selected, only download and retrieve data from your org namespace

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

## `sf ah version`

Get Installed Aura Helper SF Version.

```
USAGE
  $ sf ah version [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get Installed Aura Helper SF Version.

  Command for get the installed Aura Helper SF version.

EXAMPLES
  Get the installed Aura Helper SF version.

    $ sf ah version

  Get the installed Aura Helper SF version in JSON format.

    $ sf ah version --json
```

_See code: [lib/commands/ah/version.ts](https://github.com/JJLongoria/sf-aura-helper/blob/v1.3.0/lib/commands/ah/version.ts)_

## `sf ah xml compress`

Compress XML Metadata Files.

```
USAGE
  $ sf ah xml compress [--json] [-r <value>] [--all | -f <value> | -d <value>] [--sort-order
    simpleFirst|complexFirst|alphabetAsc|alphabetDesc]

FLAGS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory
  -f, --file=<path/to/file>...            Compress XML Files from specific directory
  -r, --root=<path/to/project/root>       [default: ./] Root Project Path
  --all                                   Compress All Project Files
  --sort-order=<option>                   [default: simpleFirst] Sort order for XML Files compression
                                          <options: simpleFirst|complexFirst|alphabetAsc|alphabetDesc>

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Compress XML Metadata Files.

  Compress XML Metadata Files for best conflict handling with SVC systems. Works with relative or absolute paths.

ALIASES
  $ sf ah compress
  $ sf ah xml compress
  $ sf ah compress xml

EXAMPLES
  Compress all project XML Files

    $ sf ah xml compress -a

  Compress all XML Files from objects folder (and subfolders)

    $ sf ah xml compress -d force-app/main/default/objects --json

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah xml compress -d "force-app/main/default/objects" -d "force-app/main/default/applications"

  Compress all XML Files from objects folder (and subfolders) and applications folder

    $ sf ah xml compress -d "force-app/main/default/objects, force-app/main/default/applications"

  Compress specific XML File with progress report

    $ sf ah xml compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -p

  Compress specific XML Files with JSON output

    $ sf ah xml compress -f "force-app/main/default/objects/Account/Account.object-meta-xml" -f ^
      "force-app/main/default/objects/Case/Case.object-meta-xml" --json

  Compress specific XML Files with JSON output

    $ sf ah xml compress -f "force-app/main/default/objects/Account/Account.object-meta-xml, ^
      force-app/main/default/objects/Case/Case.object-meta-xml" --json

FLAG DESCRIPTIONS
  -d, --directory=<path/to/directory>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -f, --file=<path/to/file>...  Compress XML Files from specific directory

    Compress XML Files from specific directory (and subfolders). This options does not take effect if you choose
    compress all.

  -r, --root=<path/to/project/root>  Root Project Path

    Path to project root. By default is your current folder

  --all  Compress All Project Files

    Compress all XML files with support compression in your project.

  --sort-order=simpleFirst|complexFirst|alphabetAsc|alphabetDesc  Sort order for XML Files compression

    Sort order for the XML elements when compress XML files. By default, the elements are sorted with simple XML
    elements first.
```

<!-- commandsstop -->

# [**Ignore File**](#ignore-file)

The ignore file is a JSON file used on ignore and create package commands. On this file you can specify metadata types, objects and elements for ignore or delete from your local project or package files. You can have a main ignore file on your root project (like gitignore) named .ahignore.json for use automatically, or have different ignore files and specify it on the commands when you need tou use.

The ignore file have the next structure

```json
    {
        // Basic structure
        "MetadataTypeAPIName": {
            "MetadataObject1",
            "MetadataObject2"
        }

        // Advance Structure
        "MetadataTypeAPIName": {
            "MetadataObject1:MetadataItem1",
            "MetadataObject1:MetadataItem2",
            "MetadataObject2:*",
            "*",
            "*:*" // Only valid on Custom Objects
        }

        // Special for Permissions
        "MetadataTypeAPIName": {
            "UserPermission:MetadataObject1:PermissionName",
            "UserPermission:MetadataObject2:*",
            "UserPermission:*:PermissionName"
        }
    }
```

### Example:

```json
    {
        "CustomLabels": {
            "labelName1",                   // Ignore or remove the custom label "labelName1"
            "labelName2",                   // Ignore or remove the custom label "labelName2",
            "*"                             // Ignore or remove all Custom Labels
        },
        "AssignmentRules":{
            "Case:Assign1",                 // Ignore or remove the Assignent Rule "Assign1" from the object Case
            "Lead:*",                       // Ignore or remove all Assignment Rules from Lead
            "*"                             // Ignore or remove all Assignment Rules
        },
        "CustomObject": {
            "Account",                      // Ignore or remove the Account Object
            "Case:*",                       // Ignore or remove all related objects from case, including the object (Bussines Process, Fields, Validation Rules...),
            "*",                            // Ignore or remove all custom objects (only the object not the related metadata)
            "*:*",                          // Ignore or remove all custom objects and the related metadata (Bussines Process, Fields, Validation Rules...)
        },
        "Report": {
            "ReportFolder",                 // Ignore or remove the entire folder
            "ReportFolder1:ReportName2",    // Ignore or remove the report "ReportName2" from "ReportFolder1" folder.
            "*",                            // Ignore or remove all reports.
        },
        "Workflow": {
            "Account",                      // Ignore or remove the Account worflows (Rules, Task, Alerts...)
            "*"                             // Ignore or  remove all workflows (Rules, Task, Alerts...) from all objects
        },
        "WorkflowRule": {
            "Case:*",                       // Ignore or remove all Workflow rules from case object
            "Account:Rule1",                // Ignore or remove "Rule1" from Account workflows,
            "*"                             // Ignore or remove all Worflow rules from all objects
        },
        "Profile": {
            "UserPermission:*:Permission1", // Remove the "Permission1" User Permission from all profiles
            "UserPermission:TestProfile:*", // Remove all User permissions from TestProfile file
            "UserPermission:Admin:Perm1",   // Remove the Perm1 User Permission from Admin profile
            "TestProfile2",                 // Ignore or remove  the "TestProfile" profile
            "*"                             // Ignore or remove all profiles
        }
    }
```

#### IMPORTANT

    Some Metadata Types have singular and plural name like CustomLabels, MatchingRules, EscalationRules... For ignore or remove this types you must use the plural name, if use the singular name the ignore process not take effect with this types.

---

# [**Metadata JSON Format**](#metadata-file)

The describe metadata commands and compare commands return the metadata in a JSON format, the same format for create the package througth a JSON file. This means that the output of the describe or compare commands can be used as input for create the package from JSON file. The next structure are the full JSON structure file:

```json
    {
        "MetadataAPIName": {
            "name": "MetadataAPIName",                                  // Required. Contains the Metadata Type API Name (like object Key)
            "checked": false,                                           // Required. Field for include this type on package or not
            "path": "path/to/the/metadata/folder",                      // Optional. Path to the Metadata Type folder in local project
            "suffix": "fileSuffix",                                     // Optional. Metadata File suffix
            "childs": {                                                 // Object with a collection of childs (Field required but can be an empty object)
                "MetadataObjectName":{
                    "name": "MetadataObjectName",                       // Required. Contains the Metadata Object API Name (like object Key)
                    "checked": false,                                   // Required. Field for include this object on package or not
                    "path": "path/to/the/metadata/file/or/folder",      // Optional. Path to the object file or folder path
                    "childs": {                                         // Object with a collection of childs (Field required but can be an empty object)
                        "MetadataItemName": {
                            "name": "MetadataItemName",                   // Required. Contains the Metadata Item API Name (like object Key)
                            "checked": false,                           // Required. Field for include this object on package or not
                            "path": "path/to/the/metadata/file"
                        },
                        "MetadataItemName2": {
                            ...
                        },
                        ...,
                        ...,
                        ...
                    }
                }
                "MetadataObjectName2":{
                   ...
                },
                ...,
                ...,
                ...
            }
        }
    }
```

### Example:

```json
    {
        "CustomObject": {
            "name": "CustomObject",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "object",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": true,            // Add Account Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Account/Account.object-meta.xml",
                    "childs": {}
                },
                "Case": {
                    "name": "Case",
                    "checked": true,            // Add Case Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Case/Case.object-meta.xml",
                    "childs": {}
                },
                ...,
                ...,
                ...
            }
        },
        "CustomField": {
            "name": "CustomField",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "field",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": false,
                    "path": "path/to/root/project/force-app/main/default/objects/Account/fields",
                    "childs": {
                        "customField__c": {
                            "name": "customField__c",
                            "checked": true,    // Add customField__c to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/customField__c.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                "Case": {
                    "name": "Case",
                    "checked": false,
                    "path": "path/to/root/project/force-app/main/default/objects/Case/fields",
                    "childs": {
                        "CaseNumber": {
                            "name": "CaseNumber",
                            "checked": true,    // Add CaseNumber to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/CaseNumber.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                ...,
                ...,
                ...
            }
        }
    }
```

# [**Dependencies Repair Response**](#repair-response)

When you repair dependencies with any option (compress or not, repair specified types...) the response error has the next structure:

```json
    {
        "MetadataTypeName": {
            "metadataType": "MetadataTypeName"
            "errors": [
                {
                    "file": "path/to/file"
                    "errors": [
                        {
                            "elementPath": "xmlSuperParentTag>xmlParentTag>xmlTag",
                            "value": "error value",
                            "metadataType": "error Metadata Type",
                            "metadataObject": "error Metadata Object",
                            "metadataItem": "error Metadata Item",
                            "xmlElement": {
                                // xml Element error data
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        }
    }
```

### **Example**:

```json
    {
        "CustomApplication": {
            "metadataType": "CustomApplication"
            "errors": [
                {
                    "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
                    "errors": [
                        {
                            "elementPath": "actionOverrides>content",
                            "value": "FlexiPageExample",
                            "metadataType": "FlexiPage",
                            "metadataObject": "FlexiPageExample",
                            "xmlElement": {
                                "actionName": "View",
                                "comment": "Action override description",
                                "content": "FlexiPageExample",
                                "formFactor": "Large",
                                "pageOrSobjectType": "Account",
                                "skipRecordTypeSelect": false,
                                "type": "Flexipage"
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        },
        "PermissionSet": {
            "metadataType": "PermissionSet"
            "errors": [
                {
                    "file": "..../force-app/main/default/permissionsets/permissionSetExample.app-meta.xml"
                    "errors": [
                        {
                            "elementPath": "fieldPermissions>field",
                            "value": "Account.custom_field__c",
                            "metadataType": "CustomField",
                            "metadataObject": "Account",
                            "metadataItem": "custom_field__c",
                            "xmlElement": {
                                "editable": false,
                                "field": "Account.custom_field__c",
                                "readable": false
                            }
                        },
                        {
                            ...
                        },
                        {
                            ...
                        }
                    ]
                },
                {
                    ...
                },
                {
                    ...
                }
            ]
        }
    }
```

# [**Dependencies Check Response**](#check-response)

When you only check dependencies errors the response error has the next structure:

```json
    {
        "MetadataTypeName": [
            {
                "object": "MetadataObject",
                "item": "MetadataItem",
                "line": 16,
                "startColumn": 146,
                "endColumn": 166,
                "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                "severity": "Warning",
                "file": "/path/to/file"
            },
            {
                "object": "MetadataObject",
                "item": "MetadataItem",
                "line": 17,
                "startColumn": 146,
                "endColumn": 166,
                "message": "MetadataTypeName named MetadataObject.MetadataItem does not exists",
                "severity": "Warning",
                "file": "/path/to/file"
            },
        ],
        "MetadataTypeName": [
            {
                ...
            },
            {
                ...
            }
        ]
    }
```

### **Example**:

```json
{
  "CustomApplication": [
    {
      "object": "FlexiPageExample",
      "line": 16,
      "startColumn": 146,
      "endColumn": 166,
      "message": "FlexiPage named FlexiPageExample does not exists",
      "severity": "Warning",
      "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
    },
    {
      "object": "FlexiPageExample",
      "line": 17,
      "startColumn": 146,
      "endColumn": 166,
      "message": "FlexiPage named FlexiPageExample does not exists",
      "severity": "Warning",
      "file": "..../force-app/main/default/applications/customApplicationExample.app-meta.xml"
    }
  ],
  "PermissionSet": [
    {
      "object": "Account",
      "item": "custom_field__c",
      "line": 1771,
      "startColumn": 56,
      "endColumn": 85,
      "message": "CustomField named Account.custom_field__c does not exists",
      "severity": "Warning",
      "file": "..../force-app/main/default/permissionsets/permissionSetExample.permissionset-meta.xml"
    },
    {
      "object": "Account",
      "item": "custom_field2__c",
      "line": 1772,
      "startColumn": 56,
      "endColumn": 85,
      "message": "CustomField named Account.custom_field2__c does not exists",
      "severity": "Warning",
      "file": "..../force-app/main/default/permissionsets/permissionSetExample.permissionset-meta.xml"
    }
  ]
}
```

# Issues

Please report any issues at https://github.com/forcedotcom/cli/issues

# Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Sign CLA (see [CLA](#cla) below).
9. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

## CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

## Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:salesforcecli/sf-aura-helper

# Install the dependencies and compile
yarn && yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev hello world
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins link .
# To verify
sf plugins
```
