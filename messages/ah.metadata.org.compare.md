# summary

Compare Metadata Types and Objects between two orgs or between your local project and your auth org

# description

Command to compare your local project with your auth org for get the differences. The result are the metadata types and objects that you have in your org, but don't have in your local project. Also can compare between two different orgs and return the metadata that exists on target org but not exists on source org

# flags.source-org.summary

Source Org to compare.

# flags.source-org.description

Source Salesforce org to compare. If you choose source, --root will be ignored. If you not choose source, the command will compare your local project with your auth org

# flags.target-org.summary

Target Org to Compare.

# flags.target-org.description

Target Salesforce org to compare.

# flags.csv.summary

Show the result as CSV

# flags.csv.description

Option to show the result as CSV instead a table if not select --json flag

# message.after-download

%s downloaded

# message.describe-source

Describing Metadata Types from Source Org

# message.describe-target

Describing Metadata Types from Target Org

# message.describe-local

Describing Local Metadata Types

# messge.running-compare-orgs

Comparing Source and Target Orgs...

# messge.running-compare-local

Comparing Local and Org...

# message.running-compare

Comparing Metadata Types

# message.comparing-finish

Comparing Metadata Types Finished

# error.no-data

Not metadata types found to compare

# examples

- Compare Metadata Types and Objects between your local project and your auth org

  <%= config.bin %> <%= command.id %> -o test.username@salesforceOrg.com.qa

- Compare Metadata Types and Objects between two orgs

  <%= config.bin %> <%= command.id %> -s test.username@salesforceOrg.com.uat -o test.username@salesforceOrg.com.qa

- Compare Metadata Types and Objects between your local project and your auth org and show the result as CSV

  <%= config.bin %> <%= command.id %> -t test.username@salesforceOrg.com.qa --csv

- Compare Metadata Types and Objects between your local project and your auth org and show the result as JSON

  <%= config.bin %> <%= command.id %> -t test.username@salesforceOrg.com.qa --json
