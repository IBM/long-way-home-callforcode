# Long Way home Web App

## Description

This Repo houses the Long way home Application, which was developed as part of the Call For Code competition.
The long way home application attempts to re-unit aid seekers with family members / guardians using facial recognition technology. 
It provides a platform in which family members may upload pictures and information of a missing loved one, in conjunction, an aid worker can upload the image of an aid seeker and be shown those missing persons posts that most resemble them.
The Aid worker can then use the contact information provided to organize a re-uniting.

### Links
#### Home page for family members to report loved ones missing:
https://long-way-home.eu-de.mybluemix.net/

#### Page for NGO workers to report people that they have found:
https://long-way-home.eu-de.mybluemix.net/ngo

#### Page for authorized NGO workers to search for matches of people that have been found by the NGO
https://long-way-home.eu-de.mybluemix.net/review

This site would require NGO workers to authenticate themselves before accessing.

### Data Privacy
This application would require the collection and searching of sensitive user data.
For this reason, when a match is made and confirmed, all data relating to the person is removed.
Data would also be kept separately for each natural disaster / region and would be removed after normality is restored.

## Example User case:

#### User Case : Match the aid seeker to missing person

#### Use Case Description:
This use case demonstrates how the “Long Journey Home” App uses a face match feature to facilitate an authorised NGO\Emergency Services official to match the aid seekers with family members through the registered missing person.

##### Actors:
- Primary Actor: NGO\Emergency Services official (tasked with reuniting aid seekers with next of kin).

##### Normal Flow:
- CONDUCT SEARCH:
	Once a relief worker upload a photo of an aid seeker to "Long Journey Home", 	the search process is originated. "Long Journey Home" takes the photo and 	compares it to all faces in the missing person database, in order to find the 	similar faces.
- RECEIVING MATCH:
	The "Long Journey Home" App returns potential matched face/s (possible more 	than one matched faces returned) to the relief worker. 
- VERIFICATION:
	The relief worker analyses all matched photos visually, and conduct further 	investigation based on the information that provided with the missing person 	against the information provided by the aid seeker (if available) and may 	conducts  interviews if feasible due to situations such as language barrier, and 	location difference.


## Technical Overview

### WebApp
The Webapp is built using **React** UI framework.
The Face detection is made possible by using the following Open source library
[face-api.js](https://github.com/justadudewhohacks/face-api.js).


This library makes use of pre trained neural networks to handle face detection, face orientation and face encoding.
The library makes use of **tensorflow.js**, a porting of the popular data machine learning framework ported to javascript for use in the browser.

The reason for the face detection and encoding being performed in the browser rather than in the cloud as it Allows for less dependence on Network connection to perform searches.

### Backend
The backend is made up of:

- python web app. Running on **Cloud Foundry** on IBM Cloud. This Uses the fask server library. It exposes endpoints to post new photo encodings to cloudant, or to retrieve a list of existing encodings.
- **Cloudant DB**. The Cloudant DB stores all info on Missing persons apart from the image data itself.
Cloudant is used to query and index the data.
- **Cloud Object Storage**: Used to store and retrieve the image data.
The web client retrieves the images from the cloud storage buckets directly

### Build and Deployment
Building and deploying of the app are automatically handled by **IBM toolkit**.
New merges to this repo trigger a build and subsequent deploy of new code to cloud foundry.


## Running Locally

### Clone repo
`git clone git@github.ibm.com:callforcode-long-way-home/long-way-home.git`

### Build and Run the UI
The UI is build using yarn. This will need to be installed before running.
```bash
cd webapp
yarn install
yarn start
```

### Run the python server

The python server can be started with the following command from within the project root dir.

`python ./app.py`

The Backend server relies on the following environment variables. Add a `.env` file with the following values.

```
PORT=5000

DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_API_KEY=

COS_BUCKET=long-way-home-images

COS_ACCESS_KEY_ID=
COS_SECRET_ACCESS_KEY=
COS_INSTANCE_ID=
COS_AUTH_ENDPOINT=
COS_ENDPOINT=

```

## Referenced Work

### face-api.js
face-api.js is the open source library that handles the face detection and recognition. It can be found [here](https://github.com/justadudewhohacks/face-api.js).

## Further Work
### Video processing
After a natural disaster there is often a large amount of videos and images of the event being uploaded to news sites and social networks such as twitter. 
Additionally, Aid workers may use body cams in certain circumstances when working in an area after a natural disaster.

The Long way home application could be extended to make use of these video and image sources to detect and register faces.

Each image would be processed to retrieve all unique faces. When a family member creates a missing person post, the missing person could be matched with one that was taken from a news report, twitter post etc. This hopefully help in the search for the missing person as the location of where the video was taken would be available.
