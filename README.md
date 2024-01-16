# Social Media Analytics Microservice

## This app is built using Fastify
## Setup and Run

1. Install dependencies: `npm install`
2. Set up environment variables: Create a `.env` file and configure as specified in the provided template.
3. Run the application: `npm run dev`


## Future Improvements

1. **Scalability with AWS Lambda and SQS**
   - Utilize AWS Lambda for computation tasks, like finding word count and average word length.
   - Implement SQS (Simple Queue Service) for storing messages, ensuring scalable and asynchronous processing.
   - Set up a Dead Letter Queue (DLQ) for retry mechanisms, ensuring a zero-point of failure in message processing.


## Assumptions and Decisions
- Assumed that the application would be deployed in a cloud environment for better scalability and availability.
- Chose MySQL for the relational database due to the structured nature of the data.
- Used Sequelize ORM to simplify database interactions.
- Rate limiting is implemented based on IP addresses to prevent abuse.
