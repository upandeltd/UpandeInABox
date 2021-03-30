## ROSSLY SOLAR
### DESCRIPTION
Rossly Solar project aims at having a minimalistic setup of the whole Vipimo stack running on a single board computer preferably the raspberryPi. This provides an oportunity for having an E2E IoT system setup within a closed network that works offline possibly in power deficient environment.
### OBJECTIVES
At every instance one undertakes any action within the project it is vital that at the end of whatever task you were carrying out the following objectives are met or targted:

1. Successfully setup and configure Thingsboard, NodeRed, Lorawan Server, and MQTT broker 
2. Correctly establish a solar power system that will power the whole system and be able to provide the total power requirement for the system
3. Rigourously test and validate the system fuctionality and the operational limits

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
             3. Setup the node management flow
        iii. Lorwan Server
            
        iv.  MQTT Broker
2. Hardware Modules

        i   Solar Panel(s)
        ii  Rechargable Battery
        iii Single Board Computer, Preferable RPi 4 4GB
        iv  Solar Charge Controller"# ROSSLYN-SOLAR" 
