# Cancer Detection App

## Introduction
Welcome to the Cancer Detection App! This app is designed to assist in the early detection of skin cancer using cutting-edge AI technology. It's developed with React Native Expo for a seamless mobile experience. Our app integrates an AI model from Hugging Face API to analyze images for potential cancer signs.

## Features
- **AI-Powered Cancer Detection:** Utilize an AI model for analyzing skin images.
- **User Management:** Secure signup and login functionalities for users and admins.
- **Pharmacy Management:** (Admin) Add and manage pharmacy listings.
- **Secure Storage:** Use Firebase for secure image storage.

## Tech Stack
- **Frontend:** React Native Expo
- **AI Model:** Hugging Face API
- **Backend:** Node.js, Express.js
- **Database:** MySQL hosted on DigitalOcean
- **Storage:** Firebase Storage

## APIs Overview
- **Authentication:** Signup and login with JWT token generation and verification.
- **User Management:** Add, fetch, and delete user data.
- **Pharmacy Management:** CRUD operations for pharmacies.
- **Logs Management:** Create and retrieve logs.

# Installation
1. Clone the repo: 
```bash
git clone https://github.com/MaskedAlkindi/Cancer-Detection-App.git
```
# Database

## MYSQL
1. Create new instance mysql database on digitalocean
2. Use the database sechma tables that are in `Database/MYSQL/DatabaseSchema.txt`
3. Store the Database credentials (Host, Username, Password, Port) 


## APIS
1. Cd to Database/APIS folder
2. Install dependencies: `npm install`
```bash
npm install
```
3. Start new project in firebase and select on storage option and get the configration and replace firebase.js with your credentials 
4. Get your admin SDK from firebase and name it store-cancer-firebase-adminsdk-4ddax-0af43b4a89.json and put it inside certificates folder 
5. Get your CA Certifcate and put in certificates folder, make sure its name `ca-certificate.crt`
6. Change .env.example to .env and replace credentials
7. if you want to generate a jwt secret from cmd powershell `[guid]::NewGuid().Guid`
8. Now you can test out the apis using `node index.js`
```bash
node index.js
```
9. You can depoly on digitalocean by connecting your repo and defing the route to this file make sure to define out the enviromental variables there and encrypt password for db and jwt secret 


# Mobile Application code
1. cd to MobileApp folder
2. Install dependencies: `npm install`
```bash
npm install
```
3. Run the application using expo: `npx expo start`
```bash
npx expo start
```
# AI Model API
1. Get your api key here from here[https://huggingface.co/gianlab/swin-tiny-patch4-window7-224-finetuned-skin-cancer]

2. Go to MobileApp/services and then edit handleGetPrediction.js

3. insert your api key here: `const apiToken = '';`

# Connecting app with Database
1. go to constants/APIURLS.ts 
2. replace baseUrl with your Api link from digital ocean


## Screenshots
### Login Page
![Login Page](/Screenshots/LoginPage.jpeg)

### Signup Page
![Signup Page](/Screenshots/SignupPage.jpeg)

### Upload Picture Page (User)
![Upload Picture Page](/Screenshots/UploadPicturePage.jpeg)

### Upload Picture Page 2 (with photo selected) (User)
![Upload Picture Page 2](/Screenshots/UploadPicturePage2.jpeg)

### Results Modal (User)
![Results Modal](/Screenshots/Results.jpeg)

### Recommendations Page (User)
![Recommendations Page](/Screenshots/recommendations.jpeg)

### Add Pharmacy Page (Admin)
![Add Pharmacy Page](/Screenshots/addpharmacy.jpeg)


## License
This project belongs to Hajid Alkindi, feel free to use as long as you give credit for the foundation work.



