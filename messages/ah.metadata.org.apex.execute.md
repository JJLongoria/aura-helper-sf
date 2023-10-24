# summary

Execute Anonymous Apex N Times.

# description

Command to execute an Anonymous Apex script from file against the auth org N times.

# flags.file.summary

Script File Path

# flags.file.description

Path to the Anonymous Apex Script file

# flags.print-log.summary

Print Log every execution

# flags.print-log.description

Option to print the result log of every execution. Depends on --progress flag

# flags.iterations.summary

Script execution number

# flags.iterations.description

Option to select the scritp execution number. For example, 3 for execute the script 3 times

# message.executing-script

Running Apex Executions...

# message.executing-iteration

Executing Script. Iteration: %d/%d

# message.finished-iteration

Iteration: %d/%d finished.

# message.finished-script

Apex execution finished succesfully

# examples

- Execute a script 3 times

  <%= config.bin %> <%= command.id %> -f "path/to/script.apex" -i 3

- Execute a script 10 times and print the execution log

  <%= config.bin %> <%= command.id %> -f "path/to/script.apex" --iterations 10 --print-log
