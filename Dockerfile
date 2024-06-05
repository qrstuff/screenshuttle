# Use the official AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:20

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Install chrome-aws-lambda and puppeteer-core
RUN npm install chrome-aws-lambda puppeteer-core

# Copy function code
COPY . .

# Command to run the Lambda function
CMD [ "handler.capture" ]
