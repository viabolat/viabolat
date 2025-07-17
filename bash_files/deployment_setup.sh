#!/bin/bash

# Ensure this script is always executable
chmod +x "$0"

# Initialize a variable to track the overall script status
script_status="success"

# Function to add paths while ensuring no duplicates
add_to_path () {
  if [ -e "$1" ]; then  # Verify the existence of the path
    if [[ ":$PATH:" != *":$1:"* ]]; then  # Check if path is already in PATH
      export PATH="$1:$PATH"  # Append path to PATH
    fi
  else
    script_status="error"  # Update status due to error
    echo "Error: Path $1 does not exist."
    return 1
  fi
}

# Set critical environment variables with failure checks
export AWS_REGION=eu-west-1 || script_status="error"
export DOCKER_HOST=localhost:2375 || script_status="error"

# Add essential paths for environment setup
add_to_path "$HOME/.local/bin"
add_to_path "$HOME/projects/bash_files"
add_to_path "$HOME/.tfenv/bin"
add_to_path "/usr/bin/python3.10"
add_to_path "/usr/bin/python3.11"
add_to_path "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/"
add_to_path "/mnt/c/Program Files/Docker/Docker/resources/bin"

# SSH Agent Setup - Only start if not already running
if [ -z "$SSH_AUTH_SOCK" ] || ! pgrep -u "$USER" ssh-agent > /dev/null; then
  eval "$(ssh-agent -s)" > /dev/null
  ssh-add ~/.ssh/id_rsa || script_status="error"
fi

# Docker Desktop for Windows Setup - Only start if it's not already running and if on Windows subsystem
if grep -qi microsoft /proc/version; then
  if ! powershell.exe -Command "Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue" | grep -q "Docker Desktop"; then
    /mnt/c/Program\ Files/Docker/Docker/Docker\ Desktop.exe &>/dev/null &
    if [ $? -ne 0 ]; then
      script_status="error"
      echo "Error: Failed to start Docker Desktop."
    fi
  fi
fi

# Source additional configuration files if they exist
if [ -f /usr/share/bash-completion/bash_completion ]; then
  . /usr/share/bash-completion/bash_completion
elif [ -f /etc/bash_completion ]; then
  . /etc/bash_completion
fi

# Check for interactive shell before setting a custom prompt
if [[ $- == *i* ]]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
    case "$TERM" in
        xterm*|rxvt*)
            PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
            ;;
    esac
fi

# Display the final message based on the script_status
if [[ "$script_status" == "success" ]]; then
    echo "Terminal ready."
else
    echo "Check settings, there were errors."
fi
