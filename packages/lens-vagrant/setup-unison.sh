#!/usr/bin/env bash

# create ssh-config file
ssh_config="$PWD/.vagrant/ssh-config"
vagrant ssh-config > "$ssh_config"

# create unison profile for lens projects
root_host="$PWD/../.."
root_vm="ssh://default//lens/"

profile1="
root = $root_host
root = $root_vm
ignore = Path lens-data
ignore = Path packages/lens-vagrant
ignore = Name {*.md,LICENSE,*.log}
ignore = Name {*.sublime-project,*.sublime-workspace}
ignore = Name {.git,node_modules,.DS_Store}
prefer = $root_host
repeat = 2
terse = true
dontchmod = true
perms = 0
sshargs = -F $ssh_config
"

# create unison profile for lens data
root_data_host="$PWD/../../lens-data"
root_data_vm="ssh://default//data/"

profile2="
root = $root_data_host
root = $root_data_vm
ignore = Path stats
ignore = Path thumbs
ignore = Path tiles
ignore = Name {*.log}
ignore = Name {.git,node_modules,.DS_Store,dump.*}
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
