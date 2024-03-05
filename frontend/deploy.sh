#!/bin/bash
source env.var
npm install
npm run build

configDataSource='{
    "name": "mongodb-atlas",
    "type": "mongodb-atlas",
    "config": {
        "clusterName": "'$ATLAS_CLUSTER_NAME'",
        "readPreference": "primary",
        "wireProtocolEnabled": false
    },
    "version": 1
}'

configAppService='{
    "config_version": 20210101,
    "app_id": "'$ATLAS_CLUSTER_NAME'",
    "name": "'$APPLICATION_NAME'",
    "location": "US-VA",
    "deployment_model": "GLOBAL"
}'
configHosting='{
    "enabled": true,
    "app_default_domain": "'$REALM_CLIENT_APP_ID.mongodbstitch.com'"
}'

appservices login --api-key=$ATLAS_PUBLIC_API_KEY --private-api-key=$ATLAS_PRIVATE_API_KEY
cp -vaR build/ backend/hosting/files
cd backend
echo "$configDataSource" > data_sources/mongodb-atlas/config.json
echo "$configHosting" > hosting/config.json
echo "$configAppService" > realm_config.json
appservices push -y --project="$ATLAS_PROJECT_ID" --remote="$REALM_CLIENT_APP_ID" --include-hosting 
cat hosting/config.json 