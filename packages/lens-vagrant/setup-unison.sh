#!/usr/bin/env bash

project='lens'

# create ssh-config file
vagrantdir="$PWD"
ssh_config="${vagrantdir}/.vagrant/ssh-config"
vagrant ssh-config > "${ssh_config}"

# create unison profile for the project
parentdir="$(dirname `pwd`)"
rootdir="$(dirname ${parentdir})"
root_host="${rootdir}"
root_vm="ssh://default//${project}/"

# ? dontchmod = true

profile1="
root = $root_host
root = $root_vm
ignore = Path lens-data
ignore = Path packages/lens-vagrant
ignore = Name {*.md,LICENSE,*.log}
ignore = Name {*.sublime-project,*.sublime-workspace,.idea}
ignore = Name {.git,node_modules,lib,.DS_Store}
prefer = $root_host
terse = true
dontchmod = true
auto = true
batch = true
perms = 0
sshargs = -F $ssh_config
"

# create unison profile for lens data
root_data_host="${rootdir}/lens-data"
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
terse = true
dontchmod = true
auto = true
batch = true
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
echo "$profile1" > ".unison/${project}.prf"
echo "$profile2" > ".unison/${project}data.prf"
