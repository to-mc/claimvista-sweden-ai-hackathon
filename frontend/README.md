# Claims Management System

This Claims Management System is a React-based application designed to streamline the process of creating, managing, and finding insurance claims. It utilizes Material-UI for a polished, user-friendly interface and includes features such as claim creation, search functionality, and a detailed view of claims with similar cases and cost estimates.

## Features

- **Home View**: Initial landing page that directs users to different parts of the application.
- **Create Claim View**: Allows users to submit new claims with relevant details.
- **Manage Claim View**: Lists unhandled claims and provides an interface for claim management.
- **Find Claim View**: Offers a search functionality to locate claims based on specific criteria.
- **Similar Claims Analysis**: Upon selecting a claim, the system fetches and displays similar claims, including an average cost estimate to aid in evaluation.

## Setup and Installation

Ensure you have [Node.js](https://nodejs.org/) installed on your system to run this project.

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd claims-management-system
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Usage

- **Navigating the Application**: Use the navigation bar at the top to switch between different views.
- **Creating a Claim**: Navigate to the Create Claim view and fill out the form to submit a new claim.
- **Managing Claims**: The Manage Claim view lists all unhandled claims. Click on a claim to view details, similar cases, and suggested cost estimates.
- **Finding Claims**: Use the search bar in the Find Claim view to search for claims. The system will display matching results below the search bar.

## Contributing

Contributions to improve the Claims Management System are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.


## Creating and Deploying Application
## Prerequistes

1. Created a new MongoDB Atlas project for your LOTR app
2. Created a new cluster inside that project for LOTR data that is running
3. Created an API Key inside that project, and recorded the public and private api keys,for more information see https://www.mongodb.com/docs/atlas/configure-api-access/#create-an-api-key-for-a-project
4. Installed dependencies for this script: node, mongodb-realm-cli"


## Install AppServices CLI
```
npm install -g atlas-app-services-cli
```

## Update env.var

Update the env.var to reflect your settings, you will need to update.


Example:
```
ATLAS_CLUSTER_NAME=demo-cluster
ATLAS_PUBLIC_API_KEY=wancyeds
ATLAS_PRIVATE_API_KEY=db235axa-xdyd-3543-b534-19fe60e755ef
ATLAS_PROJECT_ID=5f49dca27a4f7e35487f7e0c
APPLICATION_NAME=lotr2
REALM_CLIENT_APP_ID=
```

## Create an New App in Atlas App Services
You will need to create an App in Atlas services. You can do it with a script, running setup.sh. You can also do it using the UI.

```
./setup.sh
```

env.var example:
```
ATLAS_CLUSTER_NAME=demo-cluster
ATLAS_PUBLIC_API_KEY=wancyeds
ATLAS_PRIVATE_API_KEY=db235axa-xdyd-3543-b534-19fe60e755ef
ATLAS_PROJECT_ID=5f49dca27a4f7e35487f7e0c
APPLICATION_NAME=lotr2
REALM_CLIENT_APP_ID=lotr-alugj
```
## Update the configuration for the React Application
Update the API_BASE_URL and CHART_BASE_URl

src/config.js example:
```
const config = {
  API_BASE_URL:
    "https://eu-central-1.aws.data.mongodb-api.com/app/atlas_app_id}/endpoint",
  CHART_BASE_URL:
    "https://charts.mongodb.com/charts-tom-mccarthy-demo-project-giexs",
  CHART_ID: "65e5f2bd-904d-46f8-8edb-57967c61d00f",
};
```

### Deploy application to App Services

Run below command in the root of repo, it will build the application and deploy it to App Services
```
./deploy.sh
```

### Access the application 
You can now access the application from the endpoint described, in hosting/config.json   

Example below:
```
"app_default_domain": "lotr-alugj.mongodbstitch.com"
