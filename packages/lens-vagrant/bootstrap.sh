#!/usr/bin/env bash

# adjust how environment variable is handled when sudo over ssh
sudo echo "Defaults:vagrant env_keep=HOME" >> /etc/sudoers.d/10_vagrant

# create a folder for the project and data
project='lens'
projectfolder="/${project}"
sudo mkdir ${projectfolder}
sudo chmod 777 ${projectfolder}

projectdata='data'
projectdatafolder="/${projectdata}"
sudo mkdir ${projectdatafolder}
sudo chmod 777 ${projectdatafolder}

#install packages
sudo curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
#Add repo for nginx, for some reason yum's base package is broked
#rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
#sudo yum -y update
sudo yum -y install epel-release git nodejs perf iproute2 psmisc
sudo yum -y groupinstall 'Development Tools'
sudo yum -y install ctags ctags-etags
#sudo yum -y install nginx
sudo yum -y install vim
sudo yum -y install GraphicsMagick
sudo yum -y install redis

# prepare a custom folder for installing npm packages globally without requiring sudo
# idea for how to handle this came from https://github.com/glenpike/npm-g_nosudo
vagrantuser="vagrant"
vagranthome="/home/${vagrantuser}"
npmdir="${vagranthome}/.npm-packages"

vagrantip="192.168.20.20"
printf "\nHOST=%s\n" ${vagrantip} >> ${vagranthome}/.bashrc

mkdir -p ${npmdir}
npm config set prefix "${npmdir}"
chown -R ${vagrantuser}:${vagrantuser} ${npmdir}
chmod g+s ${npmdir}

envfix='
export NPM_PACKAGES="%s"
export NODE_PATH="$NPM_PACKAGES/lib/node_modules${NODE_PATH:+:$NODE_PATH}"
export PATH="$NPM_PACKAGES/bin:$PATH"
# Unset manpath so we can inherit from /etc/manpath via the `manpath` command
unset MANPATH  # delete if you already modified MANPATH elsewhere in your config
export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"
'

printf "${envfix}" ${npmdir} >> ${vagranthome}/.bashrc

printf "npm config set prefix %s\n" ${npmdir} >> ${vagranthome}/.bashrc

npmglobalscript='/vagrant/bootstrap-npm.sh'
if test -e ${npmglobalscript}; then
    sudo su - vagrant -c "sh ${npmglobalscript}"
else
    echo "did not find ${npmglobalscript}"
fi

# Add custom environment variable to .bashrc
printf "export VAGRANT_BOX=true\n" >> ${vagranthome}/.bashrc

# Use local dot files if they exist
for file in /.bash_profile /.bash_prompt; do
    if test -e /vagrant/vagrantfiles/${file}; then
        cp -f /vagrant/vagrantfiles/${file} ${vagranthome}
    fi
done;

# install ocaml & unison from source
cd ~
ocamlsource='ocaml-4.02.2'
ocamltar="${ocamlsource}.tar.gz"
cp -v "/vagrant/vagrantfiles/${ocamltar}" .
tar xvfz "${ocamltar}"
cd "${ocamlsource}"
./configure
make world
make opt
sudo umask 022
sudo make install
sudo make clean
sudo cp -v ocaml /usr/local/sbin/
sudo cp -v ocaml /usr/bin
cd ~
rm -fr "${ocamlsource}"

# using local copy, but you can find it here
# wget http://www.seas.upenn.edu/~bcpierce/unison/download/releases/unison-2.48.3/unison-2.48.3.tar.gz
unisonsource='unison-2.48.4'
unisontar="${unisonsource}.tar.gz"
cp -v "/vagrant/vagrantfiles/${unisontar}" .
tar xvfz "${unisontar}"
cd src
make
sudo cp -v unison /usr/local/sbin/
sudo cp -v unison /usr/bin
cd ~
rm -fr src

# configure firewall
sudo firewall-cmd --zone=public --permanent --add-service=http
sudo firewall-cmd --zone=public --permanent --add-service=https
sudo firewall-cmd --zone=public --permanent --add-port=3000/tcp
sudo firewall-cmd --zone=public --permanent --add-port=3001/tcp
sudo firewall-cmd --zone=public --permanent --add-port=4443/tcp
sudo firewall-cmd --zone=public --permanent --add-port=8081/tcp
sudo firewall-cmd --zone=public --permanent --add-port=5857/tcp
sudo firewall-cmd --zone=public --permanent --add-port=5858/tcp
sudo firewall-cmd --zone=public --permanent --add-port=5859/tcp

# These units will be started if not running or restart if running
sudo systemctl restart firewalld
sudo systemctl restart redis.service
#sudo systemctl restart nginx

# These units will be started on bootup:
#sudo systemctl enable nginx
sudo systemctl enable redis.service

sudo /opt/VBoxGuestAdditions-*/init/vboxadd setup
