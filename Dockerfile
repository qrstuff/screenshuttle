FROM public.ecr.aws/lambda/nodejs:20

RUN npm i -g yarn

RUN yarn add @sparticuz/chromium puppeteer-core

COPY package.json yarn.lock ${LAMBDA_TASK_ROOT}

RUN yarn install --frozen-lockfile

COPY . ${LAMBDA_TASK_ROOT}

CMD ["app.handler"]
