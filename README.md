
# screenshuttle

This project provides a service to capture screenshots or PDFs of web pages using AWS Lambda and Puppeteer. The service can be configured to capture specific elements, hide certain elements, and set custom dimensions and formats for the output.

## Features

- Capture screenshots in PNG or JPEG format
- Capture PDFs
- Specify CSS selectors to capture specific elements
- Hide elements using CSS selectors before capturing
- Set custom dimensions for the viewport
- Capture full page or visible part only

## Setup and Deployment

### Prerequisites

- Node.js and npm/yarn installed
- Serverless Framework installed globally (`npm install -g serverless`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/screenshot-capture
   cd screenshot-capture
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Configuration

The configuration for the service is defined in the `serverless.yml` file. The Lambda function is configured to run on AWS, with Puppeteer set up to work in a Lambda environment using `serverless-plugin-chrome`.

### Deployment

1. Deploy the service using Serverless Framework:
   ```bash
   serverless deploy
   ```

2. Note the endpoint URL provided after deployment.

## Usage

### API Endpoint

The service exposes an HTTP GET endpoint at the deployed URL. The following query parameters can be used:

- `url` (required): The URL of the web page to capture.
- `type` (optional): The type of output file. Options are `png`, `jpeg`, and `pdf`. Default is `png`.
- `selector` (optional): CSS selector of the element to capture.
- `hideSelector` (optional): CSS selector of elements to hide before capturing.
- `width` (optional): Width of the viewport in pixels. Default is 1920.
- `height` (optional): Height of the viewport in pixels. Default is 1080.
- `fullpage` (optional): Capture the full page (`true`) or only the visible part (`false`). Default is `false`.

### Examples

- Capture a full-page PNG screenshot:
  ```
  https://<your-api-id>.execute-api.<your-region>.amazonaws.com/dev/capture?url=https://example.com&type=png&fullpage=true
  ```

- Capture a screenshot of a specific element:
  ```
  https://<your-api-id>.execute-api.<your-region>.amazonaws.com/dev/capture?url=https://example.com&type=png&selector=.specific-element
  ```

- Capture a screenshot hiding specific elements:
  ```
  https://<your-api-id>.execute-api.<your-region>.amazonaws.com/dev/capture?url=https://example.com&type=png&hideSelector=.ads
  ```

## Project Structure

- `capture.js`: Contains the logic to capture screenshots or PDFs using Puppeteer.
- `handler.js`: Lambda function handler that processes the HTTP requests and captures the content.
- `serverless.yml`: Serverless Framework configuration file.
- `package.json` and `yarn.lock`: Project dependencies.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.