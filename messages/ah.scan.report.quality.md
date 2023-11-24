# summary

Set Custom Quality Gates for the selected project.

# description

Set your Custom Quality Gates for the selected project. Only one custom quality gate by project. The Quality Gate is used by the command `scan:report` to process the results and finish the scan with pass or not pass result, depending on the results of the Quality Gate.

# flags.name.summary

Description of a flag.

# flags.name.description

More information about a flag. Don't repeat the summary.

# flags.interactive.summary

Run command in interactive mode.

# flags.interactive.description

Run command in interactive mode. If the flag is not present, the command will use the default values for the flags.

# flags.max-debt.summary

Set the maximum technical debt to check on scan report.

# flags.max-debt.description

Set the maximum technical debt to check on scan report. If the technical debt is greater than the maximum, the scan will finish with not passed result. By default use the maximum technical debt of the selected Quality Gate.

# flags.max-bugs.summary

Set the maximum bugs to check on scan report.

# flags.max-bugs.description

Set the maximum bugs to check on scan report. If the bugs are greater than the maximum, the scan will finish with not passed result. By default use the maximum bugs of the selected Quality Gate.

# flags.max-blockers.summary

Set the maximum blockers to check on scan report.

# flags.max-blockers.description

Set the maximum blockers to check on scan report. If the blockers are greater than the maximum, the scan will finish with not passed result. By default use the maximum blockers of the selected Quality Gate.

# flags.max-criticals.summary

Set the maximum criticals to check on scan report.

# flags.max-criticals.description

Set the maximum criticals to check on scan report. If the criticals are greater than the maximum, the scan will finish with not passed result. By default use the maximum criticals of the selected Quality Gate.

# flags.max-majors.summary

Set the maximum majors to check on scan report.

# flags.max-majors.description

Set the maximum majors to check on scan report. If the majors are greater than the maximum, the scan will finish with not passed result. By default use the maximum majors of the selected Quality Gate.

# flags.max-minors.summary

Set the maximum minors to check on scan report.

# flags.max-minors.description

Set the maximum minors to check on scan report. If the minors are greater than the maximum, the scan will finish with not passed result. By default use the maximum minors of the selected Quality Gate.

# flags.max-infos.summary

Set the maximum infos to check on scan report.

# flags.max-infos.description

Set the maximum infos to check on scan report. If the infos are greater than the maximum, the scan will finish with not passed result. By default use the maximum infos of the selected Quality Gate.

# examples

- <%= config.bin %> <%= command.id %>
