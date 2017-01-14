# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "puppetlabs/centos-7.0-64-nocm"
  config.vm.provider "virtualbox" do |v|
    v.linked_clone = true if Vagrant::VERSION =~ /^1.8/
    v.customize ["modifyvm", :id, "--memory", 2048]
    v.customize ["modifyvm", :id, "--cpus", 2]
    v.customize ["modifyvm", :id, '--paravirtprovider', 'kvm']
    v.customize ["modifyvm", :id, '--ioapic', 'on']
  end
  config.vm.network "private_network", ip: "192.168.20.20"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 443, host: 4443
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3001, host: 3001
  config.vm.network "forwarded_port", guest: 8081, host: 8081
  config.vm.synced_folder ".", "/vagrant", disabled: false
  config.ssh.forward_agent = true
  config.vm.provision :shell, path: "./bootstrap.sh"

  # Vagrant Triggers

  # Vagrant will not forward to ports lower than 1024 unless vagrant is run with sudo - which is a bad idea.
  # Instead, we use vagrant triggers to configure the host's firewall to forward ports up to allowable ports.
  #   on host: 80 -> 8080, then within vagrant: 8080 -> 80
  #   on host: 443 -> 4443, then within vagrant: 4443 -> 443

  # The manipulation of the hosts firewall is performed through vagrant triggers.
  #   refer to: https://github.com/emyl/vagrant-triggers

  # In order for this to work, you need to install the vagrant trigger plugin by typing the following
  # command in the folder containing this Vagrant file:
  #
  #   vagrant plugin install vagrant-triggers

  # Note that when the triggers execute, they will prompt you on the command line to enter your
  # machine's admin password which is required to manipulate the firewall.

  # Vagrant triggers are used to forward host ports 80 and 443 up to 8080 and 4443.
  config.trigger.after [:provision, :up, :reload] do
    system('echo "
      rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 8080
      rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 443 -> 127.0.0.1 port 4443
"     | sudo pfctl -f - > /dev/null 2>&1; echo "==> Fowarding Ports: 80 -> 8080, 443 -> 4443"')
  end

  # Vagrant triggers are used to cancel the forwarding of host ports.
  config.trigger.after [:halt, :destroy] do
    system("sudo pfctl -f /etc/pf.conf > /dev/null 2>&1; echo '==> Removing Port Forwarding'")
  end
end
