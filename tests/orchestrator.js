import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(_, tries) {
      if (tries >= 25) {
        console.log(
          `> Trying to connect to Webserver #${tries}. Are you running the server with "npm run dev"?`,
        );
      }

      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      await response.json();
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
