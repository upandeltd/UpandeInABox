# UpandeInABox

## Introduction
The UpandeInABox product aims at having a minimalistic setup of the whole Upande IOT/ERP stack running on a single board computer preferably the raspberryPi. This provides an oportunity for having an E2E IoT system setup within a closed network that works offline possibly in power deficient environment. It was originally thought to be suitable for the Rosslyn Solar kits, though was dropped there because the latency of IOT was not suitable for teaching kids solar. It was deployed for the Humanitarian Grand Challenges (GCC) project with TDH and NRC.

At every instance any action undertaken within the project explicitly aimed at meeting the objectives:

1. Successfully setup and configure Thingsboard, NodeRed, Lorawan Server, and MQTT broker
2. Rigourously test and validate the system fuctionality and the operational limits

## GENERAL HARDWARE SETUP
<!--
![GENRAL HERDWARE SETUP](/images/SETUP0.svg)

Its important that one determines the power characteristics of the devices that need to be supported and the uptime required to effectively come up with a suitable choice of the battery and an appropriate power supply interface. The current setup however, do consist of the following components:
     
     1. 21V OC(Open Circuit), 1.6A charging Current Solar Panel
     2. 50V,2A max input and 12V, 2A max output PWM Charge controller
     3. 12V 7A 10HR Lead Acid Accumilator
     4. Raspberry PI 4 4GB ram
     5. The power supply interface: 12 V to 5V, 3A buck converter with USB output.

### Hardware setup performance
Despite the relatively High battery capacity of approximately 840Wh incomparison to the power consumption of the raspberry PI 4 of 6W the charge controller used in this case cuts off the power supply to the load line on which the raspberry PI is connected just before the battery voltage drops to 10.8V. This presents the first huddle in the operation of the system and as such needs to be delt with. A suitable controller that can operate te load to even relatively lower voltage.

Similary, to provide a higher uptime assurance, a parallel solar panel array can be used. This would prove usefull especially during cloudy conditions as it would still sufficienlty be able to provide a dequate charging current. -->

We are using a Dragino pg1301 LoraWan concentrator as a shield on the raspberry pi 3/4 as our multi-channel gateway. The documentation for setting up the pg1301 shield is available on the dragino website. You should however change the port on the global_conf.json file from  1700 to 1680 as shown:  
```       "server_address": "localhost", ```

```        "serv_port_up": 1680, ```

```        "serv_port_down": 1680, ```

## SOFTWARE STACK SETUP
![GENRAL HERDWARE SETUP](/images/STACK.svg)

The software components used are shown in the stack above.

### Setup installation instructions
Its necessary to follows the installation sequence as given below as the most likely to fail part of the installation process is the thingsboard.

The steps below assumes You have installed latest desktop version of the raspbian OS and changed the hostname to ``vipimolite`` in raspi-config.

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

```GRANT ALL PRIVILEGES ON DATABASE thingsboard TO thingsboard;```

```Exit Postgresql (Control-D)```


*Download and install the custom thingsboard*

First, use we get to obtain the precustomized thingsboard debian package that has the vipimo branding in this repository.

```sudo wget https://github.com/upandeltd/ROSSLYN-SOLAR/blob/main/thingsboard%202.4.0.deb```

```sudo dpkg -i thingsboard-2.4.0.deb```

```sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo```

```sudo service thingsboard start```

**NB** It takes upto 300 seconds for thingsboard to start. Be patient with it. It will eventually start at port 8080.
Below is the link to the documentation on getting started with Thingsboard. 
[Getting started with Thingsboard](https://thingsboard.io/docs/getting-started-guides/helloworld/)


**INSTALL NODE-RED**

Node-red provides the bridge for packets data decoding and nodes provisioning in this case.
Use the command below to install node-red

```bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)```

Accept the options when propmpted to install PI specific node

```sudo systemctl enable nodered.service```

```node-red-pi --max-old-space-size=256```

When browsing from another machine you should use the hostname or IP-address of the Pi: ```http://<hostname>:1880```. You can find the IP address by running ```hostname -I``` on the Pi.

Once installed, open new terminal window:
1. log into the pi and in ```/home/vipimolite (/home/pi if you did not change the hostname at the beginning)``` directory 
2. Create a json file Nodes.json with empty array i.e *type []* 
3. Change the file permision: ``` sudo chmod 777 /home/pi/Nodes.json```
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

```sudo wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb```

```sudo dpkg -i erlang-solutions_1.0_all.deb```

```sudo apt-get update```

```sudo apt-get install erlang-base erlang-crypto erlang-syntax-tools erlang-inets \erlang-mnesia erlang-runtime-tools erlang-ssl erlang-public-key erlang-asn1 \erlang-os-mon erlang-snmp erlang-xmerl```

Download the Debian package lorawan-server-*.deb and install it by:

```sudo wget https://github.com/gotthardp/lorawan-server/releases/download/v0.6.7/lorawan-server_0.6.7_all.deb```

```sudo dpkg -i lorawan-server_0.6.7_all.deb```

start automatically after system reboot

```sudo systemctl enable lorawan-server```

The server by default binds itself to port 8080. But this is also the port used by the thingsboard installed above. As such we need to change the port it binds to as shown below:

Static server configuration is defined in ```/usr/lib/lorawan-server/releases/0.6.7/sys.config```
Edit sys.config  by changing ```{http_admin_listen, [{port, 8080}]}``` to  ```{http_admin_listen, [{port, 8084}]}```.

Review the sys.config and modify where needed. After updating the configuration you need to restart the server.
Then start the server by ```systemctl restart lorawan-server```

**Lorawan Server Setup**
1. After opening LoraWan server, the first thing to setup is the area under infrastructure.
![GENRAL HERDWARE SETUP](/images/area.png)

2. Proceed to Gateways under infrastructure and create a gateway there. Make sure to add the area you created above. Add the spicific details for your gateway and save.
![GENRAL HERDWARE SETUP](/images/gateway.png)

3. Now proceed to network under infrastructure and create network. For NetID you can chose any random six characters. For European region(EU 868MHz) you can refer to the image below. Remember to fill ADR and Channels before saving changes. 
![GENRAL HERDWARE SETUP](/images/network.png)

![GENRAL HERDWARE SETUP](/images/ADR.png)

4. After network we will now create the Handler under Backend. Make sure to fill the uplink fields
appropriately. You should not forget to include data, datetime, port, rssi, devaddr, desc etc. 
![GENRAL HERDWARE SETUP](/images/handler.png)

5. The next step is creating a Connector under Backends. On the application part you should input the handler you just created. Make sure that what you enter as publish uplink matches the topic you will enter in the mqtt-in node on Nodered. If you implemented authentication for you mqtt broker then you should add it on the authentication tab otherwise leave it blank.

**NB** It is advisable to use localhost other than the ip address of the pi when doing various setups. This includes the URI on connector and the MQTT-in node on Nodered. This is to avoid things failing when the ip address of the pi changes or the pi is not connected to any network. 
![GENRAL HERDWARE SETUP](/images/connector.png)

6. The next step is creating the group under devices. You should chose the network you created in step number 3.
![GENRAL HERDWARE SETUP](/images/group.png)

7. Now proceed and create profile. Make sure to enter the Handler you created when filling the  application field. 
![GENRAL HERDWARE SETUP](/images/profile.png)

8. The next step is adding the node in  commissioned under Devices. Under Description you should add the access token you obtain after adding the device on Thingsboard. 
![GENRAL HERDWARE SETUP](/images/commissioned.png)

**NB** It is advisable to create different profiles, handlers and connectors for each type of device you have. In publish Uplinks in the connector; you should give them unique phrases and create a respective mqtt-in node for each device type in Nodered. This enables building a scalable system that accomodates many LoraWan device types.