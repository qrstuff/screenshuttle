# Use the official AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:20

RUN npm i -g yarn

# Install chromium and puppeteer-core
RUN yarn add @sparticuz/chromium puppeteer-core

# Install dependencies
COPY package.json yarn.lock ${LAMBDA_TASK_ROOT}

RUN yarn install --frozen-lockfile

# Copy function code
COPY . ${LAMBDA_TASK_ROOT}

# Command to run the Lambda function
CMD [ "app.handler" ]
