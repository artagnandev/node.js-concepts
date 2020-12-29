const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidV4');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { id, title, url, techs, likes } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  repoIndex === -1 && response.status(400).json({ error: "Repository does not exists." })

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  repoIndex >= 0 
    ? repositories.splice(repoIndex, 1)
    : response.status(204).json({ error: "Repository does not exists." });

  return response.json(repositories);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  repoIndex === -1 && response.status(400).json({ error: "Repository does not exists." })

  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex])
});

module.exports = app;
