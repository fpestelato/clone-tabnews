import useSWRT from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWRT("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} />
      <DatabaseInfo isLoading={isLoading} data={data} />
    </>
  );
}

function UpdatedAt({ isLoading, data }) {
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização em {updatedAtText}</div>;
}

function DatabaseInfo({ isLoading, data }) {
  return (
    <>
      <h2>Database</h2>
      <div>
        {isLoading && !data?.dependencies?.database ? (
          "Carregando..."
        ) : (
          <>
            <div>Versão: {data.dependencies.database.version}</div>
            <div>
              Conexões abertas: {data.dependencies.database.opened_connections}
            </div>
            <div>
              Conexões máximas: {data.dependencies.database.max_connections}
            </div>
          </>
        )}
      </div>
    </>
  );
}
