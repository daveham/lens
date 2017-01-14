#!/usr/bin/env bash

# create ssh-config file
ssh_config="$PWD/.vagrant/ssh-config"
vagrant ssh-config > "$ssh_config"

# common roots
root_host="$PWD/.."
root_vm="ssh://default//lens/"
root_data_host="$PWD/../../lens-data"
root_data_vm="ssh://default//lens/data/"

# create unison profile for lens projects
profile1="
root = $root_host
root = $root_vm
path = lens-data-manager
path = lens-data-service
ignore = Name {CHANGELOG.md,CONTRIBUTING.md,LICENSE,README.md,*.log}
ignore = Name {.git,node_modules,.DS_Store,lens-vagrant}
prefer = $root_host
repeat = 2
terse = true
dontchmod = true
perms = 0
sshargs = -F $ssh_config
"

# create unison profile for lens data
profile2="
root = $root_data_host
root = $root_data_vm
ignore = Name {*.log}
ignore = Name {.git,node_modules,.DS_Store,dump.*,stats,thumbs,tiles}
prefer = $root_data_host
repeat = 2
terse = true
dontchmod = true
perms = 0
sshargs = -F $ssh_config
"

# write profiles

if [ -z ${USERPROFILE+x} ]; then
  UNISONDIR=$HOME
else
  UNISONDIR=$USERPROFILE
fi

cd $UNISONDIR
[ -d .unison ] || mkdir .unison
echo "$profile1" > .unison/lens.prf
echo "$profile2" > .unison/lensdata.prf
