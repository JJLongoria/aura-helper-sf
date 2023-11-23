# summary

Execute an entire project code analisys and generate report

# description

Execute an entire project code analisys and generate a complex and navigable report in HTML like SonarQube

# flags.name.summary

summary

# flags.name.description

description

# flags.output-dir.summary

Generated Files Output Path

# flags.output-dir.description

Path to save the generated output files. By default save result on <actualDir>/ScanResult

# flags.categories.summary

Categories to analize

# flags.categories.description

Categories to analize. By default analize all categories. Available categories: %s. You can use a comma separated list to select multiple categories (e.g. --categories=Security,Performance) or use the flag multiple times (e.g. --categories=Security --categories=Performance)

# flags.pmd-rule-set.summary

PMD Custom Rule Set File

# flags.pmd-rule-set.description

PMD Custom Rule Set File. By default use the default Rule Set file of Salesforce Code Analizer

# flags.eslint-rule-set.summary

eslint Custom Rule Set File

# flags.eslint-rule-set.description

eslint Custom Rule Set File. By default use the default Rule Set file of Salesforce Code Analizer

# flags.quality-gate.summary

Quality Gate to finish the scan with error

# flags.quality-gate.description

Quality Gate to finish the scan with error. By default use the Low Aura Helper Quality Gate. Available Quality Gates: %s. Also can create or modify your custom quality gates for any project. Only one custom qualitu gate by project.

# message.running-scan

Running Scanner...

# message.start-report

Start analizing results to create report

# message.create-result

Creating HTML Report...

# message.report-success

Report created successfully on %s. Open the %sindex.html file to see the report

# examples

- <%= config.bin %> <%= command.id %>
