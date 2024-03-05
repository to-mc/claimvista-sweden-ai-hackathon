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
