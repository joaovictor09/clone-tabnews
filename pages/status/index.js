import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />

      <h1>Banco de dados</h1>
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAt = "Carregando...";

  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAt}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (!isLoading && data) {
    const infoMaxConnections = data.dependencies.database.max_connections;
    const infoOpenedConnection = data.dependencies.database.opened_connections;
    const infoVersion = data.dependencies.database.version;

    return (
      <div>
        <li>
          <span>Máximo de conexões: {infoMaxConnections}</span>
        </li>
        <li>
          <span>Conexões abertas: {infoOpenedConnection}</span>
        </li>
        <li>
          <span>Versão: {infoVersion}</span>
        </li>
      </div>
    );
  }

  return <div>Carregando...</div>;
}
