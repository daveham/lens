#!/usr/bin/env bash
#install packages
sudo curl --silent --location https://rpm.nodesource.com/setup | bash -
#Add repo for nginx, for some reason yum's base package is broked
#rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
#sudo yum -y update
sudo yum -y install epel-release git nodejs perf iproute2 psmisc
sudo yum -y groupinstall 'Development Tools'
sudo yum -y install ctags ctags-etags
#sudo yum -y install nginx
sudo yum -y install vim
sudo npm install -g n
sudo n 6.9.4
sudo npm install -g npm
sudo npm install -g gulp
sudo npm install -g webpack
sudo npm install -g nodemon
sudo npm install -g mocha
sudo npm install -g redis-commander
sudo npm install -g lerna

# install unison from source
cd ~
wget http://download.opensuse.org/repositories/home:ocaml/CentOS_7/home:ocaml.repo
sudo mv home:ocaml.repo /etc/yum.repos.d/
sudo yum -y install ocaml

wget http://www.seas.upenn.edu/~bcpierce/unison/download/releases/unison-2.48.3/unison-2.48.3.tar.gz
tar xvfz unison-2.48.3.tar.gz
cd unison-2.48.3
make
sudo cp -v unison /usr/local/sbin/
sudo cp -v unison /usr/bin
cd ~
rm -fr unison-2.48.3

sudo yum -y install GraphicsMagick
sudo yum -y install redis

# adjust how environment variable is handled when sudo over ssh
sudo echo "Defaults:vagrant env_keep=HOME" >> /etc/sudoers.d/10_vagrant
sudo mkdir /lens
sudo chmod 777 /lens
sudo mkdir /data
sudo chmod 777 /data

# Use local dot files if they exist
for file in /.{bash_profile,bash_prompt}; do
    cp -f /vagrant/vagrantfiles/"$file"   /home/vagrant
done;

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

# Add custom environment variable to .bashrc
echo 'export VAGRANT_BOX=true' >> /home/vagrant/.bashrc
