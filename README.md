# BOM Report

## Overview
The BOM Report project provides a Bill of Materials (BOM) report for products. It displays a detailed table of components used in a product, including quantities, unit prices, and total costs. The project is built with React and includes a login functionality to access the BOM report.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites
- Node.js and npm installed on your machine.
- Git installed on your machine
- MSSQL installed and configured on your machine

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChellaVigneshKP/bom-report.git
   cd bom-report
   cd node_auth
   npm install
   cd ..
   cd react_auth
   npm install
   ```
2. **MSSQL Initialization**:
   - Start the MSSQL server
   - Run the Query present in SQL Query.txt

3. **Backend Initialization**: 
- Configure the DB Configuration according to the Local setup of your machine
- Run the follwing commands in new Terminal-1
  ```bash
  cd bom-report/node_auth/
  node server.js
  ```
4. **Frontend Initialization**: 
- Run the following commands in new Terminal-2
  ```bash
  cd bom-report/react_auth
  npm start
  ```
5. **User Initialization**:
- Open any desired Browser
- Search for http://localhost:5000/init
- This will initialize the User Credentials
6. **Access Application**:
- Login with Default Credentials as [User: user1] [password: password] in http://localhost:3000
