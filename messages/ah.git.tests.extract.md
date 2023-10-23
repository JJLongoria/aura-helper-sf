# summary

Extract Tests data from commits.

# description

Command to extract all test classes from commits messages from GIT differences between branches, commits or tags

# flags.source.summary

Source Branch, Commit or Tag.

# flags.source.description

Source branch, commit, tag... to extract test classes from commit messages.

# flags.target.summary

Target Branch, Commit or Tag.

# flags.target.description

Target branch, commit, tag... to extract test classes from commit messages.

# flags.start-tag.summary

Start Tag to extract test Classes

# flags.start-tag.description

Start Tag for Test Classes names on git commit message. (default: --TESTS START--)

# flags.end-tag.summary

End Tag to extract test Classes

# flags.end-tag.description

End Tag for Test Classes names on git commit message (default: --TESTS END--)

# message.extracting-test-classes

Extracting Test Classes from git commits messages...

# examples

- Extracting tests data from differences between branchX and main branches

  <%= config.bin %> <%= command.id %> -s branchX -t main

- Extracting tests data from differences between branchX and main branches with json output

  <%= config.bin %> <%= command.id %> -s branchX -t main --json

- Extracting tests data from differences between branchX and main branches with custom start and end tag

  <%= config.bin %> <%= command.id %> -s branchX -t main --start-tag \"MyCustom Test Start Tag\" --end-tag \"MyCustom Test End Tag\" --json
