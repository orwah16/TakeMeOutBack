# TakeMeOutBack

# this is the backend for TakeMeOut app 
GitOps repository: https://github.com/orwah16/TakeMeOutBackGitOps <br/>
FrontEnd repository:  https://github.com/orwah16/TakeMeOut <br/>
### it uses: 
 - Postgres for relational database
 - node.js with expres.js for CRUD operations
 - Redux for state management
 - Firebase for authentication and saving images
 - Docker Compose for containerizing the app and db for testing
 - Github Actions for CI and building new image
 - the Ci pushes the new image to dockerhub and if succesful it triggers the CD in TakeMeOutBackGitOps repository 
 - Terraform for provisioning the infrastructure
 - deployed to AWS EKS (includes two clusters each with a bastion hosts for ssh and loadbalancer for traffic)
 - using Prometheus for scraping metrics
 - Graphana for monitoring

![alt text](./Images/CI1.png?raw=true)
![alt text](./Images/CI2.png?raw=true)
