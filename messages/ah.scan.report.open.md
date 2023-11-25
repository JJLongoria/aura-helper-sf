# summary

Open an Aura Helper Code Analysis Report on a local server.

# description

Open an Aura Helper Code Analysis Report to view the results of the scan. To close the server report, press Ctrl+C in the terminal window.

# flags.name.summary

Description of a flag.

# flags.name.description

More information about a flag. Don't repeat the summary.

# flags.input-dir.summary

Path to the report folder to open

# flags.input-dir.description

Path to the report folder to open. Defaults to the current working directory.

# flags.port.summary

Port to use for the server

# flags.port.description

Port to use for the server. Defaults to 5000.

# message.open-report

Opening report...

# message.open-server

Opening server. Press Ctrl+C to close the server

# message.open-browser

Opening browser

# message.close-server

Shutting down server

# message.report-closed

Report closed

# error.no-index

No index.html file found in %s

# examples

- Open the report on the current folder

  <%= config.bin %> <%= command.id %>

- Open the report on the folder "path/reports"

  <%= config.bin %> <%= command.id %> --input-dir "path/reports"

- Open the report on the folder "path/reports" and running on custom port

  <%= config.bin %> <%= command.id %> --input-dir "path/reports" --port 7500
