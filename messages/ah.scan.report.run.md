# summary

Execute an entire project code analisys and generate report

# description

Execute an entire project code analisys and generate a complex and navigable report in HTML like SonarQube or Similars

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

# flags.open.summary

Open the generated report

# flags.open.description

Open Automatically the generated report when finish the scan in the default browser.

# message.running-scan

Running Scanner...

# message.start-report

Start analizing results to create report

# message.create-result

Creating HTML Report...

# message.report-success

Report created successfully on %s. Open the %sindex.html file to see the report

# message.open-report-command

To run the generated report to see the results, run the command the next command

sf ah scan report open --input-dir "%s"

# message.opening-report

Opening report.... Press Ctrl+C to close the server

# examples

- Running a report for the current folder project and save the results on the default folder

  <%= config.bin %> <%= command.id %>

- Running a report for the current folder project and save the results on the default folder and get results as JSON (for CI/CD)

  <%= config.bin %> <%= command.id %> --output-dir "/path/to/output/folder" --json

- Running a report only for the Security and Performance categories

  <%= config.bin %> <%= command.id %> --output-dir "/path/to/output/folder" --categories "Security,Performance"

- Running a report for all categories except Security

  <%= config.bin %> <%= command.id %> --output-dir "/path/to/output/folder" --categories "!Security"

- Running a report with the Auta Helper Moderate Quality Gate

  <%= config.bin %> <%= command.id %> --output-dir "/path/to/output/folder" --quality-gate Moderate

- Running a report with the project custom Quality Gate. Can create custom quality gates using the command "sf ah scan report quality"

  <%= config.bin %> <%= command.id %> --output-dir "/path/to/output/folder" --quality-gate Custom
