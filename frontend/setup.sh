#!/bin/bash
source env.var
echo "creating realm app"
realm-cli login --api-key $ATLAS_PUBLIC_API_KEY --private-api-key $ATLAS_PRIVATE_API_KEY
realm-cli apps create -y -n "$APPLICATION_NAME" --project="$ATLAS_PROJECT_ID" --cluster="$ATLAS_CLUSTER_NAME"
description=$(realm-cli app describe --app $APPLICATION_NAME)
APP_ID=$(echo $description | sed 's/^.*client_app_id": "\([^"]*\).*/\1/')
echo "updating APP_ID to $APP_ID"
sed -i -E 's/\(REALM_CLIENT_APP_ID=\).*/\1'$APP_ID'/g' env.var