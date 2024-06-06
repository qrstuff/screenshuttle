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

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/qrstuff/screenshuttle/
   cd screenshuttle
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

## Usage

```bash
docker build -t screenshuttle .

docker run -it --rm -p 9090:8080 screenshuttle
```

Create event.json in main folder with sample data:

```
{
  "queryStringParameters": {
    "url": "https://example.com",
    "type": "png",
    "width": "1920",
    "height": "1080",
    "fullpage": "true"
  }
}
```

```
curl -XPOST "http://localhost:9090/2015-03-31/functions/function/invocations" -d @event.json
```

### API Endpoint

The service exposes an HTTP GET endpoint at the deployed URL. The following query parameters can be used:

- `url` (required): The URL of the web page to capture.
- `format` (optional): The format of output file. Options are `png`, `jpeg`, and `pdf`. Default is `png`.
- `selector` (optional): CSS selector of the element to capture.
- `exclude` (optional): CSS selector of elements to hide before capturing.
- `width` (optional): Width of the viewport in pixels. Default is 1920.
- `height` (optional): Height of the viewport in pixels. Default is 1080.
- `fullpage` (optional): Capture the full page (`true`) or only the visible part (`false`). Default is `false`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
