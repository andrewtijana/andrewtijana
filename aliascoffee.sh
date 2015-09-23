#!/bin/bash
# Setting up the coffee node_module to execute coffee-script rather than js

alias npm-exec='PATH=$(npm bin):$PATH'
alias coffee='npm-exec coffee'