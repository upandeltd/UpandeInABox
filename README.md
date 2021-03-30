# ROSSLY SOLAR

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

```sudo wget ```

```sudo dpkg -i thingsboard-3.2.2.deb```

```sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo```

```sudo service thingsboard start```

**NB** It takes upto 300 seconds for thingsboard to start. Be patient with it. It will eventually start at port 8080.

****

=======
## ROSSLY SOLAR
### DESCRIPTION
Rossly Solar project aims at having a minimalistic setup of the whole Vipimo stack running on a single board computer preferably the raspberryPi. This provides an oportunity for having an E2E IoT system setup within a closed network that works offline possibly in power deficient environment.
### OBJECTIVES
At every instance one undertakes any action within the project it is vital that at the end of whatever task you were carrying out the following objectives are met or targted:

1. Successfully setup and configure Thingsboard, NodeRed, Lorawan Server, and MQTT broker 
2. Correctly establish a solar power system that will power the whole system and be able to provide the total power requirement for the system
3. Rigourously test and validate the system fuctionality and the operational limits

>>>>>>> aeeae615ac88fcd8b49f19f7a7aed51aecb8fd5b
### STRUCTURE & CONFIGS
Generall Abstracted View

1. Software Modules

        i.   Thingsboard
             Within the repository, you will find a customized(configured to match Vipimo Brand) debian package of the thingsboard 2.4.0.
            
             1. Install postgresql
             2. Create a database called thingsboard
             3. create a user called "thingsboard" with password "upandegani"
             4. install java 8 and configure it to be one used by the system
             5. unpack the thingsboard debian package
             6. run the install command for the thingsboard
             7. Enable it to start at boot
        ii.  Node-red
             1. Install nodejs and npm (use the LTS)
             2. From the nodered installation page, follow the instruction to install pi specific node-red
<<<<<<< HEAD
             3. Setup the node management flow
=======
>>>>>>> aeeae615ac88fcd8b49f19f7a7aed51aecb8fd5b
        iii. Lorwan Server
            
        iv.  MQTT Broker
2. Hardware Modules

        i   Solar Panel(s)
        ii  Rechargable Battery
        iii Single Board Computer, Preferable RPi 4 4GB
        iv  Solar Charge Controller"# ROSSLYN-SOLAR" 
