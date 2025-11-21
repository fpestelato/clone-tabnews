import { InternalServerError, MethodNotAllowed } from "infra/errors";

function noMatchHandler(request, response) {
  const publicError = new MethodNotAllowed();
  response.status(publicError.statusCode).json(publicError);
}

function errorHandler(error, request, response) {
  const publicError = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicError);

  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: noMatchHandler,
    onError: errorHandler,
  },
};

export default controller;
