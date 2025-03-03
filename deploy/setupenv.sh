#!/bin/bash

##################
echo "[Disable kdump cause it doesn't work by default]"
systemctl disable kdump.service


#################
echo "[Install epel-release]"
sleep 3
yum -y install epel-release


##################
echo "Setting up dev Centos dotnet environment on this machine.."


#################
echo "[INSTALLING .NET CORE]"
rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm
yum update
yum -y install aspnetcore-runtime-2.2 # change version as needed
echo "Done installing .net core runtime 2.2"


echo "[SET ASPNETCORE_ENVIRONMENT to Production]"
sleep 3
echo "export ASPNETCORE_ENVIRONMENT=Production" >> ~/.bashrc


###############
echo "[Install nginx]"
sleep 3
yum -y install nginx
systemctl start nginx
systemctl enable nginx


###############
sleep 3
echo "[Create nginx site folders. Manage these via ln]"
mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled


###############
echo "[If firewalldD exists, open up http ports]"
sleep 3
if [ -x "$(command -v firewall-cmd)" ]; then
	firewall-cmd --permanent --zone=public --add-service=http 
	firewall-cmd --permanent --zone=public --add-service=https
	firewall-cmd --reload
fi



###############
echo "[\"setsebool -P httpd_can_network_connect 1\" Fixes 502 bad gateway for nginx on security enhanced linnux]"
sleep 3
setsebool -P httpd_can_network_connect 1


################
echo "[1] INSTALL AND RUN CERTBOT"
sleep 3
yum -y install yum-utils
yum-config-manager --enable rhui-REGION-rhel-server-extras rhui-REGION-rhel-server-optional
yum install python2-certbot-nginx
certbot --nginx


echo "DONE. You still have some manual work to do with configuring nginx, certbot..etc"
