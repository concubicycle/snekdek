#!/bin/bash

# exit when any command fails
set -e


USER=saveliyb
HOST=40.117.142.224

APP_DIR=..
APP_CSPROJ=$APP_DIR/snekdek.csproj

BUILD_DIR=$APP_DIR/bin/Release/netcoreapp2.2/publish/
PUBLISH_DIR=/home/saveliyb/app


########################
## APP: 

# Build project
dotnet publish -c Release $APP_DIR

# Stop auth service 
# ssh $USER@$HOST 'systemctl stop snekdek.service'

# Detele currently deployed folder
ssh $USER@$HOST "rm -rf $PUBLISH_DIR"

# Copy publish folder over to server
scp -rp $BUILD_DIR $USER@$HOST:$PUBLISH_DIR

# Start systemd service, which will restart the auth app
sudo ssh $USER@$HOST 'systemctl start snekdek.service'



echo "All done!"