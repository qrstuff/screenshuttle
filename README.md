# screenshuttle

This project provides a service to capture screenshots or PDFs of web pages using AWS Lambda and Puppeteer.
The service can be configured to capture specific elements, hide certain elements, and set custom dimensions and formats for the output.

## Usage

Clone the project and install dependencies (only required for code-completion) using [Yarn](https://yarnpkg.com/):

```shell
yarn install
```

Build and run the [Docker](https://www.docker.com/) image:

```shell
# build Docker image
docker build -t screenshuttle .

# start a test container
docker run -it --rm -p 8080:8080 screenshuttle
```

Test [Lambda](https://aws.amazon.com/lambda/) execution by sending a test event:

```shell
curl -X POST "http://127.0.0.1:8080/2015-03-31/functions/function/invocations" -H "content-type: application/json" -d '{"url": "http://example.com/"}'
```

There are more options supported by handler than you can pass as event data e.g., as below:

```json
{
    "url": "http://example.com/",
    "exclude": ["#hide-me", ".hide-me-too"],
    "format": "jpeg", # one of jpeg, pdf or png
    "fullpage": true,
    "selector": "#only-me",
    "width": 1280,
    "heigt": 720
}
```

## License

See the [LICENSE](LICENSE) file for details. Made with ❤️ at [QRStuff](https://qrstuff.com/).
