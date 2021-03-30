# ROSSLYN SOLAR

## Introduction
Rossly Solar project aims at having a minimalistic setup of the whole Vipimo stack running on a single board computer preferably the raspberryPi. This provides an oportunity for having an E2E IoT system setup within a closed network that works offline possibly in power deficient environment.
At every instance any action undertaken within the project explicitly aimed at meeting the objectives:

1. Successfully setup and configure Thingsboard, NodeRed, Lorawan Server, and MQTT broker 
2. Setup a solar power system to provide the total power requirement for the system
3. Rigourously test and validate the system fuctionality and the operational limits

## GENERAL HARDWARE SETUP
![GENRAL HERDWARE SETUP](/SETUP0.svg)

Its important that one determines the power characteristics of the devices that need to be supported and the uptime required to effectively come up with a suitable choice of the battery and an appropriate power supply interface. The current setup however, do consist of the following components:
     
     1. 21V OC(Open Circuit), 1.6A charging Current Solar Panel
     2. 50V,2A max input and 12V, 2A max output PWM Charge controller
     3. 12V 7A 10HR Lead Acid Accumilator
     4. Raspberry PI 4 4GB ram
     5. The power supply interface: 12 V to 5V, 3A buck converter with USB output.

### Hardware setup performance
Despite the relatively High battery capacity of approximately 840Wh incomparison to the power consumption of the raspberry PI 4 of 6W the charge controller used in this case cuts off the power supply to the load line on which the raspberry PI is connected just before the battery voltage drops to 10.8V. This presents the first huddle in the operation of the system and as such needs to be delt with. A suitable controller that can operate te load to even relatively lower voltage.

Similary, to provide a higher uptime assurance, a parallel solar panel array can be used. This would prove usefull especially during cloudy conditions as it would still sufficienlty be able to provide a dequate charging current.

## SOFTWARE STACK SETUP
![GENRAL HERDWARE SETUP](/STACK.svg)

The software components used are shown in the stack above.
### Setup installation instructions
Its necessary to follows the installation sequence as given below as the most likely to fail part of the installation process is the thingsboard.

The steps below assumes:

1. You have installed latest desktop version of the raspbian and changed the hostname to ``vipimolite``

**INSTALL THINGSBOARD**

*INSTALL JAVA 8*

```sudo apt update```

```sudo apt install openjdk-11-jdk```

```sudo update-alternatives --config java```

*Install & Configure POSTGRESQL*

```sudo apt-get install postgresql postgresql-contrib```

```sudo service postgresql start```

```sudo -u postgres psql```

```CREATE DATABASE thingsboard;```

```CREATE USER thingsboard with encrypted password 'upandegani';```

```GRANT ALL PRIVILAGES ON DATABASE thingsboard TO thingsboard;```

*Download and install the custom thingsboard*

First, use wget to obtain the precustomized thingsboard debian package that has the vipimo branding in this repository.

```sudo wget https://github.com/upandeltd/ROSSLYN-SOLAR/blob/main/thingsboard%202.4.0.deb```

```sudo dpkg -i thingsboard-3.2.2.deb```

```sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo```

```sudo service thingsboard start```

**NB** It takes upto 300 seconds for thingsboard to start. Be patient with it. It will eventually start at port 8080.

**INSTALL NODE-RED**
Node-red provides the bridge for packets data decoding and nodes provisioning in this case.
Use the command below to install node-red

```bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)```

Accept the options when propmpted to install PI specific node

```sudo systemctl enable nodered.service```

```node-red-pi --max-old-space-size=256```

When browsing from another machine you should use the hostname or IP-address of the Pi: ```http://<hostname>:1880```. You can find the IP address by running ```hostname -I``` on the Pi.

Once installed:
1. log into the pi and in ```/home/pi``` directory 
2. Create a json file Nodes.json with empty array i.e *type []* 
3. Change the file permision: ```bash sudo chmod 777 /home/pi/Nodes.json```
4. Go to ```http://<hostname>:1880``` and import the ``` flows.json ``` in this repository.

This flow contains node provisioning flows and the foundation for nodes data decoding.

**INSTALL MQTT**

```sudo apt update```

```sudo apt install -y mosquitto mosquitto-clients```

You are likely to encounter some error here however continue with the steps below.

```sudo systemctl enable mosquitto.service```

Mosquitto is controlled in two ways. First, the default configuration is in /etc/mosquitto/mosquitto.conf. I recommend you not edit this file, however, and instead, use the second mechanism, which is a file with a .conf extension in /etc/mosquitto/conf.d. I actually named mine mosquitto.conf, too, so the full path to the local configuration file is /etc/mosquitto/conf.d/mosquitto.conf. This file is populated with example configurations by default, so you'll want to edit it for your local use. Here is the local configuration file I recommend you add to the file:

```listener 1884```

The setting above changes the listening port of the mqtt broker. The default port 1883 is used by the netty-mqtt  installed when thingsboard is installed. Save the file and restart the mqtt service.

```sudo systemctl restart mosquitto```

**Install Lorawan Server**

On the Debian Linux and its clones like Raspbian you can use the .deb package.

Unless you have Debian 10 (Buster) you have to install the Erlang/OTP 21.0 or later from Erlang Solutions first:

```wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb```

```sudo dpkg -i erlang-solutions_1.0_all.deb```

```sudo apt-get update```

```sudo apt-get install erlang-base erlang-crypto erlang-syntax-tools erlang-inets \erlang-mnesia erlang-runtime-tools erlang-ssl erlang-public-key erlang-asn1 \erlang-os-mon erlang-snmp erlang-xmerl```

Download the Debian package lorawan-server-*.deb and install it by:

```sudo wget https://github.com/gotthardp/lorawan-server/releases/download/v0.6.7/lorawan-server_0.6.7_all.deb```

```dpkg -i lorawan-server_0.6.7_all.deb```

start automatically after system reboot

```systemctl enable lorawan-server```

The server by default binds itself to port 8080. But this is also the port used by the thingsboard installed above. As such we need to change the port it binds to as shown below:

Static server configuration is defined in ```/usr/liblorawan-server/releases/0.6.7/sys.config```
Edit sys.config  which looks as shown below by default by changing ```{http_admin_listen, [{port, 8080}]}``` to  ```{http_admin_listen, [{port, 8084}]}```.

Note that you can bind it to any port. Just ensure no process require that port and be sure to remember it.

[{lorawan_server, [
    `% update this list to add/remove applications
    {applications, [
        {<<"semtech-mote">>, lorawan_application_semtech_mote}]},
    % UDP port listening for packets from the packet_forwarder Gateway
    {packet_forwarder_listen, [{port, 1680}]},
    % HTTP port for web-administration and REST API
    {http_admin_listen, [{port, 8080}]},
    % default username and password for the admin interface
    {http_admin_credentials, {<<"admin">>, <<"admin">>}},
    % Set the following parameter to true to enable statistics metrics in Prometheus format
    {enable_prometheus, false},
    % amount of rxframes retained for each device/node
    {retained_rxframes, 50},
    % websocket expiration if client sends no data
    {websocket_timeout, 3600000} % ms
]},
{os_mon, [
    % Setting this parameter to true can be necessary on embedded systems with
    % stripped-down versions of Unix tools like df.
    {disksup_posix_only, false}
]}]

Review the sys.config and modify where needed. After updating the configuration you need to restart the server.
Then start the server by ```systemctl restart lorawan-server```

This would conclude the setup of the modules.